"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuizQuestion as QuizQuestionType } from "../types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string, timeMs: number) => void;
  disabled?: boolean;
  showFeedback?: {
    isCorrect: boolean;
    correctAnswer: string;
  } | null;
}

/**
 * Displays a quiz question with the character and answer options.
 * @param question - The question data with character and options
 * @param onAnswer - Callback when user selects an answer
 * @param disabled - Whether interaction is disabled
 * @param showFeedback - Feedback to show after answering
 */
export function QuizQuestion({
  question,
  onAnswer,
  disabled = false,
  showFeedback = null,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime] = useState(() => Date.now());

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [question.character.id]);

  const handleSelect = useCallback(
    (option: string) => {
      if (disabled || selectedAnswer) return;

      setSelectedAnswer(option);
      const timeMs = Date.now() - startTime;
      onAnswer(option, timeMs);
    },
    [disabled, selectedAnswer, startTime, onAnswer]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || selectedAnswer) return;

      const keyMap: Record<string, number> = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
      };

      const index = keyMap[e.key];
      if (index !== undefined && index < question.options.length) {
        handleSelect(question.options[index]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, selectedAnswer, question.options, handleSelect]);

  const getOptionStyle = (option: string) => {
    if (!showFeedback) {
      // No feedback yet
      if (selectedAnswer === option) {
        return "bg-secondary manga-shadow-sm";
      }
      return "bg-background hover:bg-secondary/50 hover:manga-shadow-sm";
    }

    // With feedback - correct answer always shown in green
    if (option === showFeedback.correctAnswer) {
      return "bg-green-500 text-white manga-shadow";
    }

    // User's wrong selection shown in red
    if (selectedAnswer === option && !showFeedback.isCorrect) {
      return "bg-red-500 text-white";
    }

    return "opacity-40";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Character display */}
      <div className="manga-panel manga-shadow-lg mb-8 flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
        <span className="text-6xl sm:text-7xl">{question.character.character}</span>
      </div>

      {/* Question prompt */}
      <p className="mb-6 text-center text-lg font-bold">
        ¿Cómo se lee este carácter?
      </p>

      {/* Answer options */}
      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={disabled || !!selectedAnswer}
            className={`manga-border relative p-4 text-center text-lg font-bold transition-all ${getOptionStyle(option)} ${
              !disabled && !selectedAnswer ? "cursor-pointer" : "cursor-default"
            }`}
          >
            {/* Keyboard shortcut hint */}
            <span className="absolute left-2 top-1 text-xs text-muted-foreground">
              {index + 1}
            </span>
            {option}
          </button>
        ))}
      </div>

      {/* Feedback message */}
      {showFeedback && (
        <div
          className={`mt-6 text-center text-xl font-bold ${
            showFeedback.isCorrect ? "text-foreground" : "text-destructive"
          }`}
        >
          {showFeedback.isCorrect ? (
            <span className="onomatopoeia">¡Correcto!</span>
          ) : (
            <span>
              Incorrecto. Era:{" "}
              <span className="underline">{showFeedback.correctAnswer}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
