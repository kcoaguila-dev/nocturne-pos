import { useEffect, useState } from 'react';
import { supabase } from '@/shared/api/supabase';
import { useTableStore } from '../store/useTableStore';
import type { TableSession } from '../types';

function calculateRemainingTime(openedAt: string, durationMinutes: number) {
  const start = new Date(openedAt).getTime();
  const now = new Date().getTime();
  const elapsedSeconds = Math.floor((now - start) / 1000);
  const totalDurationSeconds = durationMinutes * 60;
  return totalDurationSeconds - elapsedSeconds;
}

export const useLiveTables = () => {
  const { setTables, upsertTable, removeTable } = useTableStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialTables = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('table_sessions')
          .select('*')
          .eq('status', 'active');

        if (error) throw error;

        if (data) {
          const sessions: TableSession[] = data.map((row: any) => ({
            id: row.id,
            table_number: row.table_number,
            opened_at: row.opened_at,
            set_duration_minutes: row.set_duration_minutes,
            status: row.status,
            remainingTime: calculateRemainingTime(row.opened_at, row.set_duration_minutes),
          }));
          setTables(sessions);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialTables();

    const subscription = supabase
      .channel('table_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'table_sessions',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as any;
            if (row.status === 'active') {
              const session: TableSession = {
                id: row.id,
                table_number: row.table_number,
                opened_at: row.opened_at,
                set_duration_minutes: row.set_duration_minutes,
                status: row.status,
                remainingTime: calculateRemainingTime(row.opened_at, row.set_duration_minutes),
              };
              upsertTable(session);
            } else {
              // If status changed to inactive (e.g. closed), remove it from active tables
              removeTable(row.id);
            }
          } else if (payload.eventType === 'DELETE') {
            const row = payload.old as { id: string };
            removeTable(row.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [setTables, upsertTable, removeTable]);

  return { loading, error };
};
