import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';

// Authenticated app pages — Navbar + Footer shell.
// TODO: add server-side auth guard here once JWT middleware is wired up.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-[#fdf6ee]">{children}</main>
      <Footer />
    </div>
  );
}
