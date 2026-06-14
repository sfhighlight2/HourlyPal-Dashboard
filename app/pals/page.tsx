import { adminSupabase as supabase } from '@/lib/supabase-admin'
import type { Profile, ProfileService, ProfileAvailability, ProfileLanguage } from '@/lib/supabase'

export const revalidate = 60

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getInitials(name: string, alias: string) {
  const n = name || alias || '?'
  return n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function fmtRate(cents: number) {
  return cents > 0 ? `$${(cents / 100).toFixed(0)}/hr` : '—'
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function PalsPage() {
  const [
    { data: profiles },
    { data: pServices },
    { data: availability },
    { data: languages },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('role', 'pal').order('created_at', { ascending: false }),
    supabase.from('profile_services').select('*'),
    supabase.from('profile_availability').select('*'),
    supabase.from('profile_languages').select('*'),
  ])

  const pals = (profiles ?? []) as Profile[]
  const allServices = (pServices ?? []) as ProfileService[]
  const allAvail = (availability ?? []) as ProfileAvailability[]
  const allLangs = (languages ?? []) as ProfileLanguage[]

  // Group by profile
  const servicesByPal: Record<string, ProfileService[]> = {}
  allServices.forEach(s => {
    if (!servicesByPal[s.profile_id]) servicesByPal[s.profile_id] = []
    servicesByPal[s.profile_id].push(s)
  })

  const availByPal: Record<string, ProfileAvailability[]> = {}
  allAvail.forEach(a => {
    if (!availByPal[a.profile_id]) availByPal[a.profile_id] = []
    availByPal[a.profile_id].push(a)
  })

  const langsByPal: Record<string, ProfileLanguage[]> = {}
  allLangs.forEach(l => {
    if (!langsByPal[l.profile_id]) langsByPal[l.profile_id] = []
    langsByPal[l.profile_id].push(l)
  })

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Pals</div>
          <div className="page-subtitle">{pals.length} service providers registered</div>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          {pals.filter(p => p.is_verified).length} Verified
        </div>
      </div>

      <div className="page-body">
        {pals.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <div className="empty-text">No pals yet</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {pals.map(pal => {
              const palServices = servicesByPal[pal.id] ?? []
              const palAvail    = availByPal[pal.id] ?? []
              const palLangs    = langsByPal[pal.id] ?? []

              const availDays = palAvail
                .filter(a => a.morning || a.afternoon || a.evening)
                .map(a => DAY_NAMES[a.day_of_week])

              return (
                <div key={pal.id} className="card pal-card">
                  {/* Pal Header */}
                  <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar avatar-pal" style={{ width: 46, height: 46, fontSize: '0.9rem', borderRadius: 12 }}>
                      {getInitials(pal.full_name, pal.alias)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                        {pal.alias || pal.full_name || '—'}
                        {pal.is_verified && <span className="badge badge-verified" style={{ fontSize: '0.6rem' }}>✓</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{pal.email}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div className="currency" style={{ fontSize: '1.1rem' }}>{fmtRate(pal.hourly_rate_cents)}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{fmtDate(pal.created_at)}</div>
                    </div>
                  </div>

                  <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Location */}
                    {(pal.city || pal.state) && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        📍 {[pal.city, pal.state].filter(Boolean).join(', ')}
                      </div>
                    )}

                    {/* Bio */}
                    {pal.bio && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, borderLeft: '2px solid var(--border)', paddingLeft: 10 }}>
                        {pal.bio}
                      </div>
                    )}

                    {/* Subscription */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Subscription</span>
                      <span className={`badge badge-${pal.subscription_status}`}>{pal.subscription_status}</span>
                    </div>

                    {/* Services */}
                    {palServices.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Services</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {palServices.map(s => (
                            <span key={s.id} className="tag">{s.service_id.replace(/_/g, ' ')}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    {availDays.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Available Days</div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                            <div key={day} style={{
                              width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.6rem', fontWeight: 700,
                              background: availDays.includes(day) ? 'var(--brand-subtle)' : 'rgba(0,0,0,0.04)',
                              color: availDays.includes(day) ? '#00907A' : 'var(--text-muted)',
                              border: availDays.includes(day) ? '1px solid var(--brand-border)' : '1px solid var(--border)',
                            }}>
                              {day[0]}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {palLangs.length > 0 && (
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {palLangs.map(l => (
                          <span key={l.id} className="tag">🗣 {l.language}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
