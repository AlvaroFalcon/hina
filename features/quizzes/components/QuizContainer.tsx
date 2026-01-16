"use client";

import { useState, useCallback, useRef } from "react";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResult } from "./QuizResult";
import {
  completeQuizAction,
  startQuizAction,
  submitAnswersBatchAction,
} from "../actions/quiz-actions";
import type { QuizSession, QuizResult as QuizResultType } from "../types";
import type { BatchAnswer } from "../lib/submit-answers-batch";

type QuizState = "playing" | "feedback" | "completing" | "completed" | "error";

interface QuizContainerProps {
  initialSession: QuizSession;
}

/**
 * Main quiz container with optimistic local updates.
 * Provides instant feedback and submits all answers in batch at completion.
 * @param initialSession - The initial quiz session data
 */
export function QuizContainer({ initialSession }: QuizContainerProps) {
  const [session, setSession] = useState<QuizSession>(initialSession);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<QuizState>("playing");
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);
  const [result, setResult] = useState<QuizResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localScore, setLocalScore] = useState(0);

  // Store answers locally until quiz completion
  const answersRef = useRef<BatchAnswer[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  const currentQuestion = session.questions[currentIndex];
  const isLastQuestion = currentIndex === session.questions.length - 1;

  /**
   * Handle answer submission with instant local feedback.
   */
  const handleAnswer = useCallback(
    (answer: string, timeMs: number) => {
      if (state !== "playing" || !currentQuestion) return;

      // Instant local verification
      const isCorrect =
        answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

      // Store answer locally
      answersRef.current.push({
        characterId: currentQuestion.character.id,
        userAnswer: answer,
        isCorrect,
        responseTimeMs: timeMs,
      });

      // Update local score
      if (isCorrect) {
        setLocalScore((prev) => prev + 1);
      }

      // Show feedback
      setFeedback({
        isCorrect,
        correctAnswer: currentQuestion.correctAnswer,
      });
      setState("feedback");

      // Auto-advance after showing feedback
      setTimeout(() => {
        if (isLastQuestion) {
          // Call handleComplete directly to avoid stale closure
          setState("completing");
          submitAnswersBatchAction(session.id, answersRef.current)
            .then((batchResult) => {
              if (!batchResult.success) {
                throw new Error(batchResult.error);
              }
              return completeQuizAction(session.id);
            })
            .then((completeResponse) => {
              if (!completeResponse.success) {
                throw new Error(completeResponse.error);
              }
              setResult(completeResponse.data);
              setState("completed");
            })
            .catch((err) => {
              setError(
                err instanceof Error ? err.message : "Error al completar el quiz"
              );
              setState("error");
            });
        } else {
          setCurrentIndex((prev) => prev + 1);
          setFeedback(null);
          setState("playing");
        }
      }, 1200);
    },
    [state, currentQuestion, isLastQuestion, session.id]
  );

  /**
   * Retry the quiz with a new session.
   */
  const handleRetry = useCallback(async () => {
    setState("completing");
    setError(null);
    answersRef.current = [];
    setLocalScore(0);

    try {
      const response = await startQuizAction(session.moduleId);

      if (!response.success) {
        throw new Error(response.error);
      }

      setSession(response.data);
      setCurrentIndex(0);
      setFeedback(null);
      setResult(null);
      startTimeRef.current = Date.now();
      setState("playing");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al reiniciar quiz"
      );
      setState("error");
    }
  }, [session.moduleId]);

  // Error state
  if (state === "error") {
    return (
      <div className="flex flex-col items-center p-6 text-center">
        <div className="manga-panel manga-shadow p-6">
          <p className="mb-4 text-xl font-bold text-destructive">Error</p>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <button
            onClick={handleRetry}
            className="manga-btn bg-foreground px-6 py-2 font-bold text-background"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // Completing state (submitting answers to server)
  if (state === "completing") {
    return (
      <div className="flex flex-col items-center p-6 text-center">
        <div className="manga-panel p-8">
          <div className="mb-4 flex justify-center">
            <div className="h-10 w-10 animate-spin border-4 border-foreground border-t-transparent" />
          </div>
          <p className="font-bold">Guardando resultados...</p>
        </div>
      </div>
    );
  }

  // Completed state
  if (state === "completed" && result) {
    return (
      <QuizResult
        result={result}
        moduleName={session.moduleName}
        onRetry={handleRetry}
      />
    );
  }

  // Playing/feedback states
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <QuizProgress
        current={currentIndex + 1}
        total={session.totalItems}
        score={localScore}
      />

      {currentQuestion && (
        <QuizQuestion
          key={currentIndex}
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={state !== "playing"}
          showFeedback={feedback}
        />
      )}
    </div>
  );
}
