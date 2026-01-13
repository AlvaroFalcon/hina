"use client";

import { useState } from "react";
import Link from "next/link";
import type { ModuleCharacter } from "@/features/modules/types";

interface QuizStartProps {
  moduleName: string;
  moduleId: string;
  characters: ModuleCharacter[];
  progress: number;
  onStart: () => void;
  isLoading?: boolean;
}

/**
 * Quiz start screen showing module info and start button.
 * @param moduleName - Name of the module
 * @param moduleId - ID of the module
 * @param characters - Characters in this module
 * @param progress - Current progress percentage
 * @param onStart - Callback to start the quiz
 * @param isLoading - Whether the quiz is loading
 */
export function QuizStart({
  moduleName,
  moduleId,
  characters,
  progress,
  onStart,
  isLoading = false,
}: QuizStartProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Module title */}
      <h1 className="mb-2 text-2xl font-bold">{moduleName}</h1>
      <p className="mb-6 text-muted-foreground">
        {characters.length} caracteres · {Math.round(progress)}% completado
      </p>

      {/* Characters preview */}
      <div className="manga-panel mb-8 p-4">
        <p className="mb-3 text-sm font-bold text-muted-foreground">
          Caracteres en este módulo:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {characters.map((char) => (
            <div
              key={char.id}
              className="manga-border flex h-12 w-12 items-center justify-center bg-background text-xl"
            >
              {char.character}
            </div>
          ))}
        </div>
      </div>

      {/* Quiz info */}
      <div className="manga-border mb-8 w-full max-w-xs bg-secondary/30 p-4">
        <h3 className="mb-2 font-bold">Cómo funciona:</h3>
        <ul className="space-y-1 text-left text-sm text-muted-foreground">
          <li>• 10 preguntas aleatorias</li>
          <li>• Elige la lectura correcta</li>
          <li>• Usa teclas 1-4 para responder rápido</li>
          <li>• Practica los caracteres difíciles</li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          onClick={onStart}
          disabled={isLoading}
          className="manga-btn w-full bg-foreground py-4 text-xl font-bold text-background disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin border-2 border-background border-t-transparent" />
              Cargando...
            </span>
          ) : (
            "Empezar Quiz"
          )}
        </button>

        <Link href="/dashboard" className="w-full">
          <button className="manga-btn w-full bg-background py-3 font-bold">
            Volver
          </button>
        </Link>
      </div>
    </div>
  );
}
