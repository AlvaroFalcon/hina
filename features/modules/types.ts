import type { CharacterType } from "@prisma/client";

/**
 * Character data for display in modules.
 */
export interface ModuleCharacter {
  id: string;
  character: string;
  reading: string;
  type: CharacterType;
}

/**
 * Module with user progress and unlock status.
 */
export interface ModuleWithProgress {
  id: string;
  name: string;
  order: number;
  characters: ModuleCharacter[];
  progress: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
}

/**
 * Summary of user's learning progress.
 */
export interface ProgressSummary {
  totalModules: number;
  completedModules: number;
  currentModule: ModuleWithProgress | null;
  nextModule: ModuleWithProgress | null;
}
