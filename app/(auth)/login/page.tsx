'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Auth not wired up yet — will connect to Supabase Auth in a future phase
    setTimeout(() => {
      window.location.href = '/'
    }, 800)
  }

  return (
    <div style={styles.root}>

      {/* ── LEFT PANEL — brand / hero ─────────────────────────────── */}
      <div style={styles.left}>
        {/* Background decoration blobs */}
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <div style={styles.leftInner}>
          {/* Logo */}
          <div style={styles.leftLogo}>
            <Image src="/logo.jpg" alt="HourlyPal" width={52} height={52}
              style={{ borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} priority />
            <div>
              <div style={styles.leftLogoName}>HourlyPal</div>
              <div style={styles.leftLogoTag}>Admin Panel</div>
            </div>
          </div>

          {/* Hero copy */}
          <div style={styles.heroSection}>
            <h1 style={styles.heroTitle}>
              Where clients find their perfect PAL.
            </h1>
            <p style={styles.heroSub}>
              Verify PALs, track bookings, and keep the marketplace running smoothly — all in one place built for the HourlyPal team.
            </p>
          </div>

          {/* Stats row */}
          <div style={styles.statsRow}>
            {[
              { label: 'Total Users',   value: '–' },
              { label: 'Bookings',      value: '–' },
              { label: 'Active Pals',   value: '–' },
            ].map(s => (
              <div key={s.label} style={styles.statItem}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — login form ──────────────────────────────── */}
      <div style={styles.right}>
        <div style={styles.formCard}>
          {/* Header */}
          <div style={styles.formHeader}>
            <div style={styles.formIconWrap}>
              <Lock size={20} color="#00C4A7" />
            </div>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSub}>Sign in to your admin account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={styles.form}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label htmlFor="email" style={styles.label}>Email address</label>
              <div style={styles.inputWrap}>
                <Mail size={16} color="#8FA3BC" style={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@hourlypal.com"
                  required
                  style={styles.input}
                  onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={e  => Object.assign(e.target.style, styles.inputBlur)}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <Lock size={16} color="#8FA3BC" style={styles.inputIcon} />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...styles.input, paddingRight: 44 }}
                  onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={e  => Object.assign(e.target.style, styles.inputBlur)}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={styles.eyeBtn}>
                  {showPw ? <EyeOff size={16} color="#8FA3BC" /> : <Eye size={16} color="#8FA3BC" />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <button type="button" style={styles.forgotBtn}>Forgot password?</button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
            >
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                <>
                  Sign in <ArrowRight size={16} style={{ marginLeft: 6 }} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p style={styles.footerNote}>
            This dashboard is for authorised HourlyPal team members only.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Styles ──────────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, sans-serif",
    WebkitFontSmoothing: 'antialiased',
  },

  /* Left panel */
  left: {
    flex: '1 1 45%',
    background: 'linear-gradient(145deg, #0B1629 0%, #0E1D36 50%, #0d2040 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 56px',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: '-120px',
    right: '-80px',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,196,167,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    bottom: '-100px',
    left: '-60px',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,196,167,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  leftInner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 420,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 48,
  },
  leftLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  leftLogoName: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  leftLogoTag: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#00C4A7',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginTop: 2,
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: 'rgba(0,196,167,0.12)',
    border: '1px solid rgba(0,196,167,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.25,
    letterSpacing: '-0.03em',
    margin: 0,
  },
  heroSub: {
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.65,
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    gap: 32,
    paddingTop: 24,
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#00C4A7',
    letterSpacing: '-0.03em',
  },
  statLabel: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  /* Right panel */
  right: {
    flex: '1 1 55%',
    background: '#F0F4F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
  },
  formCard: {
    background: '#fff',
    borderRadius: 20,
    padding: '44px 40px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  formHeader: {
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  formIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'rgba(0,196,167,0.10)',
    border: '1px solid rgba(0,196,167,0.20)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  formTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#0B1629',
    margin: 0,
    letterSpacing: '-0.03em',
  },
  formSub: {
    fontSize: '0.875rem',
    color: '#4A6080',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#0B1629',
    letterSpacing: '0.01em',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 13,
    pointerEvents: 'none',
    flexShrink: 0,
  },
  input: {
    width: '100%',
    height: 46,
    paddingLeft: 40,
    paddingRight: 16,
    background: '#F5F7FA',
    border: '1.5px solid rgba(0,0,0,0.08)',
    borderRadius: 10,
    fontSize: '0.9rem',
    color: '#0B1629',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#00C4A7',
    boxShadow: '0 0 0 3px rgba(0,196,167,0.12)',
    background: '#fff',
  },
  inputBlur: {
    borderColor: 'rgba(0,0,0,0.08)',
    boxShadow: 'none',
    background: '#F5F7FA',
  },
  eyeBtn: {
    position: 'absolute',
    right: 13,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  forgotBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.78rem',
    color: '#4A6080',
    fontFamily: 'inherit',
    fontWeight: 500,
    padding: 0,
    textDecoration: 'underline',
    textDecorationColor: 'transparent',
    transition: 'color 0.15s',
  },
  submitBtn: {
    width: '100%',
    height: 48,
    background: 'linear-gradient(135deg, #00C4A7, #00A48B)',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    fontSize: '0.925rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    boxShadow: '0 4px 20px rgba(0,196,167,0.30)',
    transition: 'opacity 0.15s, transform 0.15s',
    marginTop: 4,
  },
  spinner: {
    width: 18,
    height: 18,
    border: '2.5px solid rgba(255,255,255,0.35)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  footerNote: {
    marginTop: 28,
    fontSize: '0.72rem',
    color: '#8FA3BC',
    textAlign: 'center',
    lineHeight: 1.5,
  },
}
