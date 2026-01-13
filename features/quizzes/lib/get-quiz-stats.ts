import { prisma } from "@/lib/prisma";
import type { CharacterStats, ModuleQuizStats } from "../types";

/** Accuracy threshold to consider a character weak */
const WEAK_THRESHOLD = 0.6;

/** Accuracy threshold to consider a character strong */
const STRONG_THRESHOLD = 0.85;

/**
 * Gets detailed quiz statistics for a user in a specific module.
 * @param userId - The authenticated user's ID
 * @param moduleId - The module ID
 * @returns Module quiz statistics including character-level stats
 * @throws Error if module not found
 */
export async function getModuleQuizStats(
  userId: string,
  moduleId: string
): Promise<ModuleQuizStats> {
  // Get module with characters
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      moduleCharacters: {
        orderBy: { order: "asc" },
        include: { character: true },
      },
    },
  });

  if (!module) {
    throw new Error("Module not found");
  }

  // Get completed quiz sessions for this module
  const sessions = await prisma.quizSession.findMany({
    where: {
      userId,
      moduleId,
      completedAt: { not: null },
    },
    orderBy: { completedAt: "desc" },
  });

  // Get user stats for all characters in this module
  const characterIds = module.moduleCharacters.map((mc) => mc.character.id);
  const userStats = await prisma.userCharacterStats.findMany({
    where: {
      userId,
      characterId: { in: characterIds },
    },
  });

  // Build stats map
  const statsMap = new Map(userStats.map((s) => [s.characterId, s]));

  // Build character stats array
  const characterStats: CharacterStats[] = module.moduleCharacters.map((mc) => {
    const stats = statsMap.get(mc.character.id);
    const totalAttempts = stats?.totalAttempts ?? 0;
    const correctCount = stats?.correctCount ?? 0;
    const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;

    return {
      characterId: mc.character.id,
      character: mc.character.character,
      reading: mc.character.reading,
      totalAttempts,
      correctCount,
      accuracy,
      streakCount: stats?.streakCount ?? 0,
      lastAttemptAt: stats?.lastAttemptAt ?? null,
    };
  });

  // Categorize characters
  const weakCharacters = characterStats
    .filter((c) => c.totalAttempts > 0 && c.accuracy < WEAK_THRESHOLD)
    .sort((a, b) => a.accuracy - b.accuracy);

  const strongCharacters = characterStats
    .filter((c) => c.totalAttempts >= 3 && c.accuracy >= STRONG_THRESHOLD)
    .sort((a, b) => b.accuracy - a.accuracy);

  // Calculate aggregate stats
  const totalSessions = sessions.length;
  const scores = sessions.map((s) => (s.score / s.totalItems) * 100);
  const averageScore =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const totalTimeSpentMs = sessions.reduce((total, session) => {
    if (session.completedAt) {
      return total + (session.completedAt.getTime() - session.startedAt.getTime());
    }
    return total;
  }, 0);

  return {
    moduleId: module.id,
    moduleName: module.name,
    totalSessions,
    averageScore,
    bestScore,
    totalTimeSpentMs,
    characterStats,
    weakCharacters,
    strongCharacters,
  };
}

/**
 * Gets overall quiz statistics for a user across all modules.
 * @param userId - The authenticated user's ID
 * @returns Summary statistics
 */
export async function getOverallQuizStats(userId: string): Promise<{
  totalQuizzes: number;
  totalCorrectAnswers: number;
  totalAnswers: number;
  overallAccuracy: number;
  totalTimeSpentMs: number;
  masteredCharacters: number;
  totalCharactersAttempted: number;
}> {
  // Get all completed sessions
  const sessions = await prisma.quizSession.findMany({
    where: {
      userId,
      completedAt: { not: null },
    },
  });

  // Get all user character stats
  const allStats = await prisma.userCharacterStats.findMany({
    where: { userId },
  });

  const totalQuizzes = sessions.length;
  const totalCorrectAnswers = sessions.reduce((sum, s) => sum + s.score, 0);
  const totalAnswers = sessions.reduce((sum, s) => sum + s.totalItems, 0);
  const overallAccuracy = totalAnswers > 0 ? totalCorrectAnswers / totalAnswers : 0;

  const totalTimeSpentMs = sessions.reduce((total, session) => {
    if (session.completedAt) {
      return total + (session.completedAt.getTime() - session.startedAt.getTime());
    }
    return total;
  }, 0);

  const masteredCharacters = allStats.filter(
    (s) => s.totalAttempts >= 5 && s.correctCount / s.totalAttempts >= 0.85
  ).length;

  return {
    totalQuizzes,
    totalCorrectAnswers,
    totalAnswers,
    overallAccuracy,
    totalTimeSpentMs,
    masteredCharacters,
    totalCharactersAttempted: allStats.length,
  };
}

/**
 * Gets the user's quiz history for a module.
 * @param userId - The authenticated user's ID
 * @param moduleId - The module ID
 * @param limit - Maximum number of sessions to return
 * @returns Array of past quiz sessions
 */
export async function getQuizHistory(
  userId: string,
  moduleId: string,
  limit: number = 10
): Promise<
  Array<{
    sessionId: string;
    score: number;
    totalItems: number;
    percentage: number;
    completedAt: Date;
    timeSpentMs: number;
  }>
> {
  const sessions = await prisma.quizSession.findMany({
    where: {
      userId,
      moduleId,
      completedAt: { not: null },
    },
    orderBy: { completedAt: "desc" },
    take: limit,
  });

  return sessions.map((session) => ({
    sessionId: session.id,
    score: session.score,
    totalItems: session.totalItems,
    percentage: (session.score / session.totalItems) * 100,
    completedAt: session.completedAt!,
    timeSpentMs: session.completedAt!.getTime() - session.startedAt.getTime(),
  }));
}

/**
 * Gets characters that need more practice based on user performance.
 * @param userId - The authenticated user's ID
 * @param moduleId - Optional module ID to filter by
 * @param limit - Maximum characters to return
 * @returns Characters sorted by need for practice
 */
export async function getCharactersNeedingPractice(
  userId: string,
  moduleId?: string,
  limit: number = 10
): Promise<CharacterStats[]> {
  // Build character filter
  let characterIds: string[] | undefined;

  if (moduleId) {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        moduleCharacters: {
          select: { characterId: true },
        },
      },
    });

    if (module) {
      characterIds = module.moduleCharacters.map((mc) => mc.characterId);
    }
  }

  // Get user stats
  const stats = await prisma.userCharacterStats.findMany({
    where: {
      userId,
      ...(characterIds && { characterId: { in: characterIds } }),
    },
    include: {
      character: true,
    },
    orderBy: [
      { correctCount: "asc" },
      { totalAttempts: "desc" },
    ],
    take: limit,
  });

  // Filter to only weak characters and sort by accuracy
  return stats
    .map((s) => ({
      characterId: s.characterId,
      character: s.character.character,
      reading: s.character.reading,
      totalAttempts: s.totalAttempts,
      correctCount: s.correctCount,
      accuracy: s.totalAttempts > 0 ? s.correctCount / s.totalAttempts : 0,
      streakCount: s.streakCount,
      lastAttemptAt: s.lastAttemptAt,
    }))
    .filter((s) => s.accuracy < WEAK_THRESHOLD || s.totalAttempts < 3)
    .sort((a, b) => a.accuracy - b.accuracy);
}
