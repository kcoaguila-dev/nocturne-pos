export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cast_members: {
        Row: {
          id: string
          stage_name: string
          base_hourly_rate: number
          point_tier: string
          created_at: string
        }
        Insert: {
          id?: string
          stage_name: string
          base_hourly_rate?: number
          point_tier?: string
          created_at?: string
        }
        Update: {
          id?: string
          stage_name?: string
          base_hourly_rate?: number
          point_tier?: string
          created_at?: string
        }
      }
      table_sessions: {
        Row: {
          id: string
          table_number: string
          opened_at: string
          set_duration_minutes: number
          set_rate: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          table_number: string
          opened_at?: string
          set_duration_minutes?: number
          set_rate: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          table_number?: string
          opened_at?: string
          set_duration_minutes?: number
          set_rate?: number
          status?: string
          created_at?: string
        }
      }
      cast_assignments: {
        Row: {
          id: string
          session_id: string
          cast_id: string
          role: string
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          cast_id: string
          role: string
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          cast_id?: string
          role?: string
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          session_id: string
          item_name: string
          price: number
          ordered_at: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          item_name: string
          price: number
          ordered_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          item_name?: string
          price?: number
          ordered_at?: string
          created_at?: string
        }
      }
      order_attributions: {
        Row: {
          id: string
          order_item_id: string
          cast_id: string
          back_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          order_item_id: string
          cast_id: string
          back_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          order_item_id?: string
          cast_id?: string
          back_amount?: number
          created_at?: string
        }
      }
      attendance_adjustments: {
        Row: {
          id: string
          cast_id: string
          date: string
          type: string
          adjustment_points: number
          adjustment_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          cast_id: string
          date?: string
          type: string
          adjustment_points?: number
          adjustment_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          cast_id?: string
          date?: string
          type?: string
          adjustment_points?: number
          adjustment_amount?: number
          created_at?: string
        }
      }
    }
  }
}
