import { create } from 'zustand';
import type { TableSession } from '../types';

interface TableState {
  tables: TableSession[];
  setTables: (tables: TableSession[]) => void;
  upsertTable: (table: TableSession) => void;
  removeTable: (id: string) => void;
  updateTableRemainingTime: (id: string, remainingTime: number) => void;
}

export const useTableStore = create<TableState>((set) => ({
  tables: [],
  setTables: (tables) => set({ tables }),
  upsertTable: (table) => set((state) => {
    const existingIndex = state.tables.findIndex(t => t.id === table.id);
    if (existingIndex >= 0) {
      const newTables = [...state.tables];
      newTables[existingIndex] = table;
      return { tables: newTables };
    } else {
      return { tables: [...state.tables, table] };
    }
  }),
  removeTable: (id) => set((state) => ({
    tables: state.tables.filter(t => t.id !== id)
  })),
  updateTableRemainingTime: (id, remainingTime) => set((state) => ({
    tables: state.tables.map(t => t.id === id ? { ...t, remainingTime } : t)
  })),
}));
