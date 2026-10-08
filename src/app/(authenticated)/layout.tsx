import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { cookies } from 'next/headers';
import { getAccessToken } from '@/lib/api/tokens';

// Authenticated app pages — Navbar + Footer shell.
// TODO: add server-side auth guard here once JWT middleware is wired up.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Check if user is logged in
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const token = getAccessToken(cookieHeader);
  const isLoggedIn = !!token;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-[#fdf6ee]">{children}</main>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
