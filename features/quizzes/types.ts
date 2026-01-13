import type { CharacterType } from "@prisma/client";

/**
 * Character data for quiz questions.
 */
export interface QuizCharacter {
  id: string;
  character: string;
  reading: string;
  type: CharacterType;
}

/**
 * A quiz question with the character and possible answers.
 */
export interface QuizQuestion {
  character: QuizCharacter;
  options: string[];
  correctAnswer: string;
}

/**
 * Active quiz session with questions.
 */
export interface QuizSession {
  id: string;
  moduleId: string;
  moduleName: string;
  questions: QuizQuestion[];
  totalItems: number;
  startedAt: Date;
}

/**
 * Result of submitting an answer.
 */
export interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  streakCount: number;
  accuracy: number;
}

/**
 * Final quiz results after completion.
 */
export interface QuizResult {
  sessionId: string;
  score: number;
  totalItems: number;
  percentage: number;
  timeSpentMs: number;
  moduleProgressUpdated: boolean;
  newModuleProgress: number;
  isModuleCompleted: boolean;
  unlockedNextModule: boolean;
}

/**
 * Statistics for a single character.
 */
export interface CharacterStats {
  characterId: string;
  character: string;
  reading: string;
  totalAttempts: number;
  correctCount: number;
  accuracy: number;
  streakCount: number;
  lastAttemptAt: Date | null;
}

/**
 * Overall quiz statistics for a user in a module.
 */
export interface ModuleQuizStats {
  moduleId: string;
  moduleName: string;
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpentMs: number;
  characterStats: CharacterStats[];
  weakCharacters: CharacterStats[];
  strongCharacters: CharacterStats[];
}

/**
 * Configuration for quiz generation.
 */
export interface QuizConfig {
  /** Number of questions in the quiz */
  questionCount: number;
  /** Number of answer options per question */
  optionsCount: number;
  /** Weight for weak characters (higher = more likely to appear) */
  weakCharacterWeight: number;
  /** Minimum attempts before considering a character "known" */
  minAttemptsForMastery: number;
  /** Accuracy threshold to consider a character mastered */
  masteryThreshold: number;
}

/**
 * Default quiz configuration.
 */
export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  questionCount: 10,
  optionsCount: 4,
  weakCharacterWeight: 3,
  minAttemptsForMastery: 5,
  masteryThreshold: 0.8,
};
