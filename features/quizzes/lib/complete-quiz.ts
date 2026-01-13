import { prisma } from "@/lib/prisma";
import type { QuizResult } from "../types";

/** Minimum percentage required to unlock the next module */
const UNLOCK_THRESHOLD = 80;

/** Minimum percentage to consider a module completed */
const COMPLETION_THRESHOLD = 100;

/**
 * Calculates the new module progress based on quiz performance.
 * Uses a weighted average that favors improvement.
 * @param currentProgress - Current module progress percentage
 * @param quizPercentage - Quiz score percentage
 * @param sessionCount - Number of quiz sessions for this module
 * @returns New progress percentage
 */
function calculateNewProgress(
  currentProgress: number,
  quizPercentage: number,
  sessionCount: number
): number {
  if (sessionCount <= 1) {
    // First quiz - use quiz result directly
    return quizPercentage;
  }

  // Weighted average: new quizzes have more weight to allow progress
  // but we don't let progress drop too much from a bad quiz
  const weight = 0.4; // 40% weight for new quiz
  const newProgress = currentProgress * (1 - weight) + quizPercentage * weight;

  // Don't let progress drop more than 10% from a single bad quiz
  const minProgress = Math.max(0, currentProgress - 10);

  return Math.max(minProgress, Math.min(100, newProgress));
}

/**
 * Completes a quiz session and updates user progress.
 * @param userId - The authenticated user's ID
 * @param sessionId - The quiz session ID
 * @returns Quiz result with final score and progress updates
 * @throws Error if session not found, doesn't belong to user, or already completed
 */
export async function completeQuiz(
  userId: string,
  sessionId: string
): Promise<QuizResult> {
  // Get session with answers
  const session = await prisma.quizSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    include: {
      answers: true,
      module: true,
    },
  });

  if (!session) {
    throw new Error("Quiz session not found");
  }

  if (session.completedAt) {
    throw new Error("Quiz session already completed");
  }

  // Calculate time spent
  const timeSpentMs = Date.now() - session.startedAt.getTime();
  const percentage = (session.score / session.totalItems) * 100;

  // Get current user progress and session count for this module
  const [currentProgress, sessionCount] = await Promise.all([
    prisma.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId: session.moduleId,
        },
      },
    }),
    prisma.quizSession.count({
      where: {
        userId,
        moduleId: session.moduleId,
        completedAt: { not: null },
      },
    }),
  ]);

  const oldProgress = currentProgress?.percentage ?? 0;
  const newProgress = calculateNewProgress(
    oldProgress,
    percentage,
    sessionCount + 1
  );

  // Check if this will unlock the next module
  const wasAboveThreshold = oldProgress >= UNLOCK_THRESHOLD;
  const isAboveThreshold = newProgress >= UNLOCK_THRESHOLD;
  const unlockedNextModule = !wasAboveThreshold && isAboveThreshold;

  // Check if module is now completed
  const wasCompleted = oldProgress >= COMPLETION_THRESHOLD;
  const isModuleCompleted = newProgress >= COMPLETION_THRESHOLD;

  // Use transaction to update everything atomically
  await prisma.$transaction(async (tx) => {
    // Mark session as completed
    await tx.quizSession.update({
      where: { id: sessionId },
      data: { completedAt: new Date() },
    });

    // Update or create user progress
    await tx.userProgress.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId: session.moduleId,
        },
      },
      update: {
        percentage: newProgress,
      },
      create: {
        userId,
        moduleId: session.moduleId,
        percentage: newProgress,
      },
    });
  });

  return {
    sessionId,
    score: session.score,
    totalItems: session.totalItems,
    percentage,
    timeSpentMs,
    moduleProgressUpdated: newProgress !== oldProgress,
    newModuleProgress: newProgress,
    isModuleCompleted: isModuleCompleted && !wasCompleted,
    unlockedNextModule,
  };
}

/**
 * Abandons an incomplete quiz session.
 * @param userId - The authenticated user's ID
 * @param sessionId - The quiz session ID
 * @throws Error if session not found or doesn't belong to user
 */
export async function abandonQuiz(
  userId: string,
  sessionId: string
): Promise<void> {
  const session = await prisma.quizSession.findFirst({
    where: {
      id: sessionId,
      userId,
      completedAt: null,
    },
  });

  if (!session) {
    throw new Error("Quiz session not found or already completed");
  }

  // Delete the session and its answers (cascade)
  await prisma.quizSession.delete({
    where: { id: sessionId },
  });
}

/**
 * Gets the result of a completed quiz session.
 * @param userId - The authenticated user's ID
 * @param sessionId - The quiz session ID
 * @returns Quiz result or null if not found/not completed
 */
export async function getQuizResult(
  userId: string,
  sessionId: string
): Promise<QuizResult | null> {
  const session = await prisma.quizSession.findFirst({
    where: {
      id: sessionId,
      userId,
      completedAt: { not: null },
    },
  });

  if (!session || !session.completedAt) {
    return null;
  }

  const userProgress = await prisma.userProgress.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId: session.moduleId,
      },
    },
  });

  const timeSpentMs = session.completedAt.getTime() - session.startedAt.getTime();
  const percentage = (session.score / session.totalItems) * 100;

  return {
    sessionId,
    score: session.score,
    totalItems: session.totalItems,
    percentage,
    timeSpentMs,
    moduleProgressUpdated: true,
    newModuleProgress: userProgress?.percentage ?? percentage,
    isModuleCompleted: (userProgress?.percentage ?? 0) >= COMPLETION_THRESHOLD,
    unlockedNextModule: false, // Can't determine retrospectively
  };
}
