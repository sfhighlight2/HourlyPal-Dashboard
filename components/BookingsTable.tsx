'use client'
import { useState, useMemo } from 'react'
import type { Booking } from '@/lib/supabase'

type ProfileSnippet = { id: string; alias: string; full_name: string; email: string; role: string }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtRate(cents: number) {
  return `$${(cents / 100).toFixed(0)}/hr`
}

export function BookingsTable({
  bookings,
  profileMap,
}: {
  bookings: Booking[]
  profileMap: Record<string, ProfileSnippet>
}) {
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const client = profileMap[b.client_id]
      const pal    = profileMap[b.pal_id]
      const q = search.toLowerCase()
      const matchSearch = !q ||
        b.service_category?.toLowerCase().includes(q) ||
        b.location_address?.toLowerCase().includes(q) ||
        client?.alias?.toLowerCase().includes(q) ||
        pal?.alias?.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || b.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [bookings, profileMap, search, statusFilter])

  const statuses = ['pending', 'accepted', 'declined', 'cancelled', 'in_progress', 'completed']

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">All Bookings</div>
          <div className="card-subtitle">Showing {filtered.length} of {bookings.length}</div>
        </div>
      </div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div className="toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search by service, address, client, or pal…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Pal</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Rate</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Booked At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const client = profileMap[b.client_id]
              const pal    = profileMap[b.pal_id]
              return (
                <tr key={b.id}>
                  <td className="td-primary">{client?.alias || client?.full_name || b.client_id.slice(0, 8) + '…'}</td>
                  <td className="td-primary">{pal?.alias || pal?.full_name || b.pal_id.slice(0, 8) + '…'}</td>
                  <td>
                    <span className="tag">{b.service_category?.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="text-secondary">{fmtDate(b.booking_date)}</td>
                  <td className="text-secondary" style={{ textTransform: 'capitalize' }}>{b.time_slot}</td>
                  <td className="currency">{fmtRate(b.hourly_rate_cents)}</td>
                  <td className="text-muted">{b.duration_hours != null ? `${b.duration_hours}h` : '—'}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                  <td className="text-muted">{fmtDate(b.created_at)}</td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <div className="empty-text">No bookings found</div>
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
