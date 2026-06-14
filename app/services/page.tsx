import { adminSupabase as supabase } from '@/lib/supabase-admin'
import type { Service, ProfileService } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const SERVICE_ICONS: Record<string, string> = {
  airport_chauffer:   '✈️',
  personal_assistant: '📋',
  personal_trainer:   '💪',
  personal_stylist:   '👗',
  chef_to_go:         '👨‍🍳',
  default:            '🛠',
}

export default async function ServicesPage() {
  const [{ data: services }, { data: pServices }] = await Promise.all([
    supabase.from('services').select('*').order('label'),
    supabase.from('profile_services').select('*'),
  ])

  const allServices = (services ?? []) as Service[]
  const allPSvc     = (pServices ?? []) as ProfileService[]

  // Count pals per service
  const palCount: Record<string, number> = {}
  allPSvc.forEach(ps => {
    palCount[ps.service_id] = (palCount[ps.service_id] ?? 0) + 1
  })

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Service Catalog</div>
          <div className="page-subtitle">{allServices.length} services available on the platform</div>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          {allPSvc.length} Pal–Service Links
        </div>
      </div>

      <div className="page-body">
        {/* Quick Stats */}
        <div className="kpi-grid section-gap" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          <div className="kpi-card">
            <div className="kpi-icon teal">🛠</div>
            <div className="kpi-label">Total Services</div>
            <div className="kpi-value">{allServices.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon blue">🔗</div>
            <div className="kpi-label">Pal–Service Pairs</div>
            <div className="kpi-value">{allPSvc.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon green">⭐</div>
            <div className="kpi-label">Most Offered</div>
            <div className="kpi-value" style={{ fontSize: '1.1rem' }}>
              {Object.keys(palCount).length > 0
                ? (Object.entries(palCount).sort((a, b) => b[1] - a[1])[0][0].replace(/_/g, ' '))
                : '—'
              }
            </div>
          </div>
        </div>

        {/* Service Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {allServices.map(svc => {
            const icon = SERVICE_ICONS[svc.id] ?? SERVICE_ICONS.default
            const pals = palCount[svc.id] ?? 0
            return (
              <div key={svc.id} className="card kpi-card" style={{ padding: 0 }}>
                <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="kpi-icon teal" style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{svc.label}</div>
                    <div className="td-mono" style={{ fontSize: '0.68rem', marginTop: 2 }}>{svc.id}</div>
                  </div>
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    {svc.description}
                  </p>
                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 52 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: pals > 0 ? 'var(--brand)' : 'var(--text-muted)' }}>{pals}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pals</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
