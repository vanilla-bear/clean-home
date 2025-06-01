import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Room = 
  | 'salon'
  | 'cuisine'
  | 'entree'
  | 'toilettes'
  | 'salle_de_bain'
  | 'chambre_principale'
  | 'chambre_secondaire';

export interface Task {
  id: string;
  title: string;
  description: string;
  room: Room;
  frequency: {
    type: 'daily' | 'weekly' | 'monthly';
    value: number; // nombre de jours/semaines/mois
  };
  created_at: string;
  last_executed_at: string | null;
  next_execution: string;
  completed: boolean;
  user_id: string;
  execution_history: {
    executed_at: string;
    duration_minutes?: number;
  }[];
} 