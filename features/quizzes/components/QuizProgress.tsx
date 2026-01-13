"use client";

interface QuizProgressProps {
  current: number;
  total: number;
  score: number;
}

/**
 * Displays quiz progress with current question number and score.
 * @param current - Current question number (1-indexed)
 * @param total - Total number of questions
 * @param score - Current score
 */
export function QuizProgress({ current, total, score }: QuizProgressProps) {
  const progress = (current / total) * 100;

  return (
    <div className="mb-6">
      {/* Progress info */}
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span>
          {current} / {total}
        </span>
        <span className="text-muted-foreground">
          {score} correctas
        </span>
      </div>

      {/* Progress bar */}
      <div className="manga-border h-4 w-full bg-secondary">
        <div
          className="h-full bg-foreground transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
