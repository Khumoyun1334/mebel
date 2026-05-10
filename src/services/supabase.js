import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxrwrhbbijfntbrntpxk.supabase.co';
const supabaseAnonKey = 'sb_publishable_qnJTSPaIOR5tn0dZw2RdgA_w6WOjvsJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);