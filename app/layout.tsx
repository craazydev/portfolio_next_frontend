import type { Metadata } from 'next';
import './globals.css';
import Loader         from '@/components/ui/Loader';
import PageTransition from '@/components/ui/PageTransition';
import ChatWidget     from '@/components/ui/ChatWidget';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.crazydev.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ashutosh Dubey — Full Stack Developer | Lucknow',
    template: '%s | Ashutosh Dubey',
  },
  description:
    'Ashutosh Dubey is a Full Stack Developer from Lucknow with 3+ years of experience building scalable web applications, payment integrations, and SaaS products.',
  keywords: [
    'Ashutosh Dubey',
    'Full Stack Developer Lucknow',
    'React Developer India',
    'Node.js Developer',
    'Next.js Developer',
    'Web Developer Lucknow',
    'PHP Developer',
    'MongoDB Developer',
    'Razorpay Integration',
    'PhonePe Integration',
  ],
  authors: [{ name: 'Ashutosh Dubey', url: SITE_URL }],
  creator: 'Ashutosh Dubey',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Ashutosh Dubey — Full Stack Developer',
    title: 'Ashutosh Dubey — Full Stack Developer | Lucknow',
    description:
      '3+ years building scalable web apps, APIs, and payment integrations. Let\'s build something great.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ashutosh Dubey — Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashutosh Dubey — Full Stack Developer',
    description: '3+ years building scalable web apps and payment integrations.',
    images: ['/og-image.png'],
    creator: '@ashutoshdubey',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon:    '/favicon.ico',
    apple:   '/apple-touch-icon.png',
    shortcut:'/favicon-32x32.png',
  },
  // Add your real code from Google Search Console → Settings → Ownership verification
  // verification: { google: 'REPLACE_WITH_REAL_CODE' },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ashutosh Dubey',
  url: SITE_URL,
  image: `${SITE_URL}/profile.jpg`,
  jobTitle: 'Full Stack Developer',
  worksFor: { '@type': 'Organization', name: 'Freelance' },
  address: { '@type': 'PostalAddress', addressLocality: 'Lucknow', addressCountry: 'IN' },
  sameAs: [
    'https://github.com/Ashutosh724425',
    'https://linkedin.com/in/ashutosh-dubey-78111225b/',
  ],
  knowsAbout: ['React', 'Next.js', 'Node.js', 'MongoDB', 'PHP', 'Full Stack Development'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="noise-bg">
        <Loader />
        <PageTransition>{children}</PageTransition>
        <ChatWidget />
      </body>
    </html>
  );
}
