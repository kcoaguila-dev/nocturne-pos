export type CastRole = 'hon_shime' | 'jonai_shime' | 'help';

export type CastStatus = 'available' | 'seated' | 'on_break';

export interface CastMember {
  id: string;
  stage_name: string;
  base_hourly_rate: number;
  point_tier: string;
  status: CastStatus;
}

export interface CastAssignment {
  id: string;
  session_id: string; // The table session ID
  cast_id: string;
  role: CastRole;
  started_at: string;
}
