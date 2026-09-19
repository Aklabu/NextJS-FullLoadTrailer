// Auth pages render their own chrome — no shared Navbar or Footer.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
