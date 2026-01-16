import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/features/auth/lib/get-user";
import { getModulesWithProgress } from "@/features/modules";
import { Navbar } from "@/components/navbar";

/** Force dynamic rendering */
export const dynamic = "force-dynamic";

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

/**
 * Module detail page showing characters and quiz access.
 * @param params - Route parameters containing moduleId
 * @returns Module page component
 */
export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const modules = await getModulesWithProgress(user.id);
  const module = modules.find((m) => m.id === moduleId);

  if (!module) {
    notFound();
  }

  // Check if module is unlocked
  if (!module.isUnlocked) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        leftContent={
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="text-xl">&larr;</span>
            <span>Volver</span>
          </Link>
        }
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Module header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-black">{module.name}</h1>
          <p className="text-muted-foreground">
            {module.characters.length} caracteres ·{" "}
            {module.isCompleted ? "Completado" : `${Math.round(module.progress)}% progreso`}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mb-8 max-w-md">
          <div className="manga-border h-4 w-full bg-secondary">
            <div
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>

        {/* Characters grid */}
        <section className="mb-12">
          <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Caracteres en este módulo
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {module.characters.map((char) => (
              <div
                key={char.id}
                className="manga-panel group flex h-20 w-20 flex-col items-center justify-center p-2 transition-all hover:manga-shadow"
              >
                <span className="text-3xl">{char.character}</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {char.reading}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quiz section */}
        <section className="flex flex-col items-center">
          <div className="manga-panel manga-shadow w-full max-w-md p-6 text-center">
            <h3 className="mb-2 text-xl font-bold">¿Listo para practicar?</h3>
            <p className="mb-6 text-muted-foreground">
              Pon a prueba tu conocimiento con un quiz adaptativo
            </p>
            <Link href={`/modules/${moduleId}/quiz`}>
              <button className="manga-btn w-full bg-foreground py-4 text-xl font-bold text-background">
                Empezar Quiz
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
