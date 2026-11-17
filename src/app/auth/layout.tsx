import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { cookies } from 'next/headers';
import { getAccessToken } from '@/lib/api/tokens';

// Auth pages get the shared Navbar + Footer shell.
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const token = getAccessToken(cookieHeader);
  const isLoggedIn = !!token;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
