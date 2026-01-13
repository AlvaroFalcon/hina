"use client";

import type { QueueState } from "../hooks/useAnswerQueue";

interface QuizSyncStatusProps {
  queueState: QueueState;
}

/**
 * Small indicator showing sync status during quiz.
 * Shows only when there are pending syncs or failures.
 * @param queueState - Current state of the answer queue
 */
export function QuizSyncStatus({ queueState }: QuizSyncStatusProps) {
  const { pending, syncing, failed, allSynced } = queueState;

  // Don't show anything if all synced
  if (allSynced && failed === 0) {
    return null;
  }

  // Show syncing indicator
  if (pending > 0 || syncing > 0) {
    return (
      <div className="absolute -top-2 right-0 flex items-center gap-1.5 text-xs text-muted-foreground">
        <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/50" />
        <span>Guardando...</span>
      </div>
    );
  }

  // Show error indicator if some failed
  if (failed > 0) {
    return (
      <div className="absolute -top-2 right-0 flex items-center gap-1.5 text-xs text-destructive">
        <div className="h-2 w-2 rounded-full bg-destructive" />
        <span>{failed} sin guardar</span>
      </div>
    );
  }

  return null;
}
