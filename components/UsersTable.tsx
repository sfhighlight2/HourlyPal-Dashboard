'use client'
import { useState, useMemo } from 'react'
import type { Profile } from '@/lib/supabase'

function getInitials(name: string, alias: string) {
  const n = name || alias || '?'
  return n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtRate(cents: number) {
  return cents > 0 ? `$${(cents / 100).toFixed(0)}/hr` : '—'
}

export function UsersTable({ profiles }: { profiles: Profile[] }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')
  const [verFilter, setVerFilter] = useState('all')

  const filtered = useMemo(() => {
    return profiles.filter(p => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        p.alias?.toLowerCase().includes(q) ||
        p.full_name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || p.role === roleFilter
      const matchSub  = subFilter === 'all'  || p.subscription_status === subFilter
      const matchVer  = verFilter === 'all'  ||
        (verFilter === 'verified' && p.is_verified) ||
        (verFilter === 'unverified' && !p.is_verified)
      return matchSearch && matchRole && matchSub && matchVer
    })
  }, [profiles, search, roleFilter, subFilter, verFilter])

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">All Users</div>
          <div className="card-subtitle">Showing {filtered.length} of {profiles.length} users</div>
        </div>
      </div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div className="toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search by name, email, or city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="pal">Pals</option>
            <option value="client">Clients</option>
          </select>
          <select className="filter-select" value={subFilter} onChange={e => setSubFilter(e.target.value)}>
            <option value="all">All Subscriptions</option>
            <option value="trialing">Trialing</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
            <option value="none">None</option>
          </select>
          <select className="filter-select" value={verFilter} onChange={e => setVerFilter(e.target.value)}>
            <option value="all">All Verified Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Location</th>
              <th>Phone</th>
              <th>Rate</th>
              <th>Subscription</th>
              <th>Trial Ends</th>
              <th>Verified</th>
              <th>Onboarded</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="user-cell">
                    <div className={`avatar avatar-${p.role ?? 'client'}`}>
                      {getInitials(p.full_name, p.alias)}
                    </div>
                    <div className="user-cell-info">
                      <span className="user-cell-name">{p.alias || '—'}</span>
                      <span className="user-cell-sub">{p.email}</span>
                    </div>
                  </div>
                </td>
                <td><span className={`badge badge-${p.role ?? 'client'}`}>{p.role ?? '—'}</span></td>
                <td className="text-secondary">{[p.city, p.state].filter(Boolean).join(', ') || '—'}</td>
                <td className="td-mono">{p.phone || '—'}</td>
                <td className="currency">{fmtRate(p.hourly_rate_cents)}</td>
                <td><span className={`badge badge-${p.subscription_status}`}>{p.subscription_status}</span></td>
                <td className="text-muted">{p.trial_ends_at ? fmtDate(p.trial_ends_at) : '—'}</td>
                <td>
                  <span className={`badge badge-${p.is_verified ? 'verified' : 'unverified'}`}>
                    {p.is_verified ? '✓ Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${p.onboarding_complete ? 'accepted' : 'pending'}`}>
                    {p.onboarding_complete ? '✓ Done' : 'Pending'}
                  </span>
                </td>
                <td className="text-muted">{fmtDate(p.created_at)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10}>
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <div className="empty-text">No users match your filters</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
