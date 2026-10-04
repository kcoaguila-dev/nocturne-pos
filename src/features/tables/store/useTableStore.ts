import { create } from 'zustand';
import type { TableSession } from '../types';

interface TableState {
  tables: TableSession[];
  setTables: (tables: TableSession[]) => void;
  updateTableRemainingTime: (id: string, remainingTime: number) => void;
}

// Dummy data
const now = new Date();
const table1 = {
  id: '1',
  table_number: 'VIP-1',
  opened_at: new Date(now.getTime() - 40 * 60000).toISOString(), // Opened 40 mins ago
  set_duration_minutes: 60,
  remainingTime: 20 * 60, // 20 mins left
  status: 'active'
};

const table2 = {
  id: '2',
  table_number: 'Box-A',
  opened_at: new Date(now.getTime() - 50 * 60000).toISOString(), // Opened 50 mins ago
  set_duration_minutes: 60,
  remainingTime: 10 * 60, // 10 mins left (warning)
  status: 'active'
};

const table3 = {
  id: '3',
  table_number: 'Counter-1',
  opened_at: new Date(now.getTime() - 65 * 60000).toISOString(), // Opened 65 mins ago
  set_duration_minutes: 60,
  remainingTime: -5 * 60, // 5 mins expired
  status: 'active'
};

export const useTableStore = create<TableState>((set) => ({
  tables: [table1, table2, table3],
  setTables: (tables) => set({ tables }),
  updateTableRemainingTime: (id, remainingTime) => set((state) => ({
    tables: state.tables.map(t => t.id === id ? { ...t, remainingTime } : t)
  })),
}));
