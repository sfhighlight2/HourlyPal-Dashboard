/**
 * Auth layout — no sidebar, just full-screen pages.
 * Route group (auth) is invisible in the URL: /login not /(auth)/login
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
