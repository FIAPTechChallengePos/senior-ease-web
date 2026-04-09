import { createTaskDraft, type Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";
import { listActiveTasks, listCompletedTasks } from "@/application/use-cases/list-tasks";

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createTask(
  repo: TaskRepository,
  input: { title: string; description?: string; reminderAt?: string | null }
): { ok: true; task: Task } | { ok: false; error: string } {
  const draft = createTaskDraft(input);
  if (!draft.title) {
    return { ok: false, error: "Informe um título para a tarefa." };
  }

  const active = listActiveTasks(repo);
  const completed = listCompletedTasks(repo);
  const now = new Date().toISOString();
  const task: Task = {
    id: newId(),
    title: draft.title,
    description: draft.description,
    completed: false,
    reminderAt: draft.reminderAt,
    createdAt: now,
    completedAt: null,
  };
  repo.saveAll([...active, task, ...completed]);
  return { ok: true, task };
}
