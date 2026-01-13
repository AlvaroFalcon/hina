import { NextResponse } from "next/server";
import { getUser } from "@/features/auth/lib/get-user";
import { getModulesWithProgress } from "@/features/modules";

interface RouteParams {
  params: Promise<{ moduleId: string }>;
}

/**
 * GET /api/modules/[moduleId]
 * Returns module info with characters and progress.
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { moduleId } = await params;
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const modules = await getModulesWithProgress(user.id);
  const module = modules.find((m) => m.id === moduleId);

  if (!module) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  if (!module.isUnlocked) {
    return NextResponse.json({ error: "Module locked" }, { status: 403 });
  }

  return NextResponse.json({
    id: module.id,
    name: module.name,
    characters: module.characters,
    progress: module.progress,
    isCompleted: module.isCompleted,
  });
}
