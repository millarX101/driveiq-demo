import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ucrzzppbidhvuqefdiuw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcnp6cHBiaWRodnVxZWZkaXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4Mzg4NDcsImV4cCI6MjA2NzQxNDg0N30.ppIaZW9jvnLjZcwn9jqvOA_TpSBfKAHIoNlgRcNnbP4'  // ✅ full anon key

export const supabase = createClient(supabaseUrl, supabaseKey)
