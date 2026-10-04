import { create } from 'zustand';
import type { MenuItem, OrderItem, OrderAttribution } from '../types';

interface OrderState {
  menu: MenuItem[];
  orders: OrderItem[];
  addOrder: (sessionId: string, item: MenuItem, attributions: { cast_id: string; back_amount: number }[]) => void;
  voidOrder: (orderId: string, reason: string) => void;
  getOrdersForSession: (sessionId: string) => OrderItem[];
}

export const defaultMenu: MenuItem[] = [
  { id: 'm1', name: 'Ladies Drink (Shot)', category: 'ladies_drink', price: 1500, default_back: 500 },
  { id: 'm2', name: 'Moët & Chandon', category: 'bottle_champagne', price: 35000, default_back: 3500 },
  { id: 'm3', name: 'Dom Pérignon', category: 'bottle_champagne', price: 80000, default_back: 10000 },
  { id: 'm4', name: 'Fruit Platter', category: 'food_soft', price: 5000, default_back: 0 },
  { id: 'm5', name: 'Oolong Tea (Pitcher)', category: 'food_soft', price: 2000, default_back: 0 },
];

const dummyOrders: OrderItem[] = [
  {
    id: 'o1',
    session_id: '1', // VIP-1
    item_id: 'm1',
    item_name: 'Ladies Drink (Shot)',
    price: 1500,
    ordered_at: new Date(Date.now() - 30 * 60000).toISOString(),
    status: 'active',
    attributions: [{ id: 'a1', cast_id: 'c1', back_amount: 500 }] // Ami
  },
  {
    id: 'o2',
    session_id: '1',
    item_id: 'm2',
    item_name: 'Moët & Chandon',
    price: 35000,
    ordered_at: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'active',
    attributions: [{ id: 'a2', cast_id: 'c1', back_amount: 3500 }] // Ami
  }
];

export const useOrderStore = create<OrderState>((set, get) => ({
  menu: defaultMenu,
  orders: dummyOrders,

  addOrder: (sessionId, item, attributionsInput) => set((state) => {
    const newAttributions: OrderAttribution[] = attributionsInput.map(a => ({
      id: `attr_${Date.now()}_${Math.random()}`,
      cast_id: a.cast_id,
      back_amount: a.back_amount,
    }));

    const newOrder: OrderItem = {
      id: `ord_${Date.now()}`,
      session_id: sessionId,
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      ordered_at: new Date().toISOString(),
      status: 'active',
      attributions: newAttributions,
    };

    return { orders: [...state.orders, newOrder] };
  }),

  voidOrder: (orderId, reason) => set((state) => ({
    orders: state.orders.map(o =>
      o.id === orderId ? { ...o, status: 'voided', void_reason: reason } : o
    )
  })),

  getOrdersForSession: (sessionId) => {
    return get().orders.filter(o => o.session_id === sessionId);
  }
}));
