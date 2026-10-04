export interface TableSession {
  id: string;
  table_number: string;
  opened_at: string;
  set_duration_minutes: number;
  remainingTime: number; // calculated locally in seconds for the timer
  status: string;
}
