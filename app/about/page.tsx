import type { Metadata } from 'next';
import Navbar  from '@/components/ui/Navbar';
import Footer  from '@/components/ui/Footer';
import About   from '@/components/sections/About';
import Skills  from '@/components/sections/Skills';
import { getPageMeta } from '@/lib/getPageMeta';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMeta('about');
}

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
