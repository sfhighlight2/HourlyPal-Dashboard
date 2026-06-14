import { adminSupabase as supabase } from '@/lib/supabase-admin'
import type { Booking } from '@/lib/supabase'
import { BookingsTable } from '@/components/BookingsTable'

type ProfileSnippet = { id: string; alias: string; full_name: string; email: string; role: string }

export const revalidate = 60

export default async function BookingsPage() {
  const [{ data: bookings }, { data: profiles }] = await Promise.all([
    supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, alias, full_name, email, role'),
  ])

  const allBookings = (bookings ?? []) as Booking[]
  const profileMap: Record<string, ProfileSnippet> = {}
  ;(profiles ?? []).forEach((p: ProfileSnippet) => { profileMap[p.id] = p })

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Bookings</div>
          <div className="page-subtitle">{allBookings.length} total booking{allBookings.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          {allBookings.filter(b => b.status === 'in_progress').length} In Progress
        </div>
      </div>
      <div className="page-body">
        <BookingsTable bookings={allBookings} profileMap={profileMap} />
      </div>
    </>
  )
}
