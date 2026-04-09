"use client";

import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";
import { BigButton } from "@/presentation/components/big-button";
import type {
  ContrastMode,
  FontSizePreset,
  InterfaceMode,
  SpacingPreset,
} from "@/domain/entities/accessibility-preferences";

const fontOptions: { value: FontSizePreset; label: string }[] = [
  { value: "small", label: "Pequeno" },
  { value: "medium", label: "Médio" },
  { value: "large", label: "Grande" },
  { value: "xlarge", label: "Extra grande" },
];

const spacingOptions: { value: SpacingPreset; label: string }[] = [
  { value: "compact", label: "Mais junto" },
  { value: "comfortable", label: "Confortável" },
  { value: "spacious", label: "Mais espaço" },
];

export default function PersonalizePage() {
  const preferences = useSeniorEaseStore((s) => s.preferences);
  const setPreferences = useSeniorEaseStore((s) => s.setPreferences);
  const pushToast = useSeniorEaseStore((s) => s.pushToast);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-a11y-xl font-bold text-[var(--text)]">Painel de personalização</h1>
        <p className="mt-2 text-a11y-base text-[var(--text-muted)]">
          Escolha o que deixa a tela mais fácil de enxergar e de usar. As mudanças são salvas
          automaticamente neste aparelho.
        </p>
      </header>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="font-title"
      >
        <h2 id="font-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Tamanho da letra
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {fontOptions.map((opt) => (
            <BigButton
              key={opt.value}
              variant={preferences.fontSize === opt.value ? "primary" : "secondary"}
              aria-pressed={preferences.fontSize === opt.value}
              onClick={() => {
                setPreferences({ fontSize: opt.value });
                pushToast(`Letra: ${opt.label}`, "success");
              }}
            >
              {opt.label}
            </BigButton>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="contrast-title"
      >
        <h2 id="contrast-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Contraste
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <BigButton
            variant={preferences.contrast === "normal" ? "primary" : "secondary"}
            aria-pressed={preferences.contrast === "normal"}
            onClick={() => setPreferences({ contrast: "normal" as ContrastMode })}
          >
            Normal
          </BigButton>
          <BigButton
            variant={preferences.contrast === "high" ? "primary" : "secondary"}
            aria-pressed={preferences.contrast === "high"}
            onClick={() => setPreferences({ contrast: "high" as ContrastMode })}
          >
            Alto contraste
          </BigButton>
        </div>
      </section>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="spacing-title"
      >
        <h2 id="spacing-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Espaço entre botões e blocos
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {spacingOptions.map((opt) => (
            <BigButton
              key={opt.value}
              variant={preferences.spacing === opt.value ? "primary" : "secondary"}
              aria-pressed={preferences.spacing === opt.value}
              onClick={() => setPreferences({ spacing: opt.value as SpacingPreset })}
            >
              {opt.label}
            </BigButton>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="mode-title"
      >
        <h2 id="mode-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Modo da interface
        </h2>
        <p className="mt-2 text-a11y-base text-[var(--text-muted)]">
          No modo básico, mostramos menos opções na tela para reduzir distrações.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <BigButton
            variant={preferences.interfaceMode === "basic" ? "primary" : "secondary"}
            aria-pressed={preferences.interfaceMode === "basic"}
            onClick={() => setPreferences({ interfaceMode: "basic" as InterfaceMode })}
          >
            Básico
          </BigButton>
          <BigButton
            variant={preferences.interfaceMode === "advanced" ? "primary" : "secondary"}
            aria-pressed={preferences.interfaceMode === "advanced"}
            onClick={() => setPreferences({ interfaceMode: "advanced" as InterfaceMode })}
          >
            Avançado
          </BigButton>
        </div>
      </section>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="theme-title"
      >
        <h2 id="theme-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Tema claro ou escuro
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {(
            [
              { value: "light" as const, label: "Claro" },
              { value: "dark" as const, label: "Escuro" },
              { value: "system" as const, label: "Seguir o sistema" },
            ] as const
          ).map((opt) => (
            <BigButton
              key={opt.value}
              variant={preferences.theme === opt.value ? "primary" : "secondary"}
              aria-pressed={preferences.theme === opt.value}
              onClick={() => setPreferences({ theme: opt.value })}
            >
              {opt.label}
            </BigButton>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="feedback-title"
      >
        <h2 id="feedback-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Feedback e confirmações
        </h2>
        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-start gap-3 text-a11y-base text-[var(--text)]">
            <input
              type="checkbox"
              className="mt-1 h-6 w-6 accent-[var(--btn-primary-bg)]"
              checked={preferences.reinforcedVisualFeedback}
              onChange={(e) =>
                setPreferences({ reinforcedVisualFeedback: e.target.checked })
              }
            />
            <span>Destacar mais quando eu seleciono campos e botões (contorno reforçado).</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-a11y-base text-[var(--text)]">
            <input
              type="checkbox"
              className="mt-1 h-6 w-6 accent-[var(--btn-primary-bg)]"
              checked={preferences.confirmCriticalActions}
              onChange={(e) => setPreferences({ confirmCriticalActions: e.target.checked })}
            />
            <span>Pedir confirmação antes de ações importantes (como apagar dados).</span>
          </label>
        </div>
      </section>
    </div>
  );
}
