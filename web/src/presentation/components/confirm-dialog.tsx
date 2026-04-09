"use client";

import { BigButton } from "@/presentation/components/big-button";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="w-full max-w-md rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-xl">
        <h2 id="confirm-title" className="text-a11y-xl font-bold text-[var(--text)]">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-3 text-a11y-base text-[var(--text-muted)]">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <BigButton type="button" onClick={onConfirm}>
            {confirmLabel}
          </BigButton>
          <BigButton type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </BigButton>
        </div>
      </div>
    </div>
  );
}
