import React, { useState } from 'react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { FloorMap } from '@/features/tables';
import { CastSidebar, useCastStore } from '@/features/cast';
import type { CastRole } from '@/features/cast';

export const FloorMapPage: React.FC = () => {
  const { assignCast } = useCastStore();

  // Track pending assignment to show role selector modal
  const [pendingAssignment, setPendingAssignment] = useState<{castId: string, sessionId: string} | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id && active.id) {
      const castId = active.id as string;
      const sessionId = over.id as string;

      // Instead of defaulting, show a prompt/modal for role
      setPendingAssignment({ castId, sessionId });
    }
  };

  const handleRoleSelect = (role: CastRole) => {
    if (pendingAssignment) {
      assignCast(pendingAssignment.castId, pendingAssignment.sessionId, role);
      setPendingAssignment(null);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {/* Left Sidebar for Cast */}
        <CastSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <header className="flex justify-between items-center border-b border-border p-6 bg-card sticky top-0 z-10">
            <h1 className="text-4xl font-bold tracking-tight">Kurofuku Floor Map</h1>
            <div className="text-lg text-muted-foreground">Live Status</div>
          </header>

          <main className="p-4 flex-1 flex flex-col">
            <FloorMap />
          </main>
        </div>
      </div>

      {/* Role Selection Modal (fallback/prompt after drag) */}
      {pendingAssignment && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-xl border border-border max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-center">Select Role</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect('hon_shime')}
                className="w-full p-4 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-lg transition-colors"
              >
                Hon-Shime (Main)
              </button>
              <button
                onClick={() => handleRoleSelect('jonai_shime')}
                className="w-full p-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg transition-colors"
              >
                Jonai-Shime (In-house)
              </button>
              <button
                onClick={() => handleRoleSelect('help')}
                className="w-full p-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-colors"
              >
                Help
              </button>
              <button
                onClick={() => setPendingAssignment(null)}
                className="w-full p-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg mt-4 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
};
