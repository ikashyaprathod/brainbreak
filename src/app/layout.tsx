/**
 * Root layout for BrainBreak application.
 * Sets up fonts, metadata, theme provider, and global layout.
 * @module app/layout
 */

import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

/** SEO Metadata */
export const metadata: Metadata = {
  title: 'BrainBreak — AI Mental Wellness for Students',
  description:
    'AI-powered mental wellness tracker for Indian students preparing for NEET, JEE, CUET, CAT, GATE, and UPSC. Track your mood, journal daily, and get AI-driven coping strategies.',
  keywords: [
    'mental health',
    'student wellness',
    'NEET preparation',
    'JEE stress',
    'exam anxiety',
    'AI companion',
    'mood tracker',
    'mindfulness',
  ],
  authors: [{ name: 'BrainBreak Team' }],
  openGraph: {
    title: 'BrainBreak — AI Mental Wellness for Students',
    description: 'Track your mood, journal daily, and get AI-driven support during exam prep.',
    type: 'website',
  },
};

/**
 * Root layout component wrapping all pages.
 * Provides theme, fonts, and global navigation.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans min-h-screen flex flex-col"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
