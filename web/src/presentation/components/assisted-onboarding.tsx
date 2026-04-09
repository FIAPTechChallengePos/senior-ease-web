"use client";

import { useEffect, useState } from "react";
import { BigButton, BigLink } from "@/presentation/components/big-button";

const KEY = "seniorease_onboarding_v1";

export function AssistedOnboarding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const done = window.localStorage.getItem(KEY);
      if (!done) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="mb-6 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-md"
      role="region"
      aria-labelledby="onb-title"
    >
      <h2 id="onb-title" className="text-a11y-xl font-bold text-[var(--text)]">
        Modo assistido: boas-vindas
      </h2>
      <p className="mt-3 text-a11y-base text-[var(--text-muted)]">
        Este é o SeniorEase. Em três passos você deixa o app do seu jeito: primeiro os ajustes da
        tela, depois as tarefas, e por último o resumo no perfil.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-a11y-base text-[var(--text)]">
        <li>Toque em &quot;Ajustes&quot; no menu e escolha letra e contraste.</li>
        <li>Em &quot;Tarefas&quot;, crie algo simples, como &quot;Ler o recado do dia&quot;.</li>
        <li>Em &quot;Perfil&quot;, confira se está tudo como você quer.</li>
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        <BigLink href="/personalize">Começar pelos ajustes</BigLink>
        <BigButton type="button" variant="secondary" onClick={dismiss}>
          Entendi, fechar esta mensagem
        </BigButton>
      </div>
    </div>
  );
}
