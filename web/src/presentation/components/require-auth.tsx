"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";

type Props = { children: ReactNode };

/**
 * Só renderiza filhos após reidratar o persist e confirmar sessão.
 * Utilizadores não autenticados são enviados para `/login`.
 */
export function RequireAuth({ children }: Props) {
  const router = useRouter();
  const isAuthenticated = useSeniorEaseStore((s) => s.isAuthenticated);
  const dataHydrated = useSeniorEaseStore((s) => s.hydrated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useSeniorEaseStore.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useSeniorEaseStore.persist.onFinishHydration(() => {
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || !dataHydrated) {
    return (
      <div
        className="flex min-h-[40vh] items-center justify-center text-a11y-base text-[var(--text-muted)]"
        role="status"
        aria-live="polite"
      >
        Carregando…
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
