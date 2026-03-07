import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://cvwmagogxwxrbwygdldz.supabase.co';
const supabaseAnonKey = 'sb_publishable_r48v59fVPAcVFrsDoYNzZA_hxYx5fKn';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
