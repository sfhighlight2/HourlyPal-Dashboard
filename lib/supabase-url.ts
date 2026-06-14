/**
 * Resolves the Supabase project URL.
 *
 * The URL normally comes from NEXT_PUBLIC_SUPABASE_URL. If that variable is
 * missing or is not a valid http(s) URL (for example it was left as the
 * literal placeholder "NEXT_PUBLIC_SUPABASE_URL"), we fall back to deriving
 * the URL from the project ref embedded in the API key's JWT. Every Supabase
 * key encodes its project ref, and the default REST endpoint is always
 * https://<ref>.supabase.co — so a valid key is enough to recover the URL.
 *
 * This keeps the dashboard working even when the URL env var is misconfigured,
 * while still emitting a warning so the misconfiguration can be fixed properly.
 */
export function resolveSupabaseUrl(
  envUrl: string | undefined,
  ...keys: Array<string | undefined>
): string {
  if (envUrl && isHttpUrl(envUrl)) return envUrl

  for (const key of keys) {
    const derived = deriveUrlFromKey(key)
    if (derived) {
      console.warn(
        `[supabase] NEXT_PUBLIC_SUPABASE_URL ${
          envUrl ? `("${envUrl}") is not a valid URL` : 'is not set'
        }; derived "${derived}" from the API key project ref instead. ` +
          'Set NEXT_PUBLIC_SUPABASE_URL to your project URL ' +
          '(https://<ref>.supabase.co) in your Netlify environment variables.'
      )
      return derived
    }
  }

  throw new Error(
    '[supabase] Could not resolve a Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL ' +
      'to your project URL (https://<ref>.supabase.co) in your Netlify ' +
      'environment variables.'
  )
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function deriveUrlFromKey(key: string | undefined): string | null {
  if (!key) return null
  const segment = key.split('.')[1]
  if (!segment) return null
  try {
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const json =
      typeof atob === 'function'
        ? atob(base64)
        : Buffer.from(base64, 'base64').toString('utf8')
    const ref = (JSON.parse(json) as { ref?: unknown }).ref
    return typeof ref === 'string' && ref ? `https://${ref}.supabase.co` : null
  } catch {
    return null
  }
}
