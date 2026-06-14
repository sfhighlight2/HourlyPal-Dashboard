import { adminSupabase as supabase } from '@/lib/supabase-admin'
import type { Profile } from '@/lib/supabase'
import { UsersTable } from '@/components/UsersTable'

export const revalidate = 60

export default async function UsersPage() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const profiles = (data ?? []) as Profile[]

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Users</div>
          <div className="page-subtitle">{profiles.length} total users registered</div>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          {profiles.filter(p => p.role === 'pal').length} Pals · {profiles.filter(p => p.role === 'client').length} Clients
        </div>
      </div>
      <div className="page-body">
        <UsersTable profiles={profiles} />
      </div>
    </>
  )
}
