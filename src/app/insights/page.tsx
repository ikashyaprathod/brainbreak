/**
 * Insights page — detailed mood patterns, triggers, and mindfulness.
 * @module app/insights/page
 */

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, Sparkles, Leaf } from 'lucide-react';

import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { StressTriggers } from '@/components/dashboard/StressTriggers';
import { ExerciseCard } from '@/components/mindfulness/ExerciseCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { STORAGE_KEYS } from '@/utils/constants';
import type { UserProfile, MindfulnessExercise } from '@/types';

/** Lazy load MoodChart */
const MoodChart = dynamic(
  () => import('@/components/dashboard/MoodChart').then((m) => ({ default: m.MoodChart })),
  {
    loading: () => <div className="h-56 rounded-xl bg-muted animate-pulse" />,
    ssr: false,
  }
);

/**
 * Insights page showing mood trends, aggregated stress triggers,
 * and AI-generated mindfulness exercises.
 */
export default function InsightsPage() {
  const [profile] = useLocalStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
  const { entries, allTriggers } = useJournalEntries();
  const { averageMood } = useMoodHistory();
  const [exercises, setExercises] = useState<MindfulnessExercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);

  const examType = profile?.examType ?? 'JEE';

  /** Fetch mindfulness exercises on page load */
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoadingExercises(true);
      try {
        const response = await fetch('/api/mindfulness', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: Math.round(averageMood) || 5,
            triggers: allTriggers.slice(0, 5),
            examType,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setExercises(data.exercises);
        }
      } catch {
        // Silently fail — exercises are supplementary
      } finally {
        setIsLoadingExercises(false);
      }
    };

    fetchExercises();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-outfit)]">
          Insights & Wellness 🔍
        </h1>
        <p className="text-sm text-muted-foreground">
          Your emotional patterns and personalized mindfulness exercises
        </p>
      </div>

      {/* Mood Trends */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold font-[family-name:var(--font-outfit)]">
            Mood Trends
          </h2>
        </div>
        <MoodChart entries={entries} />
      </div>

      {/* Stress Triggers */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-orange-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold font-[family-name:var(--font-outfit)]">
            All-Time Stress Triggers
          </h2>
        </div>
        <StressTriggers triggers={allTriggers} />
      </div>

      {/* Patterns Summary */}
      {entries.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold mb-3 font-[family-name:var(--font-outfit)]">
            📊 Key Patterns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
              <p className="text-xs text-muted-foreground">Total Entries</p>
              <p className="text-xl font-bold">{entries.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-xs text-muted-foreground">Average Mood</p>
              <p className="text-xl font-bold">{averageMood > 0 ? averageMood.toFixed(1) : '—'}/10</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
              <p className="text-xs text-muted-foreground">Triggers Identified</p>
              <p className="text-xl font-bold">{allTriggers.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mindfulness Exercises */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="h-5 w-5 text-emerald-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold font-[family-name:var(--font-outfit)]">
            Mindfulness Exercises
          </h2>
          <span className="text-xs text-muted-foreground">AI-recommended for you</span>
        </div>

        {isLoadingExercises ? (
          <LoadingSpinner message="Getting personalized exercises..." />
        ) : exercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {exercises.map((exercise, index) => (
              <ExerciseCard key={index} exercise={exercise} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add an NVIDIA API key to get personalized mindfulness exercises 🧘
          </p>
        )}
      </div>
    </div>
  );
}
