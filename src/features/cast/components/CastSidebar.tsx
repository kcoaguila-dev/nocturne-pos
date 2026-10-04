import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useCastStore } from '../store/useCastStore';
import type { CastMember } from '../types';

const DraggableCastMember: React.FC<{ cast: CastMember }> = ({ cast }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: cast.id,
    data: cast,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing border-2 ${
        cast.status === 'available' ? 'bg-indigo-900/50 border-indigo-500' :
        cast.status === 'seated' ? 'bg-green-900/50 border-green-500 opacity-50' :
        'bg-slate-800 border-slate-600 opacity-50'
      }`}
    >
      <div className="font-bold text-lg">{cast.stage_name}</div>
      <div className="text-sm text-muted-foreground">{cast.point_tier}</div>
    </div>
  );
};

export const CastSidebar: React.FC = () => {
  const { castMembers } = useCastStore();

  const available = castMembers.filter(c => c.status === 'available');
  const seated = castMembers.filter(c => c.status === 'seated');
  const onBreak = castMembers.filter(c => c.status === 'on_break');

  return (
    <div className="w-80 border-r border-border h-full overflow-y-auto bg-card p-4 space-y-8 flex-shrink-0">
      <h2 className="text-2xl font-bold mb-4 tracking-tight">Cast Roster</h2>

      <div>
        <h3 className="text-lg font-semibold text-indigo-300 mb-3 border-b border-indigo-900/50 pb-2">
          Available ({available.length})
        </h3>
        <div className="space-y-3">
          {available.map(cast => (
            <DraggableCastMember key={cast.id} cast={cast} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-green-300 mb-3 border-b border-green-900/50 pb-2">
          Seated ({seated.length})
        </h3>
        <div className="space-y-3">
          {seated.map(cast => (
            <div key={cast.id} className="p-4 rounded-lg shadow-md border-2 bg-green-900/20 border-green-500/50 opacity-60">
              <div className="font-bold text-lg">{cast.stage_name}</div>
              <div className="text-sm text-green-200/70">Currently Seated</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-400 mb-3 border-b border-slate-800 pb-2">
          On Break ({onBreak.length})
        </h3>
        <div className="space-y-3">
          {onBreak.map(cast => (
            <div key={cast.id} className="p-4 rounded-lg shadow-md border-2 bg-slate-800 border-slate-600 opacity-50">
              <div className="font-bold text-lg">{cast.stage_name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
