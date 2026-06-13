/**
 * Quick statistics cards for the dashboard.
 * @module components/dashboard/QuickStats
 */

'use client';

import { BookOpen, Flame, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMoodEmoji } from '@/utils/mood';
import type { QuickStatsData } from '@/types';

/** Props for the QuickStats component */
interface QuickStatsProps {
  readonly stats: QuickStatsData;
}

/** Individual stat card config */
interface StatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: React.ReactNode;
  readonly gradient: string;
}

/**
 * Displays 4 key statistics as styled cards.
 * Total entries, average mood, current streak, days tracked.
 */
export function QuickStats({ stats }: QuickStatsProps) {
  const cards: StatCard[] = [
    {
      label: 'Total Entries',
      value: String(stats.totalEntries),
      icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
      gradient: 'from-violet-500/20 to-violet-500/5',
    },
    {
      label: 'Avg Mood',
      value: stats.averageMood > 0
        ? `${getMoodEmoji(Math.round(stats.averageMood))} ${stats.averageMood.toFixed(1)}`
        : '—',
      icon: <TrendingUp className="h-5 w-5" aria-hidden="true" />,
      gradient: 'from-cyan-500/20 to-cyan-500/5',
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: <Flame className="h-5 w-5" aria-hidden="true" />,
      gradient: 'from-orange-500/20 to-orange-500/5',
    },
    {
      label: 'Days Tracked',
      value: String(stats.daysTracked),
      icon: <Calendar className="h-5 w-5" aria-hidden="true" />,
      gradient: 'from-emerald-500/20 to-emerald-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            'rounded-xl border bg-gradient-to-br p-4 transition-all duration-200',
            'hover:shadow-md hover:scale-[1.02]',
            card.gradient
          )}
        >
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            {card.icon}
            <span className="text-xs font-medium">{card.label}</span>
          </div>
          <p className="text-xl font-bold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
