/**
 * Main navigation bar with responsive design.
 * @module components/layout/Navbar
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Menu, X, Flame } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { NAV_LINKS } from '@/utils/constants';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useStreak } from '@/hooks/useStreak';

/**
 * Top navigation bar with logo, nav links, streak badge, and theme toggle.
 * Responsive: hamburger menu on mobile, inline links on desktop.
 */
export function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { entryDates } = useJournalEntries();
  const streak = useStreak(entryDates);

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
              BrainBreak
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = LucideIcons[link.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right section: streak + theme toggle + mobile menu */}
          <div className="flex items-center gap-2">
            {/* Streak badge */}
            {streak.current > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/10 text-orange-500 text-xs font-semibold"
                aria-label={`${streak.current} day streak`}
              >
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                {streak.current}
              </div>
            )}

            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg hover:bg-muted transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              )}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileOpen && (
          <div
            id="mobile-nav"
            className="md:hidden pb-4 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const Icon = LucideIcons[link.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
