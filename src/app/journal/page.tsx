/**
 * Journal page — mood logging + journal entry + AI analysis.
 * @module app/journal/page
 */

'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { MoodSelector } from '@/components/journal/MoodSelector';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { JournalCard } from '@/components/journal/JournalCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import type { UserProfile, MoodScore, AIAnalysis } from '@/types';

/**
 * Journal page with mood selector, journal editor, and past entries.
 * Submitting triggers AI analysis of the entry.
 */
export default function JournalPage() {
  const [profile] = useLocalStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
  const { entries, addEntry, updateWithAnalysis } = useJournalEntries();
  const { addMood } = useMoodHistory();
  const [mood, setMood] = useState<number>(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<AIAnalysis | null>(null);

  const examType = profile?.examType ?? 'JEE';

  /** Handles journal submission and AI analysis */
  const handleSubmit = async (content: string) => {
    setIsAnalyzing(true);
    setLatestAnalysis(null);

    try {
      // 1. Save the journal entry
      const entry = addEntry(content, mood as MoodScore, examType);

      // 2. Save the mood entry
      const moodEmoji = ['😫', '😫', '😟', '😟', '😐', '😐', '😊', '😊', '🤩', '🤩'][mood - 1];
      addMood(mood as MoodScore, moodEmoji, examType);

      // 3. Call AI analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mood, examType }),
      });

      if (response.ok) {
        const data = await response.json();
        const analysis: AIAnalysis = data.analysis;
        updateWithAnalysis(entry.id, analysis);
        setLatestAnalysis(analysis);
      }

      // Reset mood to default
      setMood(5);
    } catch {
      // Entry is saved even if analysis fails
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-outfit)]">
          Daily Journal 📓
        </h1>
        <p className="text-sm text-muted-foreground">
          Log your mood and reflect on your day. Our AI will help you spot patterns.
        </p>
      </div>

      {/* Mood + Editor Card */}
      <div className="rounded-xl border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold mb-3">How are you feeling right now?</h2>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="h-px bg-border" aria-hidden="true" />

        <div>
          <h2 className="text-sm font-semibold mb-3">What&apos;s on your mind?</h2>
          <JournalEditor
            onSubmit={handleSubmit}
            isSubmitting={isAnalyzing}
            examType={examType}
          />
        </div>
      </div>

      {/* AI Analysis Result */}
      {isAnalyzing && (
        <div className="rounded-xl border bg-card p-6">
          <LoadingSpinner message="AI is analyzing your entry..." size="md" />
        </div>
      )}

      {latestAnalysis && !isAnalyzing && (
        <div className="rounded-xl border bg-primary/5 p-6 space-y-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-sm font-semibold">AI Analysis</h2>
          </div>

          <p className="text-sm text-muted-foreground">{latestAnalysis.summary}</p>

          {latestAnalysis.triggers.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-foreground mb-2">🎯 Stress Triggers</h3>
              <div className="flex flex-wrap gap-1.5">
                {latestAnalysis.triggers.map((trigger, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}

          {latestAnalysis.suggestions.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-foreground mb-2">💡 Suggestions</h3>
              <ul className="space-y-1.5">
                {latestAnalysis.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Past Entries */}
      {entries.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3 font-[family-name:var(--font-outfit)]">
            Past Entries ({entries.length})
          </h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
