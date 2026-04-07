import { createClient } from '@supabase/supabase-js'

// Use import.meta.env for the URL since it's already prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  if (typeof window === 'undefined') {
    const missing = []
    if (!supabaseUrl) missing.push('SUPABASE_URL')
    if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    
    console.warn(
      `⚠️ Supabase Admin credentials missing: ${missing.join(', ')}. ` +
      'Admin actions (like user deletion) will fail.'
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
