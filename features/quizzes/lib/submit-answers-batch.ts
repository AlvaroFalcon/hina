import { prisma } from "@/lib/prisma";

/**
 * A single answer to submit in a batch.
 */
export interface BatchAnswer {
  characterId: string;
  userAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
}

/**
 * Result of batch answer submission.
 */
export interface BatchSubmitResult {
  score: number;
  totalItems: number;
}

/**
 * Submits all quiz answers in a single batch operation.
 * This is more efficient and avoids race conditions with individual submissions.
 * @param userId - The authenticated user's ID
 * @param sessionId - The quiz session ID
 * @param answers - Array of answers to submit
 * @returns Batch submission result with final score
 * @throws Error if session not found or already completed
 */
export async function submitAnswersBatch(
  userId: string,
  sessionId: string,
  answers: BatchAnswer[]
): Promise<BatchSubmitResult> {
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

  // Check if any answers already exist for this session
  const existingAnswers = await prisma.quizAnswer.count({
    where: { sessionId },
  });

  if (existingAnswers > 0) {
    throw new Error("Answers already submitted for this session");
  }

  // Calculate score from provided answers
  const score = answers.filter((a) => a.isCorrect).length;

  // Use transaction to ensure all operations succeed together
  await prisma.$transaction(async (tx) => {
    // Create all quiz answers at once
    await tx.quizAnswer.createMany({
      data: answers.map((answer) => ({
        sessionId,
        characterId: answer.characterId,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
        responseTimeMs: answer.responseTimeMs,
      })),
    });

    // Update session score
    await tx.quizSession.update({
      where: { id: sessionId },
      data: { score },
    });

    // Update user character stats for each answer
    for (const answer of answers) {
      const existingStats = await tx.userCharacterStats.findUnique({
        where: {
          userId_characterId: {
            userId,
            characterId: answer.characterId,
          },
        },
      });

      if (existingStats) {
        await tx.userCharacterStats.update({
          where: {
            userId_characterId: {
              userId,
              characterId: answer.characterId,
            },
          },
          data: {
            totalAttempts: { increment: 1 },
            correctCount: answer.isCorrect ? { increment: 1 } : undefined,
            streakCount: answer.isCorrect
              ? { increment: 1 }
              : 0,
            lastAttemptAt: new Date(),
          },
        });
      } else {
        await tx.userCharacterStats.create({
          data: {
            userId,
            characterId: answer.characterId,
            totalAttempts: 1,
            correctCount: answer.isCorrect ? 1 : 0,
            streakCount: answer.isCorrect ? 1 : 0,
            lastAttemptAt: new Date(),
          },
        });
      }
    }
  });

  return {
    score,
    totalItems: answers.length,
  };
}
