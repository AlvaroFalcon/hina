import { prisma } from "@/lib/prisma";
import type {
  QuizSession,
  QuizQuestion,
  QuizCharacter,
  QuizConfig,
} from "../types";
import { DEFAULT_QUIZ_CONFIG } from "../types";

/**
 * Represents a character with its weight for selection.
 */
interface WeightedCharacter {
  character: QuizCharacter;
  weight: number;
  accuracy: number;
}

/**
 * Shuffles an array using Fisher-Yates algorithm.
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selects a random item from array based on weights.
 * @param items - Array of items with weights
 * @returns Selected item
 */
function weightedRandomSelect<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

/**
 * Generates wrong answer options for a question.
 * @param correctReading - The correct answer to exclude
 * @param allReadings - All possible readings to choose from
 * @param count - Number of wrong options to generate
 * @returns Array of wrong answer options
 */
function generateWrongOptions(
  correctReading: string,
  allReadings: string[],
  count: number
): string[] {
  const available = allReadings.filter((r) => r !== correctReading);
  const shuffled = shuffleArray(available);
  return shuffled.slice(0, count);
}

/**
 * Calculates character weights based on user performance.
 * Characters with lower accuracy get higher weights (more likely to appear).
 * @param characters - Module characters
 * @param userStats - User's stats for these characters
 * @param config - Quiz configuration
 * @returns Characters with calculated weights
 */
function calculateCharacterWeights(
  characters: QuizCharacter[],
  userStats: Map<string, { totalAttempts: number; correctCount: number }>,
  config: QuizConfig
): WeightedCharacter[] {
  return characters.map((character) => {
    const stats = userStats.get(character.id);

    if (!stats || stats.totalAttempts === 0) {
      // New character - give it medium-high weight to introduce it
      return { character, weight: 2, accuracy: 0 };
    }

    const accuracy = stats.correctCount / stats.totalAttempts;

    // Characters with low accuracy get higher weight
    // Weight formula: (1 - accuracy) * weakCharacterWeight + base weight
    const weight =
      (1 - accuracy) * config.weakCharacterWeight + 1;

    return { character, weight, accuracy };
  });
}

/**
 * Selects characters for the quiz using adaptive algorithm.
 * Prioritizes characters the user struggles with.
 * @param weightedCharacters - Characters with weights
 * @param count - Number of characters to select
 * @returns Selected characters for the quiz
 */
function selectAdaptiveCharacters(
  weightedCharacters: WeightedCharacter[],
  count: number
): QuizCharacter[] {
  const selected: QuizCharacter[] = [];
  const available = [...weightedCharacters];

  while (selected.length < count && available.length > 0) {
    const chosen = weightedRandomSelect(available);
    selected.push(chosen.character);

    // Remove selected character from available pool
    const index = available.indexOf(chosen);
    available.splice(index, 1);
  }

  return selected;
}

/**
 * Builds quiz questions from selected characters.
 * @param selectedCharacters - Characters to create questions for
 * @param allReadings - All possible readings for generating options
 * @param optionsCount - Number of options per question
 * @returns Array of quiz questions
 */
function buildQuestions(
  selectedCharacters: QuizCharacter[],
  allReadings: string[],
  optionsCount: number
): QuizQuestion[] {
  return selectedCharacters.map((character) => {
    const wrongOptions = generateWrongOptions(
      character.reading,
      allReadings,
      optionsCount - 1
    );

    const options = shuffleArray([character.reading, ...wrongOptions]);

    return {
      character,
      options,
      correctAnswer: character.reading,
    };
  });
}

/**
 * Starts a new quiz session for a user in a specific module.
 * Uses adaptive algorithm to prioritize weak characters.
 * @param userId - The authenticated user's ID
 * @param moduleId - The module to quiz on
 * @param config - Optional quiz configuration
 * @returns Quiz session with questions
 * @throws Error if module not found or has no characters
 */
export async function startQuiz(
  userId: string,
  moduleId: string,
  config: QuizConfig = DEFAULT_QUIZ_CONFIG
): Promise<QuizSession> {
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

  if (module.moduleCharacters.length === 0) {
    throw new Error("Module has no characters");
  }

  // Get user's stats for characters in this module
  const characterIds = module.moduleCharacters.map((mc) => mc.character.id);
  const userStats = await prisma.userCharacterStats.findMany({
    where: {
      userId,
      characterId: { in: characterIds },
    },
  });

  // Build stats map for quick lookup
  const statsMap = new Map(
    userStats.map((s) => [
      s.characterId,
      { totalAttempts: s.totalAttempts, correctCount: s.correctCount },
    ])
  );

  // Prepare characters
  const characters: QuizCharacter[] = module.moduleCharacters.map((mc) => ({
    id: mc.character.id,
    character: mc.character.character,
    reading: mc.character.reading,
    type: mc.character.type,
  }));

  // Calculate weights and select characters adaptively
  const weightedCharacters = calculateCharacterWeights(
    characters,
    statsMap,
    config
  );

  const questionCount = Math.min(config.questionCount, characters.length);
  const selectedCharacters = selectAdaptiveCharacters(
    weightedCharacters,
    questionCount
  );

  // Get all unique readings for generating options
  const allReadings = [...new Set(characters.map((c) => c.reading))];

  // Build questions
  const questions = buildQuestions(
    selectedCharacters,
    allReadings,
    config.optionsCount
  );

  // Create quiz session in database
  const session = await prisma.quizSession.create({
    data: {
      userId,
      moduleId,
      totalItems: questions.length,
    },
  });

  return {
    id: session.id,
    moduleId: module.id,
    moduleName: module.name,
    questions: shuffleArray(questions),
    totalItems: questions.length,
    startedAt: session.startedAt,
  };
}

/**
 * Gets an existing incomplete quiz session for a user.
 * @param userId - The authenticated user's ID
 * @param sessionId - The quiz session ID
 * @returns Quiz session if found and incomplete, null otherwise
 */
export async function getActiveQuizSession(
  userId: string,
  sessionId: string
): Promise<QuizSession | null> {
  const session = await prisma.quizSession.findFirst({
    where: {
      id: sessionId,
      userId,
      completedAt: null,
    },
    include: {
      module: {
        include: {
          moduleCharacters: {
            orderBy: { order: "asc" },
            include: { character: true },
          },
        },
      },
      answers: true,
    },
  });

  if (!session) {
    return null;
  }

  // Get answered character IDs
  const answeredIds = new Set(session.answers.map((a) => a.characterId));

  // Build remaining questions
  const characters: QuizCharacter[] = session.module.moduleCharacters
    .filter((mc) => !answeredIds.has(mc.character.id))
    .map((mc) => ({
      id: mc.character.id,
      character: mc.character.character,
      reading: mc.character.reading,
      type: mc.character.type,
    }));

  const allReadings = session.module.moduleCharacters.map(
    (mc) => mc.character.reading
  );

  const questions = buildQuestions(characters, allReadings, 4);

  return {
    id: session.id,
    moduleId: session.moduleId,
    moduleName: session.module.name,
    questions,
    totalItems: session.totalItems,
    startedAt: session.startedAt,
  };
}
