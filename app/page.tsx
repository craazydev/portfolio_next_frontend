import Navbar   from '@/components/ui/Navbar';
import Footer   from '@/components/ui/Footer';
import CursorGlow from '@/components/ui/CursorGlow';
import Hero     from '@/components/sections/Hero';
import About    from '@/components/sections/About';
import Skills   from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact  from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
