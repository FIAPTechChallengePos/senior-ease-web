"use client";

import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";
import { BigButton } from "@/presentation/components/big-button";

export function ToastStack() {
  const toasts = useSeniorEaseStore((s) => s.toasts);
  const dismiss = useSeniorEaseStore((s) => s.dismissToast);
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
      role="status"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between gap-3 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] p-4 shadow-lg"
        >
          <p className="text-a11y-base text-[var(--text)]">{t.text}</p>
          <BigButton
            variant="ghost"
            className="min-h-0 shrink-0 px-2 py-1 text-a11y-base"
            onClick={() => dismiss(t.id)}
          >
            Fechar
          </BigButton>
        </div>
      ))}
    </div>
  );
}
