import { adminSupabase as supabase } from '@/lib/supabase-admin'
import type { Review } from '@/lib/supabase'

type ProfileSnippet = { id: string; alias: string; full_name: string; role: string }

export const revalidate = 60

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : 'var(--text-muted)', fontSize: '0.85rem' }}>★</span>
      ))}
    </div>
  )
}

export default async function ReviewsPage() {
  const [{ data: reviews }, { data: profiles }] = await Promise.all([
    supabase.from('reviews').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, alias, full_name, role'),
  ])

  const allReviews = (reviews ?? []) as Review[]
  const profileMap: Record<string, ProfileSnippet> = {}
  ;(profiles ?? []).forEach((p: ProfileSnippet) => { profileMap[p.id] = p })

  const avgRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : null

  const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  allReviews.forEach(r => { ratingDist[r.rating] = (ratingDist[r.rating] ?? 0) + 1 })

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Reviews</div>
          <div className="page-subtitle">{allReviews.length} reviews submitted</div>
        </div>
        {avgRating && (
          <div className="live-pill">
            ★ {avgRating} avg rating
          </div>
        )}
      </div>

      <div className="page-body">
        {allReviews.length > 0 && (
          <div className="two-col section-gap">
            {/* Avg Rating */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Average Rating</div>
              </div>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.04em' }}>
                  {avgRating}
                </div>
                <div>
                  <StarRating rating={Math.round(Number(avgRating))} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Based on {allReviews.length} review{allReviews.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Rating Distribution</div>
              </div>
              <div className="card-body">
                {[5,4,3,2,1].map(star => {
                  const count = ratingDist[star] ?? 0
                  const pct = allReviews.length ? (count / allReviews.length) * 100 : 0
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: 16, textAlign: 'right' }}>{star}</span>
                      <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>★</span>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#f59e0b', borderRadius: 3, transition: 'width 0.5s ease' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 20, textAlign: 'right' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="card-title">All Reviews</div>
            <div className="card-subtitle">{allReviews.length} total</div>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reviewer</th>
                  <th>Reviewee</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {allReviews.map(r => {
                  const reviewer = profileMap[r.reviewer_id]
                  const reviewee = profileMap[r.reviewee_id]
                  return (
                    <tr key={r.id}>
                      <td className="td-primary">{reviewer?.alias || reviewer?.full_name || r.reviewer_id.slice(0,8)+'…'}</td>
                      <td className="td-primary">{reviewee?.alias || reviewee?.full_name || r.reviewee_id.slice(0,8)+'…'}</td>
                      <td><StarRating rating={r.rating} /></td>
                      <td style={{ maxWidth: 300 }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.written_review ?? <span className="text-muted">—</span>}
                        </div>
                      </td>
                      <td className="text-muted">{fmtDate(r.created_at)}</td>
                    </tr>
                  )
                })}
                {allReviews.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <div className="empty-icon">💬</div>
                        <div className="empty-text">No reviews yet</div>
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
