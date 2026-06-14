'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/',         icon: '⬡',  label: 'Overview',  section: 'main' },
  { href: '/users',    icon: '👥', label: 'Users',     section: 'main' },
  { href: '/bookings', icon: '📅', label: 'Bookings',  section: 'main' },
  { href: '/pals',     icon: '⭐', label: 'Pals',      section: 'main' },
  { href: '/reviews',  icon: '💬', label: 'Reviews',   section: 'data' },
  { href: '/messages', icon: '✉️', label: 'Messages',  section: 'data' },
  { href: '/services', icon: '🛠', label: 'Services',  section: 'data' },
]

export function Sidebar() {
  const pathname = usePathname()
  const mainNav = navItems.filter(i => i.section === 'main')
  const dataNav  = navItems.filter(i => i.section === 'data')

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Image
          src="/logo.jpg"
          alt="HourlyPal"
          width={44}
          height={44}
          style={{ borderRadius: 10, flexShrink: 0 }}
          priority
        />
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-name">HourlyPal</div>
          <div className="sidebar-logo-tag">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Dashboard</div>
        {mainNav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link${pathname === item.href ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="nav-section-label" style={{ marginTop: 8 }}>Data</div>
        {dataNav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link${pathname === item.href ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-text">
          <span className="sidebar-footer-dot" />
          Connected to Supabase
        </div>
        <div className="sidebar-footer-text" style={{ marginTop: 4, fontSize: '0.66rem', color: 'var(--text-muted)' }}>
          Read-only · HourlyPal v1.0
        </div>
      </div>
    </aside>
  )
}
