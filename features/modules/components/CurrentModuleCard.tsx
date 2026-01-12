import Link from "next/link";
import type { ModuleWithProgress } from "../types";

interface CurrentModuleCardProps {
  module: ModuleWithProgress | null;
  isAllCompleted?: boolean;
}

/**
 * Displays the current module the user should work on.
 * Shows a celebration message if all modules are completed.
 * @param module - The current module to display
 * @param isAllCompleted - Whether all modules are completed
 * @returns Current module card component
 */
export function CurrentModuleCard({
  module,
  isAllCompleted,
}: CurrentModuleCardProps) {
  // All modules completed
  if (isAllCompleted) {
    return (
      <div className="manga-panel manga-shadow bg-background p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-6xl" aria-hidden="true">
            完
          </div>
          <h2 className="mb-2 text-2xl font-black">
            <span className="onomatopoeia">スゴイ!</span>
          </h2>
          <p className="text-muted-foreground">
            Has completado todos los módulos. ¡Eres increíble!
          </p>
        </div>
      </div>
    );
  }

  // No module available (shouldn't happen normally)
  if (!module) {
    return (
      <div className="manga-panel manga-shadow bg-background p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <p className="text-muted-foreground">
            No hay módulos disponibles todavía.
          </p>
        </div>
      </div>
    );
  }

  // Show first 5 characters as preview
  const previewCharacters = module.characters.slice(0, 5);

  return (
    <div className="manga-panel manga-shadow bg-background p-6 sm:p-8">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {module.progress > 0 ? "Continúa con" : "Empieza con"}
          </p>
          <h2 className="text-2xl font-black">{module.name}</h2>
        </div>
        <div className="manga-border bg-secondary px-3 py-1">
          <span className="text-sm font-bold">{module.progress}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-3 w-full border-2 border-foreground bg-secondary">
        <div
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${module.progress}%` }}
        />
      </div>

      {/* Character preview */}
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Caracteres
        </p>
        <div className="flex flex-wrap gap-2">
          {previewCharacters.map((char) => (
            <div
              key={char.id}
              className="manga-border flex h-12 w-12 items-center justify-center bg-background text-xl font-medium"
            >
              {char.character}
            </div>
          ))}
          {module.characters.length > 5 && (
            <div className="flex h-12 w-12 items-center justify-center text-sm font-bold text-muted-foreground">
              +{module.characters.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/modules/${module.id}`}
        className="manga-btn block w-full bg-primary py-3 text-center font-bold text-primary-foreground"
      >
        {module.progress > 0 ? "Continuar" : "Empezar"} →
      </Link>
    </div>
  );
}
