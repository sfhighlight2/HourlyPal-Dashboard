import { adminSupabase as supabase } from '@/lib/supabase-admin'
import type { Profile, Booking, Review, Message } from '@/lib/supabase'

// ── Analytics helpers ──────────────────────────────────────────────
export async function getOverviewStats() {
  const [
    { data: profiles },
    { data: bookings },
    { data: reviews },
    { data: messages },
  ] = await Promise.all([
    supabase.from('profiles').select('*'),
    supabase.from('bookings').select('*'),
    supabase.from('reviews').select('*'),
    supabase.from('messages').select('*'),
  ])

  const allProfiles = (profiles ?? []) as Profile[]
  const allBookings = (bookings ?? []) as Booking[]
  const allReviews  = (reviews  ?? []) as Review[]
  const allMessages = (messages ?? []) as Message[]

  const totalUsers    = allProfiles.length
  const totalPals     = allProfiles.filter(p => p.role === 'pal').length
  const totalClients  = allProfiles.filter(p => p.role === 'client').length
  const totalBookings = allBookings.length
  const completedBookings = allBookings.filter(b => b.status === 'completed').length
  const activeSubscriptions = allProfiles.filter(p => p.subscription_status === 'active').length
  const trialingUsers = allProfiles.filter(p => p.subscription_status === 'trialing').length
  const verifiedPals  = allProfiles.filter(p => p.role === 'pal' && p.is_verified).length
  const totalMessages = allMessages.length
  const avgRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : '—'

  // Subscription breakdown for chart
  const subBreakdown = {
    trialing: allProfiles.filter(p => p.subscription_status === 'trialing').length,
    active:   allProfiles.filter(p => p.subscription_status === 'active').length,
    past_due: allProfiles.filter(p => p.subscription_status === 'past_due').length,
    canceled: allProfiles.filter(p => p.subscription_status === 'canceled').length,
    none:     allProfiles.filter(p => p.subscription_status === 'none').length,
  }

  // Booking status breakdown
  const bookingBreakdown: Record<string, number> = {}
  allBookings.forEach(b => {
    bookingBreakdown[b.status] = (bookingBreakdown[b.status] ?? 0) + 1
  })

  // Recent signups (last 5)
  const recentSignups = [...allProfiles]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  // Hourly rate stats
  const palRates = allProfiles.filter(p => p.role === 'pal' && p.hourly_rate_cents > 0)
  const avgHourlyRate = palRates.length
    ? Math.round(palRates.reduce((s, p) => s + p.hourly_rate_cents, 0) / palRates.length)
    : 0

  return {
    totalUsers, totalPals, totalClients, totalBookings,
    completedBookings, activeSubscriptions, trialingUsers,
    verifiedPals, totalMessages, avgRating,
    subBreakdown, bookingBreakdown, recentSignups, avgHourlyRate,
    allProfiles,
  }
}
