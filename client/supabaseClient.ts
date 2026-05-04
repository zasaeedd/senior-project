import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://eeztayuvlkluxpybaoyt.supabase.co";
const supabaseAnonKey = "sb_publishable_n-BjOlU87KttokS8T5eKHw_2BMXoP8v"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
