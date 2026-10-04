import { create } from 'zustand';
import type { CastMember, CastAssignment, CastRole } from '../types';

interface CastState {
  castMembers: CastMember[];
  assignments: CastAssignment[];

  assignCast: (castId: string, sessionId: string, role: CastRole) => void;
  unassignCast: (castId: string) => void;
  updateCastStatus: (castId: string, status: CastMember['status']) => void;
}

const dummyCastMembers: CastMember[] = [
  { id: 'c1', stage_name: 'Ami', base_hourly_rate: 3000, point_tier: 'gold', status: 'available' },
  { id: 'c2', stage_name: 'Rena', base_hourly_rate: 2500, point_tier: 'silver', status: 'available' },
  { id: 'c3', stage_name: 'Hana', base_hourly_rate: 4000, point_tier: 'platinum', status: 'on_break' },
  { id: 'c4', stage_name: 'Yuka', base_hourly_rate: 2000, point_tier: 'standard', status: 'available' },
];

export const useCastStore = create<CastState>((set) => ({
  castMembers: dummyCastMembers,
  assignments: [],

  assignCast: (castId, sessionId, role) => set((state) => {
    const now = new Date().toISOString();

    // Remove any existing assignment for this cast member
    const filteredAssignments = state.assignments.filter(a => a.cast_id !== castId);

    const newAssignment: CastAssignment = {
      id: `assign_${Date.now()}`,
      session_id: sessionId,
      cast_id: castId,
      role,
      started_at: now,
    };

    return {
      assignments: [...filteredAssignments, newAssignment],
      castMembers: state.castMembers.map(c =>
        c.id === castId ? { ...c, status: 'seated' } : c
      )
    };
  }),

  unassignCast: (castId) => set((state) => ({
    assignments: state.assignments.filter(a => a.cast_id !== castId),
    castMembers: state.castMembers.map(c =>
      c.id === castId ? { ...c, status: 'available' } : c
    )
  })),

  updateCastStatus: (castId, status) => set((state) => ({
    castMembers: state.castMembers.map(c =>
      c.id === castId ? { ...c, status } : c
    )
  })),
}));
