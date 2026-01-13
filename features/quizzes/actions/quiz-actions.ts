"use server";

import { getUser } from "@/features/auth/lib/get-user";
import {
  startQuiz as startQuizLib,
  getActiveQuizSession as getActiveQuizSessionLib,
} from "../lib/start-quiz";
import {
  submitAnswer as submitAnswerLib,
  getQuizProgress as getQuizProgressLib,
} from "../lib/submit-answer";
import {
  submitAnswersBatch as submitAnswersBatchLib,
  type BatchAnswer,
  type BatchSubmitResult,
} from "../lib/submit-answers-batch";
import {
  completeQuiz as completeQuizLib,
  abandonQuiz as abandonQuizLib,
  getQuizResult as getQuizResultLib,
} from "../lib/complete-quiz";
import type {
  QuizSession,
  AnswerResult,
  QuizResult,
  QuizConfig,
} from "../types";

/**
 * Server action result type for consistent error handling.
 */
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Starts a new quiz session for the authenticated user.
 * @param moduleId - The module to quiz on
 * @param config - Optional quiz configuration
 * @returns Quiz session with questions or error
 */
export async function startQuizAction(
  moduleId: string,
  config?: Partial<QuizConfig>
): Promise<ActionResult<QuizSession>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const session = await startQuizLib(user.id, moduleId, config as QuizConfig);

    return { success: true, data: session };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start quiz";
    return { success: false, error: message };
  }
}

/**
 * Gets an active (incomplete) quiz session for the authenticated user.
 * @param sessionId - The quiz session ID
 * @returns Quiz session if found and incomplete, or error
 */
export async function getActiveQuizAction(
  sessionId: string
): Promise<ActionResult<QuizSession | null>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const session = await getActiveQuizSessionLib(user.id, sessionId);

    return { success: true, data: session };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get quiz session";
    return { success: false, error: message };
  }
}

/**
 * Submits an answer for a quiz question.
 * @param sessionId - The quiz session ID
 * @param characterId - The character being answered
 * @param userAnswer - The user's answer
 * @param responseTimeMs - Optional time taken to answer
 * @returns Answer result with correctness and stats
 */
export async function submitAnswerAction(
  sessionId: string,
  characterId: string,
  userAnswer: string,
  responseTimeMs?: number
): Promise<ActionResult<AnswerResult>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await submitAnswerLib(
      user.id,
      sessionId,
      characterId,
      userAnswer,
      responseTimeMs
    );

    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit answer";
    return { success: false, error: message };
  }
}

/**
 * Gets the current progress of a quiz session.
 * @param sessionId - The quiz session ID
 * @returns Current score and progress
 */
export async function getQuizProgressAction(
  sessionId: string
): Promise<ActionResult<{ score: number; answered: number; totalItems: number }>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const progress = await getQuizProgressLib(sessionId);

    return { success: true, data: progress };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get quiz progress";
    return { success: false, error: message };
  }
}

/**
 * Completes a quiz session and updates user progress.
 * @param sessionId - The quiz session ID
 * @returns Final quiz result with score and progress updates
 */
export async function completeQuizAction(
  sessionId: string
): Promise<ActionResult<QuizResult>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await completeQuizLib(user.id, sessionId);

    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete quiz";
    return { success: false, error: message };
  }
}

/**
 * Abandons an incomplete quiz session.
 * @param sessionId - The quiz session ID
 * @returns Success or error
 */
export async function abandonQuizAction(
  sessionId: string
): Promise<ActionResult<void>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    await abandonQuizLib(user.id, sessionId);

    return { success: true, data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to abandon quiz";
    return { success: false, error: message };
  }
}

/**
 * Gets the result of a completed quiz session.
 * @param sessionId - The quiz session ID
 * @returns Quiz result or null if not found
 */
export async function getQuizResultAction(
  sessionId: string
): Promise<ActionResult<QuizResult | null>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await getQuizResultLib(user.id, sessionId);

    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get quiz result";
    return { success: false, error: message };
  }
}

/**
 * Submits all quiz answers in a single batch operation.
 * More efficient and avoids race conditions with individual submissions.
 * @param sessionId - The quiz session ID
 * @param answers - Array of answers to submit
 * @returns Batch submission result with final score
 */
export async function submitAnswersBatchAction(
  sessionId: string,
  answers: BatchAnswer[]
): Promise<ActionResult<BatchSubmitResult>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await submitAnswersBatchLib(user.id, sessionId, answers);

    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit answers";
    return { success: false, error: message };
  }
}
