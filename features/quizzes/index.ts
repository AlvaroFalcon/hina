// Types
export * from "./types";

// Quiz session management
export { startQuiz, getActiveQuizSession } from "./lib/start-quiz";

// Answer submission
export { submitAnswer, getQuizProgress } from "./lib/submit-answer";
export { submitAnswersBatch } from "./lib/submit-answers-batch";
export type { BatchAnswer, BatchSubmitResult } from "./lib/submit-answers-batch";

// Quiz completion
export {
  completeQuiz,
  abandonQuiz,
  getQuizResult,
} from "./lib/complete-quiz";

// Statistics
export {
  getModuleQuizStats,
  getOverallQuizStats,
  getQuizHistory,
  getCharactersNeedingPractice,
} from "./lib/get-quiz-stats";

// Server Actions - Quiz
export {
  startQuizAction,
  getActiveQuizAction,
  submitAnswerAction,
  submitAnswersBatchAction,
  getQuizProgressAction,
  completeQuizAction,
  abandonQuizAction,
  getQuizResultAction,
} from "./actions/quiz-actions";

// Server Actions - Stats
export {
  getModuleStatsAction,
  getOverallStatsAction,
  getQuizHistoryAction,
  getWeakCharactersAction,
} from "./actions/stats-actions";

// Components
export { QuizContainer } from "./components/QuizContainer";
export { QuizQuestion } from "./components/QuizQuestion";
export { QuizProgress } from "./components/QuizProgress";
export { QuizResult } from "./components/QuizResult";
export { QuizStart } from "./components/QuizStart";
