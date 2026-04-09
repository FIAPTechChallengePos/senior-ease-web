"use client";

import { useState } from "react";
import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";
import { BigButton } from "@/presentation/components/big-button";
import { ConfirmDialog } from "@/presentation/components/confirm-dialog";

export default function TasksPage() {
  const activeTasks = useSeniorEaseStore((s) => s.activeTasks);
  const completedTasks = useSeniorEaseStore((s) => s.completedTasks);
  const addTask = useSeniorEaseStore((s) => s.addTask);
  const toggleComplete = useSeniorEaseStore((s) => s.toggleComplete);
  const editTask = useSeniorEaseStore((s) => s.editTask);
  const guidedTaskId = useSeniorEaseStore((s) => s.guidedTaskId);
  const startGuidedFlow = useSeniorEaseStore((s) => s.startGuidedFlow);
  const preferences = useSeniorEaseStore((s) => s.preferences);
  const pushToast = useSeniorEaseStore((s) => s.pushToast);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);

  const guidedTask = activeTasks.find((t) => t.id === guidedTaskId) ?? null;

  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const reminderAt = reminder ? new Date(reminder).toISOString() : null;
    const ok = addTask({ title, description, reminderAt });
    if (ok) {
      setTitle("");
      setDescription("");
      setReminder("");
    }
  }

  function requestComplete(id: string) {
    if (preferences.confirmCriticalActions) {
      setPendingCompleteId(id);
      setConfirmOpen(true);
    } else {
      toggleComplete(id);
    }
  }

  function confirmComplete() {
    if (pendingCompleteId) toggleComplete(pendingCompleteId);
    setConfirmOpen(false);
    setPendingCompleteId(null);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-a11y-xl font-bold text-[var(--text)]">Organizador de atividades</h1>
        <p className="mt-2 text-a11y-base text-[var(--text-muted)]">
          Crie tarefas com poucos toques. Você pode seguir um passo a passo para concluir cada uma.
        </p>
      </header>

      <section
        className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-6"
        aria-labelledby="nova-title"
      >
        <h2 id="nova-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Nova tarefa
        </h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="task-title" className="block text-a11y-base font-medium text-[var(--text)]">
              Título (obrigatório)
            </label>
            <input
              id="task-title"
              className="mt-2 w-full rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-a11y-base text-[var(--text)]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="advanced-only">
            <label htmlFor="task-desc" className="block text-a11y-base font-medium text-[var(--text)]">
              Detalhes (opcional)
            </label>
            <textarea
              id="task-desc"
              className="mt-2 min-h-[100px] w-full rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-a11y-base text-[var(--text)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="task-reminder" className="block text-a11y-base font-medium text-[var(--text)]">
              Lembrete (opcional) — data e hora
            </label>
            <input
              id="task-reminder"
              type="datetime-local"
              className="mt-2 w-full max-w-md rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-a11y-base text-[var(--text)]"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            />
            <p className="mt-1 text-a11y-base text-[var(--text-muted)]">
              O lembrete fica salvo com a tarefa. Em versões futuras poderemos avisar no celular ou
              computador.
            </p>
          </div>
          <BigButton type="submit">Salvar tarefa</BigButton>
        </form>
      </section>

      <section aria-labelledby="lista-title">
        <h2 id="lista-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Suas tarefas
        </h2>
        {activeTasks.length === 0 ? (
          <p className="mt-3 text-a11y-base text-[var(--text-muted)]">
            Nenhuma tarefa ainda. Escreva um título acima e toque em &quot;Salvar tarefa&quot;.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {activeTasks.map((task) => (
              <li
                key={task.id}
                className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-4"
              >
                {editingId === task.id ? (
                  <div className="space-y-3">
                    <input
                      className="w-full rounded-xl border-2 border-[var(--border-strong)] px-3 py-2 text-a11y-base bg-[var(--surface)]"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      aria-label="Editar título"
                    />
                    <textarea
                      className="min-h-[80px] w-full rounded-xl border-2 border-[var(--border-strong)] px-3 py-2 text-a11y-base advanced-only"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      aria-label="Editar detalhes"
                    />
                    <div className="flex flex-wrap gap-2">
                      <BigButton
                        type="button"
                        onClick={() => {
                          if (
                            editTask(task.id, {
                              title: editTitle,
                              description: editDescription,
                            })
                          ) {
                            setEditingId(null);
                          }
                        }}
                      >
                        Guardar
                      </BigButton>
                      <BigButton type="button" variant="secondary" onClick={() => setEditingId(null)}>
                        Cancelar
                      </BigButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-a11y-lg font-semibold text-[var(--text)]">{task.title}</h3>
                    {task.description ? (
                      <p className="mt-2 text-a11y-base text-[var(--text-muted)] advanced-only">
                        {task.description}
                      </p>
                    ) : null}
                    {task.reminderAt ? (
                      <p className="mt-2 text-a11y-base text-[var(--text-muted)]">
                        Lembrete: {new Date(task.reminderAt).toLocaleString("pt-BR")}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <BigButton type="button" onClick={() => requestComplete(task.id)}>
                        Marcar como feita
                      </BigButton>
                      <BigButton
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setEditingId(task.id);
                          setEditTitle(task.title);
                          setEditDescription(task.description);
                        }}
                      >
                        Editar
                      </BigButton>
                      <BigButton
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          startGuidedFlow(task.id);
                          setGuidedStep(0);
                          pushToast("Modo guiado: siga os passos na tela.", "info");
                        }}
                      >
                        Passo a passo
                      </BigButton>
                      <BigButton
                        type="button"
                        variant="ghost"
                        className="advanced-only"
                        onClick={() => speak(`${task.title}. ${task.description || ""}`)}
                      >
                        Ouvir texto
                      </BigButton>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="rounded-2xl border-2 border-dashed border-[var(--success-border)] bg-[var(--success-bg)] p-6"
        aria-labelledby="historico-title"
      >
        <h2 id="historico-title" className="text-a11y-lg font-semibold text-[var(--text)]">
          Tarefas já concluídas
        </h2>
        {completedTasks.length === 0 ? (
          <p className="mt-3 text-a11y-base text-[var(--text-muted)]">
            Quando você marcar uma tarefa como feita, ela aparece aqui.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {completedTasks
              .slice()
              .reverse()
              .map((t) => (
                <li key={t.id} className="text-a11y-base text-[var(--text)]">
                  <span className="font-medium">{t.title}</span>
                  {t.completedAt ? (
                    <span className="text-[var(--text-muted)]">
                      {" "}
                      — concluída em {new Date(t.completedAt).toLocaleString("pt-BR")}
                    </span>
                  ) : null}
                </li>
              ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar conclusão"
        message="Deseja marcar esta tarefa como concluída? Você pode ver o histórico abaixo depois."
        confirmLabel="Sim, concluir"
        cancelLabel="Não"
        onConfirm={confirmComplete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingCompleteId(null);
        }}
      />

      {guidedTask ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guided-title"
        >
          <div className="w-full max-w-lg rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-xl">
            <h2 id="guided-title" className="text-a11y-xl font-bold text-[var(--text)]">
              Passo a passo
            </h2>
            <p className="mt-4 text-a11y-base text-[var(--text)]">
              {guidedStep === 0 && `Tarefa: ${guidedTask.title}. Leia com calma o que precisa ser feito.`}
              {guidedStep === 1 &&
                (guidedTask.description ||
                  "Se não houver detalhes, faça a tarefa no seu ritmo. Quando terminar, avance.")}
              {guidedStep === 2 && "Quando estiver pronto, marque como feita para registrar o sucesso."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {guidedStep > 0 ? (
                <BigButton type="button" variant="secondary" onClick={() => setGuidedStep((s) => s - 1)}>
                  Voltar
                </BigButton>
              ) : null}
              {guidedStep < 2 ? (
                <BigButton type="button" onClick={() => setGuidedStep((s) => s + 1)}>
                  Próximo passo
                </BigButton>
              ) : (
                <BigButton
                  type="button"
                  onClick={() => {
                    toggleComplete(guidedTask.id);
                    startGuidedFlow(null);
                    setGuidedStep(0);
                  }}
                >
                  Concluir tarefa
                </BigButton>
              )}
              <BigButton
                type="button"
                variant="ghost"
                onClick={() => {
                  startGuidedFlow(null);
                  setGuidedStep(0);
                }}
              >
                Sair do passo a passo
              </BigButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
