import type { Metadata } from 'next';
import Navbar  from '@/components/ui/Navbar';
import Footer  from '@/components/ui/Footer';
import ProjectsPage from '@/components/sections/Projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore the full stack web applications, tools, and payment integrations built by Ashutosh Dubey.',
  openGraph: {
    title: 'Projects — Ashutosh Dubey',
    description: 'Full stack web applications, payment integrations, and SaaS tools.',
  },
};

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
