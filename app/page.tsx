import { getOverviewStats } from '@/lib/analytics'
import { OverviewCharts } from '@/components/OverviewCharts'

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name: string, alias: string) {
  const n = name || alias || '?'
  return n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  const stats = await getOverviewStats()

  const kpis = [
    { icon: '👥', color: 'teal',   label: 'Total Users',       value: stats.totalUsers,       sub: `${stats.totalPals} pals · ${stats.totalClients} clients` },
    { icon: '⭐', color: 'teal',   label: 'Total Pals',        value: stats.totalPals,        sub: `${stats.verifiedPals} verified` },
    { icon: '📅', color: 'blue',   label: 'Bookings',          value: stats.totalBookings,    sub: `${stats.completedBookings} completed` },
    { icon: '💳', color: 'green',  label: 'Active Subs',       value: stats.activeSubscriptions, sub: `${stats.trialingUsers} trialing` },
    { icon: '💬', color: 'orange', label: 'Messages Sent',     value: stats.totalMessages,    sub: 'in-booking messages' },
    { icon: '💵', color: 'yellow', label: 'Avg. Hourly Rate',  value: fmt(stats.avgHourlyRate), sub: 'across all pals' },
  ]

  const subData = stats.subBreakdown
  const bookingData = stats.bookingBreakdown

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Overview</div>
          <div className="page-subtitle">HourlyPal platform at a glance</div>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          Live Data
        </div>
      </div>

      <div className="page-body">
        {/* KPI Grid */}
        <div className="kpi-grid">
          {kpis.map(k => (
            <div key={k.label} className="kpi-card">
              <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="two-col section-gap">
          <OverviewCharts subBreakdown={subData} bookingBreakdown={bookingData} />
        </div>

        {/* Recent Signups */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Signups</div>
              <div className="card-subtitle">Latest users to join HourlyPal</div>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Subscription</th>
                  <th>Joined</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSignups.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="user-cell">
                        <div className={`avatar avatar-${p.role ?? 'client'}`}>
                          {getInitials(p.full_name, p.alias)}
                        </div>
                        <div className="user-cell-info">
                          <span className="user-cell-name">{p.alias || p.full_name || '—'}</span>
                          <span className="user-cell-sub">{p.full_name || ''}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${p.role ?? 'client'}`}>
                        {p.role ?? 'unknown'}
                      </span>
                    </td>
                    <td className="td-mono">{p.email}</td>
                    <td>
                      <span className={`badge badge-${p.subscription_status}`}>
                        {p.subscription_status}
                      </span>
                    </td>
                    <td className="text-muted">{fmtDate(p.created_at)}</td>
                    <td>
                      <span className={`badge badge-${p.is_verified ? 'verified' : 'unverified'}`}>
                        {p.is_verified ? '✓ Verified' : 'Unverified'}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recentSignups.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-icon">🙈</div>
                        <div className="empty-text">No users yet</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
