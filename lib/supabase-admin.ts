/**
 * Server-side Supabase admin client.
 *
 * Uses the SERVICE ROLE KEY — bypasses all RLS policies.
 * NEVER import this in a 'use client' component or any file
 * that gets bundled for the browser. Server Components only.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local — ' +
    'add it to see all data in the admin dashboard.'
  )
}

/**
 * Admin client — full read access across all tables.
 * Read-only by convention in this dashboard.
 */
export const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    // Disable auth helpers — we don't need session management server-side
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
