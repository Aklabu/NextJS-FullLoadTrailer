import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';

// All marketing/public pages get the shared Navbar + Footer shell.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
