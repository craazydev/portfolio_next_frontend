import type { Metadata } from 'next';
import Navbar  from '@/components/ui/Navbar';
import Footer  from '@/components/ui/Footer';
import About   from '@/components/sections/About';
import Skills  from '@/components/sections/Skills';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Ashutosh Dubey — Full Stack Developer from Lucknow with 3+ years of experience in React, Node.js, and MongoDB.',
  openGraph: {
    title: 'About — Ashutosh Dubey',
    description: 'Full Stack Developer from Lucknow. 3+ years, 25+ projects, payment integrations expert.',
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <About />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
