"use client";

import { RequireAuth } from "@/presentation/components/require-auth";
import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";
import { BigLink } from "@/presentation/components/big-button";

const labels: Record<string, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
  xlarge: "Extra grande",
  normal: "Normal",
  high: "Alto",
  compact: "Mais junto",
  comfortable: "Confortável",
  spacious: "Mais espaço",
  basic: "Básico",
  advanced: "Avançado",
  light: "Claro",
  dark: "Escuro",
  system: "Seguir o sistema",
};

function ProfilePageContent() {
  const preferences = useSeniorEaseStore((s) => s.preferences);
  const activeTasks = useSeniorEaseStore((s) => s.activeTasks);
  const completedTasks = useSeniorEaseStore((s) => s.completedTasks);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-a11y-xl font-bold text-[var(--text)]">Perfil e resumo</h1>
        <p className="mt-2 text-a11y-base text-[var(--text-muted)]">
          Aqui está um resumo do que está salvo neste aparelho. Para mudar, use a tela de ajustes.
        </p>
      </header>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="pref-title"
      >
        <h2 id="pref-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Preferências de acessibilidade
        </h2>
        <dl className="mt-4 space-y-3 text-a11y-base text-[var(--text)]">
          <div>
            <dt className="font-semibold">Tamanho da letra</dt>
            <dd className="text-[var(--text-muted)]">{labels[preferences.fontSize]}</dd>
          </div>
          <div>
            <dt className="font-semibold">Contraste</dt>
            <dd className="text-[var(--text-muted)]">{labels[preferences.contrast]}</dd>
          </div>
          <div>
            <dt className="font-semibold">Espaçamento</dt>
            <dd className="text-[var(--text-muted)]">{labels[preferences.spacing]}</dd>
          </div>
          <div>
            <dt className="font-semibold">Modo da interface</dt>
            <dd className="text-[var(--text-muted)]">{labels[preferences.interfaceMode]}</dd>
          </div>
          <div>
            <dt className="font-semibold">Tema</dt>
            <dd className="text-[var(--text-muted)]">{labels[preferences.theme]}</dd>
          </div>
          <div>
            <dt className="font-semibold">Feedback visual reforçado</dt>
            <dd className="text-[var(--text-muted)]">
              {preferences.reinforcedVisualFeedback ? "Sim" : "Não"}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Confirmar ações importantes</dt>
            <dd className="text-[var(--text-muted)]">
              {preferences.confirmCriticalActions ? "Sim" : "Não"}
            </dd>
          </div>
        </dl>
        <div className="mt-6">
          <BigLink href="/personalize">Editar ajustes</BigLink>
        </div>
      </section>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="atividades-title"
      >
        <h2 id="atividades-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Suas atividades
        </h2>
        <p className="mt-3 text-a11y-base text-[var(--text)]">
          Tarefas em aberto: <strong>{activeTasks.length}</strong>
        </p>
        <p className="mt-2 text-a11y-base text-[var(--text)]">
          Tarefas concluídas (total): <strong>{completedTasks.length}</strong>
        </p>
        <div className="mt-6">
          <BigLink href="/tasks" variant="secondary">
            Ir para tarefas
          </BigLink>
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfilePageContent />
    </RequireAuth>
  );
}
