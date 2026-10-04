import React, { useEffect, useState } from 'react';
import { Clock, X, PlusCircle } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { useTableStore } from '../store/useTableStore';
import { useCastStore } from '@/features/cast';
import { useOrderStore, TableDetailModal } from '@/features/orders';
import type { TableSession } from '../types';

const formatTime = (seconds: number) => {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const minutes = Math.floor(absSeconds / 60);
  const remainingSeconds = Math.floor(absSeconds % 60);
  return `${isNegative ? '-' : ''}${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatDuration = (isoString: string) => {
  const start = new Date(isoString).getTime();
  const now = new Date().getTime();
  const diffMinutes = Math.floor((now - start) / 60000);
  return `${diffMinutes}m`;
};

const TableCard: React.FC<{ table: TableSession }> = ({ table }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: table.id,
    data: table,
  });

  const { assignments, castMembers, unassignCast } = useCastStore();
  const { getOrdersForSession } = useOrderStore();
  const [, setTick] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Force re-render every minute to update duration
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const tableAssignments = assignments.filter(a => a.session_id === table.id);

  const getStatusColor = (remainingTime: number) => {
    const minutesLeft = remainingTime / 60;
    if (minutesLeft <= 0) return 'bg-red-900 border-red-500 text-red-100'; // Expired
    if (minutesLeft <= 10) return 'bg-amber-900 border-amber-500 text-amber-100'; // Warning
    return 'bg-green-900 border-green-500 text-green-100'; // Active
  };

  const roleColors = {
    hon_shime: 'bg-pink-600 text-pink-100',
    jonai_shime: 'bg-purple-600 text-purple-100',
    help: 'bg-blue-600 text-blue-100',
  };

  const roleLabels = {
    hon_shime: 'Main',
    jonai_shime: 'In-house',
    help: 'Help',
  };

  const activeOrders = getOrdersForSession(table.id).filter(o => o.status === 'active');
  const subtotal = activeOrders.reduce((sum, order) => sum + order.price, 0);

  return (
    <>
    <div
      ref={setNodeRef}
      className={`relative p-6 rounded-xl border-2 shadow-lg flex flex-col items-center justify-start min-h-[220px] transition-colors duration-300 ${getStatusColor(table.remainingTime)} ${isOver ? 'ring-4 ring-white scale-105' : ''}`}
    >
      <div className="w-full flex justify-between items-start mb-2">
        <div className="text-2xl font-bold">{table.table_number}</div>
        <div className="text-right">
          <div className="text-sm opacity-80">Subtotal</div>
          <div className="font-mono font-bold">¥{subtotal.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xl font-mono mb-4 bg-black/20 px-3 py-1 rounded-full">
        <Clock className="w-5 h-5" />
        <span>{formatTime(table.remainingTime)}</span>
      </div>

      <div className="w-full flex flex-col gap-2 mt-auto">
        {tableAssignments.map(assignment => {
          const cast = castMembers.find(c => c.id === assignment.cast_id);
          if (!cast) return null;
          return (
            <div key={assignment.id} className={`flex items-center justify-between p-2 rounded-md ${roleColors[assignment.role]} bg-opacity-80`}>
              <div className="flex flex-col">
                <span className="font-bold">{cast.stage_name}</span>
                <span className="text-xs opacity-80">{roleLabels[assignment.role]} • {formatDuration(assignment.started_at)}</span>
              </div>
              <button
                onClick={() => unassignCast(cast.id)}
                className="p-1 hover:bg-black/20 rounded-full transition-colors"
                aria-label={`Unassign ${cast.stage_name}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          );
        })}
        {tableAssignments.length === 0 && (
          <div className="text-sm opacity-60 text-center py-2 border-2 border-dashed border-current/30 rounded-lg">
            Drag cast here
          </div>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-4 py-3 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center gap-2 transition-colors font-semibold"
      >
        <PlusCircle className="w-5 h-5" /> Orders ({activeOrders.length})
      </button>
    </div>

    {isModalOpen && (
      <TableDetailModal
        sessionId={table.id}
        tableNumber={table.table_number}
        onClose={() => setIsModalOpen(false)}
      />
    )}
    </>
  );
};

export const FloorMap: React.FC = () => {
  const { tables, updateTableRemainingTime } = useTableStore();

  useEffect(() => {
    const interval = setInterval(() => {
      tables.forEach((table) => {
        updateTableRemainingTime(table.id, table.remainingTime - 1);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tables, updateTableRemainingTime]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 flex-1">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  );
};
