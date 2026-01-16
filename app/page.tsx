import Link from "next/link";
import { getUser } from "@/features/auth/lib/get-user";
import { Navbar } from "@/components/navbar";

/**
 * Landing page component for Hina.
 * Displays a manga-inspired minimalist design with hero section,
 * features overview, and call-to-action buttons.
 * @returns The landing page JSX element
 */
export default async function Home() {
  const user = await getUser();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="fixed" user={user} />

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative overflow-hidden">
          {/* Decorative onomatopoeia */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-24 select-none text-6xl font-black text-foreground/5 sm:text-8xl md:text-9xl"
          >
            ドキドキ
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 bottom-20 select-none text-5xl font-black text-foreground/5 sm:text-7xl md:text-8xl"
          >
            ワクワク
          </div>

          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-32">
            <div className="flex flex-col items-center text-center">
              {/* Main character display */}
              <div className="manga-panel mb-8 inline-block p-6 sm:p-8">
                <span className="text-7xl font-black sm:text-8xl md:text-9xl">
                  あ
                </span>
              </div>

              {/* Headline */}
              <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Aprende los silabarios
                <br />
                <span className="relative inline-block">
                  desde cero
                  <svg
                    className="absolute -bottom-1 left-0 h-3 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8C50 2 150 2 198 8"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mb-8 max-w-md text-lg text-muted-foreground sm:text-xl">
                Domina Hiragana y Katakana con quizzes adaptativos. Simple,
                efectivo, sin distracciones.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="manga-btn bg-primary px-8 py-4 text-lg font-bold text-primary-foreground"
                >
                  Comenzar gratis
                </Link>
                <Link
                  href="#como-funciona"
                  className="manga-btn bg-background px-8 py-4 text-lg font-bold"
                >
                  Cómo funciona
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="como-funciona"
          className="border-t-4 border-foreground bg-secondary/30"
        >
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <h2 className="mb-12 text-center text-3xl font-black sm:text-4xl">
              Método simple y efectivo
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="manga-panel p-6">
                <div className="mb-4 text-4xl">順</div>
                <h3 className="mb-2 text-xl font-bold">Módulos secuenciales</h3>
                <p className="text-muted-foreground">
                  Aprende los caracteres en orden lógico. Cada módulo desbloquea
                  el siguiente cuando lo dominas.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="manga-panel p-6">
                <div className="mb-4 text-4xl">適</div>
                <h3 className="mb-2 text-xl font-bold">Quizzes adaptativos</h3>
                <p className="text-muted-foreground">
                  Los caracteres que más te cuestan aparecen con más frecuencia
                  hasta que los domines.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="manga-panel p-6 sm:col-span-2 lg:col-span-1">
                <div className="mb-4 text-4xl">進</div>
                <h3 className="mb-2 text-xl font-bold">Seguimiento claro</h3>
                <p className="text-muted-foreground">
                  Visualiza tu progreso en cada módulo. Sabe exactamente dónde
                  estás y qué te falta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Syllabary Preview */}
        <section className="border-t-4 border-foreground">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-col items-center text-center">
              <h2 className="mb-4 text-3xl font-black sm:text-4xl">
                Dos silabarios, un objetivo
              </h2>
              <p className="mb-12 max-w-lg text-muted-foreground">
                Hiragana para palabras japonesas nativas. Katakana para palabras
                extranjeras. Ambos esenciales.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {/* Hiragana samples */}
                <div className="manga-panel manga-shadow-sm p-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Hiragana
                  </div>
                  <div className="flex gap-2 text-3xl font-medium">
                    <span>あ</span>
                    <span>い</span>
                    <span>う</span>
                    <span>え</span>
                    <span>お</span>
                  </div>
                </div>

                {/* Katakana samples */}
                <div className="manga-panel manga-shadow-sm p-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Katakana
                  </div>
                  <div className="flex gap-2 text-3xl font-medium">
                    <span>ア</span>
                    <span>イ</span>
                    <span>ウ</span>
                    <span>エ</span>
                    <span>オ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t-4 border-foreground screentone-light">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-col items-center text-center">
              {/* Onomatopoeia */}
              <div
                aria-hidden="true"
                className="mb-6 text-5xl font-black tracking-tight sm:text-6xl"
              >
                <span className="onomatopoeia">ガンバレ!</span>
              </div>

              <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                ¿Listo para empezar?
              </h2>
              <p className="mb-8 max-w-md text-muted-foreground">
                Crea tu cuenta gratuita y comienza a aprender hoy mismo.
              </p>

              <Link
                href="/register"
                className="manga-btn manga-shadow bg-primary px-8 py-4 text-lg font-bold text-primary-foreground"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-foreground">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">ひな</span> — Aprende
              Hiragana y Katakana
            </div>
            <div className="text-sm text-muted-foreground">
              Hecho con 愛 para estudiantes de japonés
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
