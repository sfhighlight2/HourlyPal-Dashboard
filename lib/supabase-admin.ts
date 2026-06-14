/**
 * Server-side Supabase admin client — lazy initialization.
 *
 * Uses the SERVICE ROLE KEY to bypass all RLS policies.
 * NEVER import this in a 'use client' component or any client bundle.
 *
 * The client is created lazily on first use (not at module import time)
 * so Next.js build-time page-data collection doesn't require env vars.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getAdminClient(): SupabaseClient {
  if (_client) return _client

  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      '[supabase-admin] Missing env vars.\n' +
      'Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your Netlify environment variables.'
    )
  }

  _client = createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession:    false,
      autoRefreshToken:  false,
      detectSessionInUrl: false,
    },
  })

  return _client
}

/**
 * Use this exactly like the regular supabase client:
 *   const { data } = await adminSupabase.from('profiles').select('*')
 *
 * The real client is created on first property access, not at import time.
 */
export const adminSupabase = new Proxy({} as SupabaseClient, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(_: unknown, prop: string | symbol): any {
    return (getAdminClient() as any)[prop]
  },
})
