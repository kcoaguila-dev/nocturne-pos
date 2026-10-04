export type MenuCategory = 'ladies_drink' | 'bottle_champagne' | 'food_soft';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  default_back: number; // Flat amount or percentage can be resolved before saving
}

export interface OrderAttribution {
  id: string;
  cast_id: string;
  back_amount: number;
}

export interface OrderItem {
  id: string;
  session_id: string;
  item_id: string;
  item_name: string;
  price: number;
  ordered_at: string;
  status: 'active' | 'voided';
  void_reason?: string;
  attributions: OrderAttribution[]; // Embedded for MVP simplicity
}
