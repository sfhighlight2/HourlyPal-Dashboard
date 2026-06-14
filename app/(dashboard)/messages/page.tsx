import { adminSupabase as supabase } from '@/lib/supabase-admin'
import type { Message } from '@/lib/supabase'

type ProfileSnippet = { id: string; alias: string; full_name: string; role: string }

export const dynamic = 'force-dynamic'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

export default async function MessagesPage() {
  const [{ data: messages }, { data: profiles }] = await Promise.all([
    supabase.from('messages').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, alias, full_name, role'),
  ])

  const allMessages = (messages ?? []) as Message[]
  const profileMap: Record<string, ProfileSnippet> = {}
  ;(profiles ?? []).forEach((p: ProfileSnippet) => { profileMap[p.id] = p })

  const unread = allMessages.filter(m => !m.read_at).length

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Messages</div>
          <div className="page-subtitle">{allMessages.length} total messages across all bookings</div>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          {unread} Unread
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Message Log</div>
              <div className="card-subtitle">In-booking communications (read-only)</div>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Message</th>
                  <th>Booking ID</th>
                  <th>Read</th>
                  <th>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {allMessages.map(m => {
                  const sender    = profileMap[m.sender_id]
                  const recipient = profileMap[m.recipient_id]
                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="user-cell">
                          <div className={`avatar avatar-${sender?.role ?? 'client'}`} style={{ width: 26, height: 26, fontSize: '0.65rem' }}>
                            {(sender?.alias || sender?.full_name || '?')[0].toUpperCase()}
                          </div>
                          <span className="td-primary">{sender?.alias || sender?.full_name || m.sender_id.slice(0, 8) + '…'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="user-cell">
                          <div className={`avatar avatar-${recipient?.role ?? 'pal'}`} style={{ width: 26, height: 26, fontSize: '0.65rem' }}>
                            {(recipient?.alias || recipient?.full_name || '?')[0].toUpperCase()}
                          </div>
                          <span className="text-secondary">{recipient?.alias || recipient?.full_name || m.recipient_id.slice(0, 8) + '…'}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: 320 }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.content}
                        </div>
                      </td>
                      <td className="td-mono">{m.booking_id.slice(0, 8)}…</td>
                      <td>
                        {m.read_at
                          ? <span className="badge badge-accepted">✓ Read</span>
                          : <span className="badge badge-pending">Unread</span>
                        }
                      </td>
                      <td className="text-muted">{fmtDate(m.created_at)}</td>
                    </tr>
                  )
                })}
                {allMessages.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-icon">✉️</div>
                        <div className="empty-text">No messages yet</div>
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
