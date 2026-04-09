"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";

type Props = { children: ReactNode };

/** Para `/login`: após sessão válida, redireciona para a área autenticada. */
export function GuestOnly({ children }: Props) {
  const router = useRouter();
  const isAuthenticated = useSeniorEaseStore((s) => s.isAuthenticated);
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
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready) {
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

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
