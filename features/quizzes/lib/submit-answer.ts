import { prisma } from "@/lib/prisma";
import type { AnswerResult } from "../types";

/**
 * Submits an answer for a quiz question.
 * Updates the quiz session and user character statistics.
 * @param userId - The authenticated user's ID
 * @param sessionId - The quiz session ID
 * @param characterId - The character being answered
 * @param userAnswer - The user's answer
 * @param responseTimeMs - Time taken to answer in milliseconds
 * @returns Answer result with correctness and updated stats
 * @throws Error if session not found, already completed, or character already answered
 */
export async function submitAnswer(
  userId: string,
  sessionId: string,
  characterId: string,
  userAnswer: string,
  responseTimeMs?: number
): Promise<AnswerResult> {
  // Verify session exists and belongs to user
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

  // Check if this character was already answered in this session
  const existingAnswer = await prisma.quizAnswer.findFirst({
    where: {
      sessionId,
      characterId,
    },
  });

  if (existingAnswer) {
    throw new Error("Character already answered in this session");
  }

  // Get the character to verify the answer
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error("Character not found");
  }

  const isCorrect = userAnswer.toLowerCase() === character.reading.toLowerCase();

  // Use transaction to ensure data consistency
  const result = await prisma.$transaction(async (tx) => {
    // Create the quiz answer
    await tx.quizAnswer.create({
      data: {
        sessionId,
        characterId,
        userAnswer,
        isCorrect,
        responseTimeMs,
      },
    });

    // Update session score if correct
    if (isCorrect) {
      await tx.quizSession.update({
        where: { id: sessionId },
        data: { score: { increment: 1 } },
      });
    }

    // Update or create user character stats
    const existingStats = await tx.userCharacterStats.findUnique({
      where: {
        userId_characterId: {
          userId,
          characterId,
        },
      },
    });

    let newStreakCount: number;
    let newTotalAttempts: number;
    let newCorrectCount: number;

    if (existingStats) {
      // Update existing stats
      newStreakCount = isCorrect ? existingStats.streakCount + 1 : 0;
      newTotalAttempts = existingStats.totalAttempts + 1;
      newCorrectCount = existingStats.correctCount + (isCorrect ? 1 : 0);

      await tx.userCharacterStats.update({
        where: {
          userId_characterId: {
            userId,
            characterId,
          },
        },
        data: {
          totalAttempts: newTotalAttempts,
          correctCount: newCorrectCount,
          streakCount: newStreakCount,
          lastAttemptAt: new Date(),
        },
      });
    } else {
      // Create new stats
      newStreakCount = isCorrect ? 1 : 0;
      newTotalAttempts = 1;
      newCorrectCount = isCorrect ? 1 : 0;

      await tx.userCharacterStats.create({
        data: {
          userId,
          characterId,
          totalAttempts: newTotalAttempts,
          correctCount: newCorrectCount,
          streakCount: newStreakCount,
          lastAttemptAt: new Date(),
        },
      });
    }

    const accuracy =
      newTotalAttempts > 0 ? newCorrectCount / newTotalAttempts : 0;

    return {
      isCorrect,
      correctAnswer: character.reading,
      streakCount: newStreakCount,
      accuracy,
    };
  });

  return result;
}

/**
 * Gets the current progress of a quiz session.
 * @param sessionId - The quiz session ID
 * @returns Current score and total answered
 */
export async function getQuizProgress(sessionId: string): Promise<{
  score: number;
  answered: number;
  totalItems: number;
}> {
  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: {
      _count: {
        select: { answers: true },
      },
    },
  });

  if (!session) {
    throw new Error("Quiz session not found");
  }

  return {
    score: session.score,
    answered: session._count.answers,
    totalItems: session.totalItems,
  };
}
