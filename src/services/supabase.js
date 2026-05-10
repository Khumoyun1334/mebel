import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Tekshiruv uchun
console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Anon Key mavjud:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase sozlamalari topilmadi! Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);