import type { Metadata } from 'next';
import Navbar  from '@/components/ui/Navbar';
import Footer  from '@/components/ui/Footer';
import ProjectsPage from '@/components/sections/Projects';
import { getPageMeta } from '@/lib/getPageMeta';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMeta('projects');
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <ProjectsPage />
      </main>
      <Footer />
    </>
  );
}
