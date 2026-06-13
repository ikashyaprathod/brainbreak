/**
 * Dashboard / Home page for BrainBreak.
 * Shows quick stats, mood chart, streak, triggers, and recent entries.
 * @module app/page
 */

'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BookOpen, MessageCircle, ArrowRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { useStreak } from '@/hooks/useStreak';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { StressTriggers } from '@/components/dashboard/StressTriggers';
import { JournalCard } from '@/components/journal/JournalCard';
import { ExamSelector } from '@/components/shared/ExamSelector';
import { STORAGE_KEYS } from '@/utils/constants';
import { getTimeGreeting } from '@/utils/date';
import { exportAllData } from '@/utils/storage';
import type { UserProfile, ExamType, QuickStatsData } from '@/types';

/** Lazy load MoodChart since Recharts is heavy */
const MoodChart = dynamic(
  () => import('@/components/dashboard/MoodChart').then((m) => ({ default: m.MoodChart })),
  {
    loading: () => (
      <div className="h-56 rounded-xl bg-muted animate-pulse flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading chart...</span>
      </div>
    ),
    ssr: false,
  }
);

/**
 * Main dashboard page.
 * Shows greeting, stats, mood chart, streak, triggers, and recent entries.
 * Includes onboarding flow for first-time users.
 */
export default function DashboardPage() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.USER_PROFILE,
    null
  );
  const { entries, entryDates, allTriggers } = useJournalEntries();
  const { averageMood } = useMoodHistory();
  const streak = useStreak(entryDates);

  /** Memoized quick stats */
  const stats: QuickStatsData = useMemo(() => {
    const uniqueDates = new Set(entryDates);
    return {
      totalEntries: entries.length,
      averageMood,
      currentStreak: streak.current,
      daysTracked: uniqueDates.size,
    };
  }, [entries.length, averageMood, streak, entryDates]);

  /** Handle exam selection during onboarding */
  const handleExamSelect = (examType: ExamType) => {
    setProfile({
      name: '',
      examType,
      onboarded: true,
    });
  };

  /** Handle data export */
  const handleExport = () => {
    const data = exportAllData(Object.values(STORAGE_KEYS));
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainbreak-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Onboarding ──────────────────────────────────────
  if (!profile?.onboarded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)]">
              Welcome to <span className="gradient-text">BrainBreak</span> 🧠
            </h1>
            <p className="text-muted-foreground">
              Your AI-powered study companion. Let&apos;s start by selecting the exam you&apos;re preparing for.
            </p>
          </div>

          <ExamSelector
            selected={profile?.examType ?? null}
            onSelect={handleExamSelect}
          />

          <p className="text-xs text-muted-foreground">
            You can change this anytime in your settings.
          </p>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───────────────────────────────────────
  const recentEntries = entries.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-outfit)]">
            {getTimeGreeting()} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s how your {profile.examType} journey is going
          </p>
        </div>
        <button
          onClick={handleExport}
          className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Export your data"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Export Data
        </button>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats} />

      {/* Mood Chart + Streak Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold mb-3 font-[family-name:var(--font-outfit)]">
            Mood Trends
          </h2>
          <MoodChart entries={entries} />
        </div>
        <div className="space-y-4">
          <StreakCounter streak={streak} />
          <div className="rounded-xl border bg-card p-4">
            <StressTriggers triggers={allTriggers} />
          </div>
        </div>
      </div>

      {/* CTA + Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link
          href="/journal"
          className={cn(
            'flex items-center gap-3 p-4 rounded-xl border',
            'bg-gradient-to-r from-violet-500/10 to-violet-500/5',
            'hover:from-violet-500/15 hover:to-violet-500/10',
            'transition-all duration-200 group',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          )}
        >
          <BookOpen className="h-8 w-8 text-violet-500" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold text-sm">How are you feeling today?</p>
            <p className="text-xs text-muted-foreground">Log your mood & journal your thoughts</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>

        <Link
          href="/chat"
          className={cn(
            'flex items-center gap-3 p-4 rounded-xl border',
            'bg-gradient-to-r from-cyan-500/10 to-cyan-500/5',
            'hover:from-cyan-500/15 hover:to-cyan-500/10',
            'transition-all duration-200 group',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          )}
        >
          <MessageCircle className="h-8 w-8 text-cyan-500" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Talk to BrainBreak AI</p>
            <p className="text-xs text-muted-foreground">Your AI study companion is here to help</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold font-[family-name:var(--font-outfit)]">
              Recent Entries
            </h2>
            <Link
              href="/journal"
              className="text-xs text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
