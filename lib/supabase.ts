import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types matching the HourlyPal database schema
export type UserRole = 'client' | 'pal'
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'none'
export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'in_progress' | 'completed'
export type TimeSlot = 'morning' | 'afternoon' | 'evening'
export type CancelledByRole = 'client' | 'pal'

export interface Profile {
  id: string
  role: UserRole | null
  alias: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  address: string | null
  city: string
  state: string
  zip: string
  phone: string
  email: string
  hourly_rate_cents: number
  subscription_status: SubscriptionStatus
  trial_ends_at: string | null
  onboarding_complete: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  photos: string[]
}

export interface Booking {
  id: string
  client_id: string
  pal_id: string
  service_category: string
  booking_date: string
  time_slot: TimeSlot
  location_address: string
  client_note: string | null
  status: BookingStatus
  hourly_rate_cents: number
  duration_hours: number | null
  arrival_time: string | null
  cancellation_reason: string | null
  cancelled_by: CancelledByRole | null
  created_at: string
  accepted_at: string | null
  completed_at: string | null
}

export interface Service {
  id: string
  label: string
  description: string
}

export interface ProfileService {
  id: string
  profile_id: string
  service_id: string
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  written_review: string | null
  created_at: string
}

export interface Message {
  id: string
  booking_id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  read_at: string | null
}

export interface ProfileAvailability {
  id: string
  profile_id: string
  day_of_week: number
  morning: boolean
  afternoon: boolean
  evening: boolean
}

export interface ProfileLanguage {
  id: string
  profile_id: string
  language: string
  stars: number
}

export interface BlockedUser {
  id: string
  blocker_id: string
  blocked_id: string
  created_at: string
}
