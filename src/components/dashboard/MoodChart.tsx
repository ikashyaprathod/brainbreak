/**
 * Mood trend chart using Recharts (lazy loaded).
 * Shows mood scores over time with gradient area fill.
 * @module components/dashboard/MoodChart
 */

'use client';

import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { JournalEntry } from '@/types';

/** Props for the MoodChart component */
interface MoodChartProps {
  readonly entries: JournalEntry[];
}

/** Time range options */
type TimeRange = 7 | 14 | 30;

/**
 * Area chart displaying mood trends over time.
 * Supports 7/14/30 day time ranges.
 * Uses gradient fill from red (low) to green (high).
 */
export function MoodChart({ entries }: MoodChartProps) {
  const [range, setRange] = useState<TimeRange>(7);

  /** Memoized chart data filtered by time range */
  const chartData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - range);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return entries
      .filter((e) => e.date >= cutoffStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: new Date(e.date + 'T00:00:00').toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
        }),
        mood: e.mood,
        emoji: e.emoji,
        fullDate: e.date,
      }));
  }, [entries, range]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <p className="text-3xl mb-2">📊</p>
        <p className="text-sm text-muted-foreground">
          Start journaling to see your mood trends here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Time range selector */}
      <div className="flex items-center gap-2">
        {([7, 14, 30] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            aria-pressed={range === r}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              range === r
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {r}D
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[2, 4, 6, 8, 10]}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload as { date: string; mood: number; emoji: string };
                return (
                  <div className="rounded-lg border bg-popover p-2 shadow-md">
                    <p className="text-xs font-medium">{data.date}</p>
                    <p className="text-sm">
                      {data.emoji} Mood: {data.mood}/10
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#moodGradient)"
              dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
