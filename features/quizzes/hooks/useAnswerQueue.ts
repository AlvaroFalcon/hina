"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { submitAnswerAction } from "../actions/quiz-actions";

/**
 * Pending answer waiting to be synced with server.
 */
export interface PendingAnswer {
  id: string;
  sessionId: string;
  characterId: string;
  userAnswer: string;
  responseTimeMs: number;
  isCorrect: boolean;
  timestamp: number;
  retryCount: number;
  status: "pending" | "syncing" | "synced" | "failed";
}

/**
 * Result of local answer verification.
 */
export interface LocalAnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
}

/**
 * Queue state for external consumption.
 */
export interface QueueState {
  pending: number;
  syncing: number;
  failed: number;
  allSynced: boolean;
}

const STORAGE_KEY = "hina_quiz_pending_answers";
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 5000]; // Exponential backoff

/**
 * Generates a unique ID for pending answers.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Loads pending answers from localStorage.
 */
function loadFromStorage(): PendingAnswer[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const answers: PendingAnswer[] = JSON.parse(stored);
    // Filter out answers older than 24 hours
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return answers.filter((a) => a.timestamp > cutoff);
  } catch {
    return [];
  }
}

/**
 * Saves pending answers to localStorage.
 */
function saveToStorage(answers: PendingAnswer[]): void {
  if (typeof window === "undefined") return;

  try {
    // Only save non-synced answers
    const toSave = answers.filter((a) => a.status !== "synced");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Storage full or unavailable, continue without persistence
  }
}

/**
 * Clears answers for a specific session from storage.
 */
function clearSessionFromStorage(sessionId: string): void {
  if (typeof window === "undefined") return;

  try {
    const stored = loadFromStorage();
    const filtered = stored.filter((a) => a.sessionId !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Ignore errors
  }
}

/**
 * Hook for managing quiz answer queue with optimistic updates.
 * Provides instant local feedback while syncing with server in background.
 *
 * @param sessionId - Current quiz session ID
 * @returns Queue management functions and state
 */
export function useAnswerQueue(sessionId: string) {
  const [answers, setAnswers] = useState<PendingAnswer[]>([]);
  const [localScore, setLocalScore] = useState(0);

  // Use refs to always have access to current values in callbacks
  const answersRef = useRef<PendingAnswer[]>([]);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);

  // Keep ref in sync with state
  useEffect(() => {
    answersRef.current = answers;
    saveToStorage(answers);
  }, [answers]);

  // Load pending answers for this session on mount
  useEffect(() => {
    const stored = loadFromStorage();
    const sessionAnswers = stored.filter((a) => a.sessionId === sessionId);
    if (sessionAnswers.length > 0) {
      setAnswers(sessionAnswers);
      answersRef.current = sessionAnswers;
      setLocalScore(sessionAnswers.filter((a) => a.isCorrect).length);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [sessionId]);

  /**
   * Process the queue - sync pending answers with server.
   */
  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      // Use ref to get current answers
      const currentAnswers = answersRef.current;
      const pendingAnswers = currentAnswers.filter(
        (a) => a.status === "pending" || (a.status === "failed" && a.retryCount < MAX_RETRIES)
      );

      for (const answer of pendingAnswers) {
        if (!mountedRef.current) break;

        // Mark as syncing
        setAnswers((prev) => {
          const updated = prev.map((a) =>
            a.id === answer.id ? { ...a, status: "syncing" as const } : a
          );
          answersRef.current = updated;
          return updated;
        });

        try {
          const result = await submitAnswerAction(
            answer.sessionId,
            answer.characterId,
            answer.userAnswer,
            answer.responseTimeMs
          );

          if (!mountedRef.current) break;

          if (result.success) {
            // Mark as synced
            setAnswers((prev) => {
              const updated = prev.map((a) =>
                a.id === answer.id ? { ...a, status: "synced" as const } : a
              );
              answersRef.current = updated;
              return updated;
            });
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          if (!mountedRef.current) break;

          // Mark as failed and increment retry count
          setAnswers((prev) => {
            const updated = prev.map((a) =>
              a.id === answer.id
                ? {
                    ...a,
                    status: "failed" as const,
                    retryCount: a.retryCount + 1,
                  }
                : a
            );
            answersRef.current = updated;
            return updated;
          });

          // Schedule retry with backoff
          const delay = RETRY_DELAYS[Math.min(answer.retryCount, RETRY_DELAYS.length - 1)];
          setTimeout(() => {
            if (mountedRef.current) {
              processingRef.current = false; // Allow retry processing
              processQueue();
            }
          }, delay);
        }
      }
    } finally {
      processingRef.current = false;
    }
  }, []);

  /**
   * Submit an answer with optimistic local update.
   * Returns immediate local result while syncing in background.
   */
  const submitAnswer = useCallback(
    (
      characterId: string,
      userAnswer: string,
      correctAnswer: string,
      responseTimeMs: number
    ): LocalAnswerResult => {
      const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

      // Create pending answer
      const pendingAnswer: PendingAnswer = {
        id: generateId(),
        sessionId,
        characterId,
        userAnswer,
        responseTimeMs,
        isCorrect,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending",
      };

      // Add to queue (update both state and ref)
      setAnswers((prev) => {
        const updated = [...prev, pendingAnswer];
        answersRef.current = updated;
        return updated;
      });

      // Update local score
      if (isCorrect) {
        setLocalScore((prev) => prev + 1);
      }

      // Start processing queue after state update
      setTimeout(() => {
        processQueue();
      }, 10);

      return {
        isCorrect,
        correctAnswer,
      };
    },
    [sessionId, processQueue]
  );

  /**
   * Wait for all answers to be synced.
   * Returns true if all synced, false if some failed after max retries.
   */
  const waitForSync = useCallback(async (): Promise<boolean> => {
    const maxWaitTime = 10000; // 10 seconds max
    const startTime = Date.now();

    // Trigger processing
    processQueue();

    return new Promise((resolve) => {
      const checkSync = () => {
        // Use ref to get current answers
        const current = answersRef.current;
        const pending = current.filter(
          (a) => a.status === "pending" || a.status === "syncing"
        );
        const failed = current.filter(
          (a) => a.status === "failed" && a.retryCount >= MAX_RETRIES
        );

        if (pending.length === 0) {
          resolve(failed.length === 0);
          return;
        }

        if (Date.now() - startTime > maxWaitTime) {
          // Timeout - resolve with false
          resolve(false);
          return;
        }

        setTimeout(checkSync, 100);
      };

      checkSync();
    });
  }, [processQueue]);

  /**
   * Get current queue state.
   */
  const getQueueState = useCallback((): QueueState => {
    // Use ref for most current state
    const current = answersRef.current;
    const pending = current.filter((a) => a.status === "pending").length;
    const syncing = current.filter((a) => a.status === "syncing").length;
    const failed = current.filter(
      (a) => a.status === "failed" && a.retryCount >= MAX_RETRIES
    ).length;

    return {
      pending,
      syncing,
      failed,
      allSynced: pending === 0 && syncing === 0,
    };
  }, []);

  /**
   * Clear the queue for this session (call after quiz completion).
   */
  const clearQueue = useCallback(() => {
    setAnswers([]);
    answersRef.current = [];
    setLocalScore(0);
    clearSessionFromStorage(sessionId);
  }, [sessionId]);

  /**
   * Check if a character has already been answered.
   */
  const hasAnswered = useCallback(
    (characterId: string): boolean => {
      return answersRef.current.some((a) => a.characterId === characterId);
    },
    []
  );

  return {
    submitAnswer,
    waitForSync,
    getQueueState,
    clearQueue,
    hasAnswered,
    localScore,
    answeredCount: answers.length,
  };
}
