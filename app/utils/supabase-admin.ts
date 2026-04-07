import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  if (typeof window === 'undefined') {
    console.warn(
      '⚠️ Supabase Admin credentials not found. User deletion will fail. ' +
      'Please set SUPABASE_SERVICE_ROLE_KEY in your environment.'
    )
  }
}

/**
 * WARNING: This client uses the Service Role key.
 * It bypasses all Row Level Security (RLS) and can perform administrative actions.
 * NEVER use this on the client side.
 */
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
