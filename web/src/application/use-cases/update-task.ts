import type { Task, TaskId } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";
import { listActiveTasks, listCompletedTasks } from "@/application/use-cases/list-tasks";

export function updateTask(
  repo: TaskRepository,
  id: TaskId,
  patch: Partial<Pick<Task, "title" | "description" | "reminderAt">>
): { ok: true } | { ok: false; error: string } {
  const active = listActiveTasks(repo);
  const completed = listCompletedTasks(repo);
  const all = [...active, ...completed];
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) {
    return { ok: false, error: "Tarefa não encontrada." };
  }
  const current = all[idx];
  const title = patch.title !== undefined ? patch.title.trim() : current.title;
  if (!title) {
    return { ok: false, error: "O título não pode ficar vazio." };
  }
  const next: Task = {
    ...current,
    title,
    description:
      patch.description !== undefined ? patch.description.trim() : current.description,
    reminderAt: patch.reminderAt !== undefined ? patch.reminderAt : current.reminderAt,
  };
  const others = all.filter((t) => t.id !== id);
  const nextActive = others.filter((t) => !t.completed);
  const nextCompleted = others.filter((t) => t.completed);
  if (next.completed) {
    repo.saveAll([...nextActive, ...nextCompleted, next]);
  } else {
    repo.saveAll([...nextActive, next, ...nextCompleted]);
  }
  return { ok: true };
}
