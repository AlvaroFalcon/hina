import { redirect } from "next/navigation";
import { getUser } from "@/features/auth/lib/get-user";
import {
  getModulesWithProgress,
  CurrentModuleCard,
  ModuleGrid,
} from "@/features/modules";
import { Navbar } from "@/components/navbar";

/** Force dynamic rendering to avoid static generation with DB calls */
export const dynamic = "force-dynamic";

/**
 * Dashboard page showing user's learning progress.
 * Displays current module and grid of all modules.
 * @returns Dashboard page component
 */
export default async function DashboardPage() {
  const user = await getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  const modules = await getModulesWithProgress(user.id);
  const currentModule = modules.find((m) => m.isCurrent) ?? null;
  const completedCount = modules.filter((m) => m.isCompleted).length;
  const isAllCompleted =
    completedCount === modules.length && modules.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        rightSlot={
          <div className="manga-border bg-secondary px-3 py-1">
            <span className="text-sm font-bold">
              {completedCount}/{modules.length}
            </span>
          </div>
        }
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black">
            {getGreeting()},{" "}
            <span className="text-muted-foreground">
              {user.user_metadata?.full_name?.split(" ")[0] || "estudiante"}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {isAllCompleted
              ? "¡Has completado todos los módulos!"
              : currentModule
                ? `Continúa donde lo dejaste`
                : "Empieza tu aventura con los silabarios japoneses"}
          </p>
        </div>

        {/* Current module */}
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {isAllCompleted ? "Completado" : "Tu siguiente paso"}
          </h2>
          <CurrentModuleCard
            module={currentModule}
            isAllCompleted={isAllCompleted}
          />
        </section>

        {/* All modules grid */}
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Todos los módulos
          </h2>
          <ModuleGrid modules={modules} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-4 border-foreground">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="text-center text-sm text-muted-foreground">
            <span className="font-bold text-foreground">ひな</span> — Aprende
            Hiragana y Katakana
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Returns a greeting based on the current time of day.
 * @returns Greeting string
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}
