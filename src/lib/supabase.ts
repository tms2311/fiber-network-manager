import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://cvwmagogxwxrbwygdldz.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_r48v59fVPAcVFrsDoYNzZA_hxYx5fKn';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
