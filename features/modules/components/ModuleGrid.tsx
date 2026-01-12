import type { ModuleWithProgress } from "../types";
import { ModuleCard } from "./ModuleCard";

interface ModuleGridProps {
  modules: ModuleWithProgress[];
}

/**
 * Displays a grid of all modules with their progress and lock status.
 * @param modules - Array of modules to display
 * @returns Module grid component
 */
export function ModuleGrid({ modules }: ModuleGridProps) {
  if (modules.length === 0) {
    return (
      <div className="manga-panel p-6 text-center">
        <p className="text-muted-foreground">
          No hay módulos disponibles todavía.
        </p>
      </div>
    );
  }

  // Separate Hiragana and Katakana modules based on name
  const hiraganaModules = modules.filter((m) =>
    m.name.toLowerCase().includes("hiragana")
  );
  const katakanaModules = modules.filter((m) =>
    m.name.toLowerCase().includes("katakana")
  );
  const otherModules = modules.filter(
    (m) =>
      !m.name.toLowerCase().includes("hiragana") &&
      !m.name.toLowerCase().includes("katakana")
  );

  return (
    <div className="space-y-8">
      {/* Hiragana section */}
      {hiraganaModules.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-lg font-black">Hiragana</h3>
            <span className="text-2xl">あ</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {hiraganaModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>
      )}

      {/* Katakana section */}
      {katakanaModules.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-lg font-black">Katakana</h3>
            <span className="text-2xl">ア</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {katakanaModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>
      )}

      {/* Other modules (if any) */}
      {otherModules.length > 0 && (
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-black">Otros</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {otherModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
