"use server";

import { getUser } from "@/features/auth/lib/get-user";
import {
  getModuleQuizStats,
  getOverallQuizStats,
  getQuizHistory,
  getCharactersNeedingPractice,
} from "../lib/get-quiz-stats";
import type { ModuleQuizStats, CharacterStats } from "../types";

/**
 * Server action result type for consistent error handling.
 */
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Gets detailed quiz statistics for a specific module.
 * @param moduleId - The module ID
 * @returns Module statistics with character-level data
 */
export async function getModuleStatsAction(
  moduleId: string
): Promise<ActionResult<ModuleQuizStats>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const stats = await getModuleQuizStats(user.id, moduleId);

    return { success: true, data: stats };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get module stats";
    return { success: false, error: message };
  }
}

/**
 * Gets overall quiz statistics across all modules.
 * @returns Summary statistics for the user
 */
export async function getOverallStatsAction(): Promise<
  ActionResult<{
    totalQuizzes: number;
    totalCorrectAnswers: number;
    totalAnswers: number;
    overallAccuracy: number;
    totalTimeSpentMs: number;
    masteredCharacters: number;
    totalCharactersAttempted: number;
  }>
> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const stats = await getOverallQuizStats(user.id);

    return { success: true, data: stats };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get overall stats";
    return { success: false, error: message };
  }
}

/**
 * Gets the user's quiz history for a module.
 * @param moduleId - The module ID
 * @param limit - Maximum number of sessions to return
 * @returns Array of past quiz sessions
 */
export async function getQuizHistoryAction(
  moduleId: string,
  limit: number = 10
): Promise<
  ActionResult<
    Array<{
      sessionId: string;
      score: number;
      totalItems: number;
      percentage: number;
      completedAt: Date;
      timeSpentMs: number;
    }>
  >
> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const history = await getQuizHistory(user.id, moduleId, limit);

    return { success: true, data: history };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get quiz history";
    return { success: false, error: message };
  }
}

/**
 * Gets characters that need more practice.
 * @param moduleId - Optional module ID to filter by
 * @param limit - Maximum characters to return
 * @returns Characters sorted by need for practice
 */
export async function getWeakCharactersAction(
  moduleId?: string,
  limit: number = 10
): Promise<ActionResult<CharacterStats[]>> {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const characters = await getCharactersNeedingPractice(user.id, moduleId, limit);

    return { success: true, data: characters };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get weak characters";
    return { success: false, error: message };
  }
}
