import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

console.log('🔧 Environment check:', {
  url: supabaseUrl,
  keyExists: !!supabaseKey,
  keyLength: supabaseKey?.length
});

// Handle OAuth redirects
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    console.log('User signed in:', session.user.email);
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});
