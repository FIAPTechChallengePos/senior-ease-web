import Link from "next/link";
import { BigLink } from "@/presentation/components/big-button";
import { AssistedOnboarding } from "@/presentation/components/assisted-onboarding";

export function HomeContent() {
  return (
    <div className="space-y-6">
      <AssistedOnboarding />
      <header className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h1 className="text-a11y-xl font-bold text-[var(--text)]">Bem-vindo ao SeniorEase</h1>
        <p className="mt-3 text-a11y-base text-[var(--text-muted)]">
          Um ambiente simples para organizar suas tarefas e ajustar a tela do jeito que fica mais
          confortável para você.
        </p>
      </header>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="passos-title"
      >
        <h2 id="passos-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Por onde começar
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-a11y-base text-[var(--text)]">
          <li>
            Ajuste letras, contraste e espaçamento em{" "}
            <Link className="font-semibold text-[var(--link)] underline" href="/personalize">
              Ajustes
            </Link>
            .
          </li>
          <li>
            Crie sua primeira tarefa em{" "}
            <Link className="font-semibold text-[var(--link)] underline" href="/tasks">
              Tarefas
            </Link>{" "}
            e siga o passo a passo se quiser.
          </li>
          <li>
            Veja um resumo das suas preferências em{" "}
            <Link className="font-semibold text-[var(--link)] underline" href="/profile">
              Perfil
            </Link>
            .
          </li>
        </ol>
      </section>

      <div className="flex flex-wrap gap-3">
        <BigLink href="/personalize">Abrir ajustes de acessibilidade</BigLink>
        <BigLink href="/tasks" variant="secondary">
          Ir para tarefas
        </BigLink>
      </div>

      <p className="text-a11y-base text-[var(--text-muted)]">
        Dica: se algo não ficar claro, use os botões grandes com texto — eles levam às principais
        áreas do app.
      </p>
    </div>
  );
}
