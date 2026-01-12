import { prisma } from "@/lib/prisma";
import type { ModuleWithProgress, ProgressSummary } from "../types";

/** Minimum percentage required to unlock the next module */
const UNLOCK_THRESHOLD = 80;

/**
 * Gets all modules with user progress and unlock status.
 * @param userId - The authenticated user's ID
 * @returns Array of modules with progress data
 */
export async function getModulesWithProgress(
  userId: string
): Promise<ModuleWithProgress[]> {
  // Get all modules with their characters
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: {
      moduleCharacters: {
        orderBy: { order: "asc" },
        include: {
          character: true,
        },
      },
    },
  });

  // Get user progress for all modules
  const userProgress = await prisma.userProgress.findMany({
    where: { userId },
  });

  // Create a map for quick lookup
  const progressMap = new Map(
    userProgress.map((p) => [p.moduleId, p.percentage])
  );

  // Determine current module (first incomplete unlocked module)
  let currentModuleId: string | null = null;

  const modulesWithProgress: ModuleWithProgress[] = modules.map(
    (module, index) => {
      const progress = progressMap.get(module.id) ?? 0;
      const isCompleted = progress >= 100;

      // First module is always unlocked
      // Others are unlocked if previous module has >= UNLOCK_THRESHOLD
      let isUnlocked = index === 0;
      if (index > 0) {
        const previousModuleId = modules[index - 1].id;
        const previousProgress = progressMap.get(previousModuleId) ?? 0;
        isUnlocked = previousProgress >= UNLOCK_THRESHOLD;
      }

      // Current module is the first unlocked but not completed
      const isCurrent =
        isUnlocked && !isCompleted && currentModuleId === null;
      if (isCurrent) {
        currentModuleId = module.id;
      }

      return {
        id: module.id,
        name: module.name,
        order: module.order,
        characters: module.moduleCharacters.map((mc) => ({
          id: mc.character.id,
          character: mc.character.character,
          reading: mc.character.reading,
          type: mc.character.type,
        })),
        progress,
        isUnlocked,
        isCompleted,
        isCurrent,
      };
    }
  );

  return modulesWithProgress;
}

/**
 * Gets a summary of the user's progress including current and next modules.
 * @param userId - The authenticated user's ID
 * @returns Progress summary with current and next module
 */
export async function getProgressSummary(
  userId: string
): Promise<ProgressSummary> {
  const modules = await getModulesWithProgress(userId);

  const completedModules = modules.filter((m) => m.isCompleted).length;
  const currentModule = modules.find((m) => m.isCurrent) ?? null;

  // Next module is the first locked module after current
  let nextModule: ModuleWithProgress | null = null;
  if (currentModule) {
    const currentIndex = modules.findIndex((m) => m.id === currentModule.id);
    if (currentIndex < modules.length - 1) {
      nextModule = modules[currentIndex + 1];
    }
  }

  return {
    totalModules: modules.length,
    completedModules,
    currentModule,
    nextModule,
  };
}
