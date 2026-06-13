/**
 * Footer component with credits.
 * @module components/layout/Footer
 */

import { Heart } from 'lucide-react';

/**
 * Simple footer with hackathon credit and love.
 */
export function Footer() {
  return (
    <footer className="border-t py-4 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <span>Built with</span>
        <Heart className="h-3 w-3 text-red-500 fill-red-500" aria-hidden="true" />
        <span>for Indian students</span>
        <span className="mx-1">·</span>
        <span>PromptWars × Google for Developers</span>
      </div>
    </footer>
  );
}
