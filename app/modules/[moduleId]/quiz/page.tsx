"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuizContainer } from "@/features/quizzes/components/QuizContainer";
import { QuizStart } from "@/features/quizzes/components/QuizStart";
import { startQuizAction } from "@/features/quizzes/actions/quiz-actions";
import type { QuizSession } from "@/features/quizzes/types";
import type { ModuleCharacter } from "@/features/modules/types";

type PageState = "loading" | "start" | "playing" | "error";

interface QuizPageProps {
  params: Promise<{ moduleId: string }>;
}

/**
 * Quiz page component that handles quiz flow.
 * @param params - Route parameters containing moduleId
 */
export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter();
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [state, setState] = useState<PageState>("loading");
  const [session, setSession] = useState<QuizSession | null>(null);
  const [moduleInfo, setModuleInfo] = useState<{
    name: string;
    characters: ModuleCharacter[];
    progress: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    params.then((p) => setModuleId(p.moduleId));
  }, [params]);

  // Fetch module info on mount
  useEffect(() => {
    if (!moduleId) return;

    async function fetchModuleInfo() {
      try {
        const response = await fetch(`/api/modules/${moduleId}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          if (response.status === 404) {
            router.push("/dashboard");
            return;
          }
          throw new Error("Failed to fetch module");
        }

        const data = await response.json();
        setModuleInfo(data);
        setState("start");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading module");
        setState("error");
      }
    }

    fetchModuleInfo();
  }, [moduleId, router]);

  const handleStartQuiz = async () => {
    if (!moduleId) return;

    setState("loading");

    try {
      const response = await startQuizAction(moduleId);

      if (!response.success) {
        throw new Error(response.error);
      }

      setSession(response.data);
      setState("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error starting quiz");
      setState("error");
    }
  };

  // Loading state
  if (state === "loading" || !moduleId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin border-4 border-foreground border-t-transparent" />
          <p className="font-bold text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="manga-panel manga-shadow max-w-md p-6 text-center">
          <p className="mb-4 text-xl font-bold text-destructive">Error</p>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <Link href="/dashboard">
            <button className="manga-btn bg-foreground px-6 py-2 font-bold text-background">
              Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-foreground">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href={state === "playing" ? "#" : `/modules/${moduleId}`}
            className={`flex items-center gap-2 font-bold ${
              state === "playing" ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={(e) => {
              if (state === "playing") {
                e.preventDefault();
              }
            }}
          >
            <span className="text-xl">&larr;</span>
            <span>Salir</span>
          </Link>
          <span className="text-2xl font-black tracking-tighter">ひな</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Start screen */}
        {state === "start" && moduleInfo && (
          <QuizStart
            moduleName={moduleInfo.name}
            moduleId={moduleId}
            characters={moduleInfo.characters}
            progress={moduleInfo.progress}
            onStart={handleStartQuiz}
          />
        )}

        {/* Quiz in progress */}
        {state === "playing" && session && (
          <QuizContainer initialSession={session} />
        )}
      </main>
    </div>
  );
}
