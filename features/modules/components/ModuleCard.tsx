import Link from "next/link";
import type { ModuleWithProgress } from "../types";

interface ModuleCardProps {
  module: ModuleWithProgress;
}

/**
 * Displays a single module card with progress and lock status.
 * @param module - The module to display
 * @returns Module card component
 */
export function ModuleCard({ module }: ModuleCardProps) {
  const { isUnlocked, isCompleted, progress, name, characters } = module;

  // Show first 3 characters as mini preview
  const previewCharacters = characters.slice(0, 3);

  // Locked module
  if (!isUnlocked) {
    return (
      <div className="manga-panel relative bg-secondary/50 p-4 opacity-60">
        {/* Lock icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl" aria-label="Módulo bloqueado">
            🔒
          </div>
        </div>

        <div className="invisible">
          <p className="mb-2 text-sm font-bold">{name}</p>
          <div className="flex gap-1">
            {previewCharacters.map((char) => (
              <span key={char.id} className="text-lg">
                {char.character}
              </span>
            ))}
          </div>
        </div>

        {/* Module name visible but faded */}
        <p className="absolute bottom-4 left-4 right-4 truncate text-sm font-bold text-muted-foreground">
          {name}
        </p>
      </div>
    );
  }

  // Unlocked/Completed module
  return (
    <Link
      href={`/modules/${module.id}`}
      className={`manga-panel group relative block p-4 transition-all hover:manga-shadow ${
        isCompleted ? "bg-secondary/30" : "bg-background"
      }`}
    >
      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center bg-foreground text-xs text-background">
          ✓
        </div>
      )}

      {/* Current indicator */}
      {module.isCurrent && (
        <div className="absolute -left-1 -top-1 h-3 w-3 animate-pulse bg-foreground" />
      )}

      <div className="mb-3">
        <p className="mb-1 truncate text-sm font-bold">{name}</p>
        <div className="flex gap-1">
          {previewCharacters.map((char) => (
            <span
              key={char.id}
              className="manga-border flex h-8 w-8 items-center justify-center bg-background text-sm"
            >
              {char.character}
            </span>
          ))}
          {characters.length > 3 && (
            <span className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground">
              +{characters.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full border border-foreground bg-secondary">
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs font-bold text-muted-foreground">
        {progress}%
      </p>
    </Link>
  );
}
