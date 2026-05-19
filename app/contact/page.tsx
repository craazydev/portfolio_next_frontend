import type { Metadata } from 'next';
import Navbar  from '@/components/ui/Navbar';
import Footer  from '@/components/ui/Footer';
import Contact from '@/components/sections/Contact';
import { getPageMeta } from '@/lib/getPageMeta';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMeta('contact');
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
