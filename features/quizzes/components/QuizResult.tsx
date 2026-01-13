"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { QuizResult as QuizResultType } from "../types";

interface QuizResultProps {
  result: QuizResultType;
  moduleName: string;
  onRetry: () => void;
}

/**
 * Displays the final quiz results with score and progress updates.
 * @param result - The quiz result data
 * @param moduleName - Name of the module for display
 * @param onRetry - Callback to retry the quiz
 */
export function QuizResult({ result, moduleName, onRetry }: QuizResultProps) {
  const { score, totalItems, percentage, newModuleProgress, isModuleCompleted, unlockedNextModule } =
    result;

  // Determine performance level
  const getPerformanceData = () => {
    if (percentage >= 100) {
      return { emoji: "🎉", message: "¡Perfecto!", color: "text-foreground" };
    }
    if (percentage >= 80) {
      return { emoji: "✨", message: "¡Excelente!", color: "text-foreground" };
    }
    if (percentage >= 60) {
      return { emoji: "👍", message: "¡Bien hecho!", color: "text-foreground" };
    }
    if (percentage >= 40) {
      return { emoji: "💪", message: "Sigue practicando", color: "text-muted-foreground" };
    }
    return { emoji: "📚", message: "Necesitas más práctica", color: "text-muted-foreground" };
  };

  const performance = getPerformanceData();

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Performance emoji */}
      <div className="mb-4 text-6xl">{performance.emoji}</div>

      {/* Performance message */}
      <h2 className={`mb-2 text-2xl font-bold ${performance.color}`}>
        {performance.message}
      </h2>

      {/* Module name */}
      <p className="mb-6 text-muted-foreground">{moduleName}</p>

      {/* Score panel */}
      <div className="manga-panel manga-shadow mb-6 w-full max-w-xs p-6">
        <div className="mb-4 text-center">
          <span className="text-5xl font-bold">{score}</span>
          <span className="text-2xl text-muted-foreground">/{totalItems}</span>
        </div>

        <div className="mb-4 h-3 w-full border-2 border-foreground bg-secondary">
          <div
            className="h-full bg-foreground transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-center text-xl font-bold">{Math.round(percentage)}%</p>
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid w-full max-w-xs grid-cols-2 gap-3">
        <div className="manga-border bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Tiempo</p>
          <p className="text-lg font-bold">{formatTime(result.timeSpentMs)}</p>
        </div>
        <div className="manga-border bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Progreso módulo</p>
          <p className="text-lg font-bold">{Math.round(newModuleProgress)}%</p>
        </div>
      </div>

      {/* Achievement badges */}
      {(isModuleCompleted || unlockedNextModule) && (
        <div className="mb-6 space-y-2">
          {isModuleCompleted && (
            <div className="manga-border manga-shadow-sm inline-flex items-center gap-2 bg-foreground px-4 py-2 text-background">
              <span>✓</span>
              <span className="font-bold">¡Módulo completado!</span>
            </div>
          )}
          {unlockedNextModule && (
            <div className="manga-border manga-shadow-sm inline-flex items-center gap-2 bg-background px-4 py-2">
              <span>🔓</span>
              <span className="font-bold">¡Nuevo módulo desbloqueado!</span>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          onClick={onRetry}
          className="manga-btn w-full bg-foreground py-3 text-lg font-bold text-background"
        >
          Intentar de nuevo
        </button>

        <Link href="/dashboard" className="w-full">
          <button className="manga-btn w-full bg-background py-3 text-lg font-bold">
            Volver al inicio
          </button>
        </Link>
      </div>
    </div>
  );
}
