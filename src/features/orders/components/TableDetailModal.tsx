import React, { useState } from 'react';
import { X, Plus, Trash2, Receipt } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useCastStore } from '@/features/cast';
import type { MenuItem } from '../types';

interface TableDetailModalProps {
  sessionId: string;
  tableNumber: string;
  onClose: () => void;
}

export const TableDetailModal: React.FC<TableDetailModalProps> = ({ sessionId, tableNumber, onClose }) => {
  const { menu, getOrdersForSession, addOrder, voidOrder } = useOrderStore();
  const { assignments, castMembers } = useCastStore();

  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedCastIds, setSelectedCastIds] = useState<string[]>([]);

  const orders = getOrdersForSession(sessionId);
  const activeOrders = orders.filter(o => o.status === 'active');
  const subtotal = activeOrders.reduce((sum, order) => sum + order.price, 0);

  // Cast currently at this table
  const seatedCast = assignments
    .filter(a => a.session_id === sessionId)
    .map(a => castMembers.find(c => c.id === a.cast_id)!)
    .filter(Boolean);

  const handleItemSelect = (item: MenuItem) => {
    if (item.default_back > 0 && seatedCast.length > 0) {
      // Need attribution
      setSelectedMenuItem(item);
      setSelectedCastIds([]); // Reset selection
    } else {
      // No attribution needed (e.g. food/soft) or no cast available
      addOrder(sessionId, item, []);
    }
  };

  const handleConfirmOrder = () => {
    if (!selectedMenuItem) return;

    if (selectedCastIds.length > 0) {
      // Split the back equally
      const splitAmount = Math.floor(selectedMenuItem.default_back / selectedCastIds.length);
      const attributions = selectedCastIds.map(castId => ({
        cast_id: castId,
        back_amount: splitAmount,
      }));
      addOrder(sessionId, selectedMenuItem, attributions);
    } else {
      // Order without attribution
      addOrder(sessionId, selectedMenuItem, []);
    }

    setSelectedMenuItem(null);
    setSelectedCastIds([]);
  };

  const toggleCastSelection = (castId: string) => {
    setSelectedCastIds(prev =>
      prev.includes(castId)
        ? prev.filter(id => id !== castId)
        : [...prev, castId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-5xl h-[85vh] rounded-xl border border-border shadow-2xl flex flex-col md:flex-row overflow-hidden">

        {/* Left Side: Order Summary / Bill */}
        <div className="w-full md:w-1/3 border-r border-border bg-slate-900/50 flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-slate-900">
            <div>
              <h2 className="text-2xl font-bold">{tableNumber} Bill</h2>
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                <Receipt className="w-4 h-4" /> Subtotal: ¥{subtotal.toLocaleString()}
              </p>
            </div>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-white/10 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No items ordered yet.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className={`p-4 rounded-lg border ${order.status === 'voided' ? 'border-red-900/50 bg-red-950/20 opacity-50' : 'border-slate-700 bg-slate-800'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-bold ${order.status === 'voided' ? 'line-through text-red-400' : ''}`}>
                      {order.item_name}
                    </span>
                    <span className="font-mono">¥{order.price.toLocaleString()}</span>
                  </div>

                  {order.attributions.length > 0 && order.status === 'active' && (
                    <div className="text-sm text-indigo-300 mt-2 space-y-1 bg-indigo-950/30 p-2 rounded-md">
                      {order.attributions.map(attr => {
                        const c = castMembers.find(c => c.id === attr.cast_id);
                        return (
                          <div key={attr.id} className="flex justify-between">
                            <span>↳ {c?.stage_name}</span>
                            <span className="font-mono">+¥{attr.back_amount.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {order.status === 'active' && (
                    <button
                      onClick={() => voidOrder(order.id, 'Staff Void')}
                      className="mt-3 text-red-400 hover:text-red-300 flex items-center gap-1 text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Void
                    </button>
                  )}
                  {order.status === 'voided' && (
                    <div className="text-xs text-red-500 mt-2">Voided: {order.void_reason}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Touch Menu Grid */}
        <div className="w-full md:w-2/3 flex flex-col relative">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add Order</h2>
            <button onClick={onClose} className="hidden md:block p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {!selectedMenuItem ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className="h-32 p-4 rounded-xl border-2 border-slate-700 hover:border-indigo-500 bg-slate-800 hover:bg-indigo-950/50 flex flex-col items-center justify-center text-center transition-all active:scale-95"
                  >
                    <span className="font-bold text-lg mb-2">{item.name}</span>
                    <span className="text-slate-400 font-mono">¥{item.price.toLocaleString()}</span>
                    {item.default_back > 0 && (
                      <span className="text-xs text-indigo-400 mt-2">Back: ¥{item.default_back.toLocaleString()}</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Attribution / Seppan View */
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <button onClick={() => setSelectedMenuItem(null)} className="text-indigo-400 mb-4 hover:underline">
                    ← Back to Menu
                  </button>
                  <h3 className="text-3xl font-bold mb-2">{selectedMenuItem.name}</h3>
                  <p className="text-xl text-muted-foreground font-mono">¥{selectedMenuItem.price.toLocaleString()}</p>
                </div>

                <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700 p-6 flex flex-col">
                  <h4 className="text-xl font-semibold mb-4">Select Cast for Attribution (Back: ¥{selectedMenuItem.default_back.toLocaleString()})</h4>

                  {seatedCast.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No cast members currently seated at this table.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 flex-1 content-start">
                      {seatedCast.map(cast => {
                        const isSelected = selectedCastIds.includes(cast.id);
                        return (
                          <button
                            key={cast.id}
                            onClick={() => toggleCastSelection(cast.id)}
                            className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                              isSelected ? 'border-pink-500 bg-pink-900/30' : 'border-slate-600 bg-slate-800'
                            }`}
                          >
                            <span className="font-bold text-lg">{cast.stage_name}</span>
                            {isSelected && <span className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-slate-700">
                    {selectedCastIds.length > 0 && (
                      <div className="mb-4 text-center text-pink-300 font-bold bg-pink-950/40 py-2 rounded-lg border border-pink-900/50">
                        Split (Seppan): ¥{Math.floor(selectedMenuItem.default_back / selectedCastIds.length).toLocaleString()} each
                      </div>
                    )}
                    <button
                      onClick={handleConfirmOrder}
                      className="w-full py-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl transition-colors active:scale-95 shadow-lg shadow-indigo-900/50 flex justify-center items-center gap-2"
                    >
                      <Plus className="w-6 h-6" /> Confirm Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
