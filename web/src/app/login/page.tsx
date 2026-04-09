"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";
import { BigButton } from "@/presentation/components/big-button";
import { GuestOnly } from "@/presentation/components/guest-only";
import type { ContrastMode, FontSizePreset } from "@/domain/entities/accessibility-preferences";

/** Login: "grande" usa xlarge no painel global; "normal" usa medium (antes de /personalize). */
const LOGIN_FONT_NORMAL: FontSizePreset = "medium";
const LOGIN_FONT_LARGE: FontSizePreset = "xlarge";

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  );
}

function LoginForm() {
  const router = useRouter();
  const preferences = useSeniorEaseStore((s) => s.preferences);
  const setPreferences = useSeniorEaseStore((s) => s.setPreferences);
  const login = useSeniorEaseStore((s) => s.login);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const isLargeElements = preferences.fontSize === LOGIN_FONT_LARGE;
  const isHighContrast = preferences.contrast === "high";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = identifier.trim();
    const pw = password.trim();
    if (!id || !pw) {
      setShowError(true);
      return;
    }
    setShowError(false);
    if (login({ identifier: id, password: pw })) {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-6">
      <div
        className={clsx(
          "w-full max-w-6xl rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] shadow-md",
          "p-6 sm:p-8",
          isLargeElements ? "space-y-6" : "space-y-5"
        )}
      >
        <header className="text-center lg:text-left">
          <h1 className="text-a11y-xl font-bold text-[var(--text)]">Entrar no SeniorEase</h1>
          <p className="mt-2 text-a11y-base text-[var(--text-muted)]">
            Ajuste o tamanho e o contraste à esquerda e faça login à direita (em ecrãs largos).
          </p>
        </header>

        <div
          className={clsx(
            "grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10",
            isLargeElements ? "lg:gap-12" : ""
          )}
        >
          <section
            aria-labelledby="login-a11y-title"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:p-5"
          >
            <h2 id="login-a11y-title" className="text-a11y-lg font-semibold text-[var(--text)]">
              Acessibilidade nesta tela
            </h2>
            <div className={clsx("mt-3 flex flex-col", isLargeElements ? "gap-4" : "gap-3")}>
              <div>
                <p className="mb-2 text-a11y-base font-medium text-[var(--text)]">
                  Tamanho dos elementos
                </p>
                <div className="flex flex-wrap gap-2">
                  <BigButton
                    type="button"
                    variant={!isLargeElements ? "primary" : "secondary"}
                    aria-pressed={!isLargeElements}
                    onClick={() => setPreferences({ fontSize: LOGIN_FONT_NORMAL })}
                  >
                    Tamanho normal
                  </BigButton>
                  <BigButton
                    type="button"
                    variant={isLargeElements ? "primary" : "secondary"}
                    aria-pressed={isLargeElements}
                    onClick={() => setPreferences({ fontSize: LOGIN_FONT_LARGE })}
                  >
                    Tamanho grande
                  </BigButton>
                </div>
              </div>
              <div>
                <p className="mb-2 text-a11y-base font-medium text-[var(--text)]">Contraste</p>
                <div className="flex flex-wrap gap-2">
                  <BigButton
                    type="button"
                    variant={!isHighContrast ? "primary" : "secondary"}
                    aria-pressed={!isHighContrast}
                    onClick={() => setPreferences({ contrast: "normal" as ContrastMode })}
                  >
                    Contraste normal
                  </BigButton>
                  <BigButton
                    type="button"
                    variant={isHighContrast ? "primary" : "secondary"}
                    aria-pressed={isHighContrast}
                    onClick={() => setPreferences({ contrast: "high" as ContrastMode })}
                  >
                    Alto contraste
                  </BigButton>
                </div>
              </div>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className={clsx(
              "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5",
              isLargeElements ? "space-y-5" : "space-y-4"
            )}
            aria-labelledby="login-form-title"
          >
            <h2 id="login-form-title" className="text-a11y-lg font-semibold text-[var(--text)]">
              Dados de acesso
            </h2>
            <div>
              <label htmlFor="login-identifier" className="block text-a11y-base font-semibold text-[var(--text)]">
                Nome ou email
              </label>
              <input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="Como prefere ser chamado ou seu email"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (showError) setShowError(false);
                }}
                className={clsx(
                  "mt-2 w-full rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[var(--text)]",
                  "focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--focus-ring)]",
                  isLargeElements ? "min-h-[56px] py-3 text-xl" : "min-h-[52px] py-2.5 text-a11y-base"
                )}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-a11y-base font-semibold text-[var(--text)]">
                Senha
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (showError) setShowError(false);
                }}
                className={clsx(
                  "mt-2 w-full rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] px-4 text-[var(--text)]",
                  "focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--focus-ring)]",
                  isLargeElements ? "min-h-[56px] py-3 text-xl" : "min-h-[52px] py-2.5 text-a11y-base"
                )}
              />
            </div>

            {showError ? (
              <p
                role="alert"
                aria-live="polite"
                className="rounded-lg border-2 border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-3 text-a11y-base font-medium text-[var(--text)]"
              >
                Por favor, preencha os campos
              </p>
            ) : null}

            <BigButton type="submit" className="w-full sm:w-auto">
              Entrar
            </BigButton>
          </form>
        </div>
      </div>
    </div>
  );
}
