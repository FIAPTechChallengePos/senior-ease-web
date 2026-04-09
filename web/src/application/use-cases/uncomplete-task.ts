import type { Task, TaskId } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";
import { listActiveTasks, listCompletedTasks } from "@/application/use-cases/list-tasks";

/** Reverte uma tarefa concluída para o estado em aberto (espelha a lógica de `completeTask`). */
export function uncompleteTask(repo: TaskRepository, id: TaskId): boolean {
  const active = listActiveTasks(repo);
  const completed = listCompletedTasks(repo);
  const task = completed.find((t) => t.id === id);
  if (!task) return false;
  const reopened: Task = { ...task, completed: false, completedAt: null };
  const restCompleted = completed.filter((t) => t.id !== id);
  repo.saveAll([...active, reopened, ...restCompleted]);
  return true;
}
