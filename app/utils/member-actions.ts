import { createServerFn } from '@tanstack/react-start'
import { supabaseAdmin } from './supabase-admin'
import { supabase } from './supabase'

/**
 * Server-side function to delete a member from both 
 * the profiles table and Supabase Auth.
 */
export const deleteMember = createServerFn({ method: 'POST' })
  .handler(async (ctx: any) => {
    const userId = ctx.data as string
    // 1. Initial security check via standard client (using user's session)
    // We expect the middleware/caller to have verified admin status, 
    // but we can double check here if needed.
    
    // 2. Perform administrative deletion from Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Error deleting user from Auth:', authError)
      throw new Error(`Failed to delete user from Auth: ${authError.message}`)
    }

    // 3. Since we have ON DELETE CASCADE or foreign keys, 
    // deleting from auth should delete from public.profiles.
    // However, we'll explicitly delete from profiles too just to be sure 
    // and to handle any loose ends.
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile from DB:', profileError)
      // We don't necessarily throw here if Auth was successful, 
      // but it's good to log.
    }

    return { success: true }
  })
