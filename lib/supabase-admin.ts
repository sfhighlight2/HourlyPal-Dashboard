/**
 * Server-side Supabase admin client — lazy initialization.
 *
 * Uses the SERVICE ROLE KEY to bypass all RLS policies.
 * NEVER import this in a 'use client' component or any client bundle.
 *
 * createClient() is deferred to the first request so Next.js
 * build-time page-data collection never needs the env vars.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { resolveSupabaseUrl } from '@/lib/supabase-url'

let _client: SupabaseClient | null = null

/** Returns the singleton admin client, creating it on first call. */
export function getAdminClient(): SupabaseClient {
  if (_client) return _client

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!key) {
    throw new Error(
      '[supabase-admin] Missing SUPABASE_SERVICE_ROLE_KEY.\n' +
      'Add SUPABASE_SERVICE_ROLE_KEY to your Netlify environment variables.'
    )
  }

  // Falls back to deriving the URL from the key when the env URL is invalid.
  const url = resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, key)

  _client = createClient(url, key, {
    auth: {
      persistSession:     false,
      autoRefreshToken:   false,
      detectSessionInUrl: false,
    },
  })

  return _client
}

/**
 * Convenience alias — use exactly like the regular supabase client:
 *   const { data } = await adminSupabase.from('profiles').select('*')
 *
 * Explicitly typed as SupabaseClient so TypeScript is happy in all pages.
 * The real client is created on first property access, not at import time.
 */
export const adminSupabase: SupabaseClient = new Proxy(
  {} as unknown as SupabaseClient,
  { get: (_target, prop) => getAdminClient()[prop as keyof SupabaseClient] }
)
