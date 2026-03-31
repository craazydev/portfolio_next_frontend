import type { Metadata } from 'next';
import Navbar  from '@/components/ui/Navbar';
import Footer  from '@/components/ui/Footer';
import Contact from '@/components/sections/Contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Ashutosh Dubey for freelance web development, full stack projects, or payment integration work.',
  openGraph: {
    title:       'Contact — Ashutosh Dubey',
    description: 'Available for freelance and full-time opportunities.',
  },
};

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
