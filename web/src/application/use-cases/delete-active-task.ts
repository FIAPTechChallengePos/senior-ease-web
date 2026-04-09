import type { TaskId } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";
import { listActiveTasks, listCompletedTasks } from "@/application/use-cases/list-tasks";

/** Remove uma tarefa que ainda está em aberto. */
export function deleteActiveTask(repo: TaskRepository, id: TaskId): boolean {
  const active = listActiveTasks(repo);
  const completed = listCompletedTasks(repo);
  if (!active.some((t) => t.id === id)) return false;
  const rest = active.filter((t) => t.id !== id);
  repo.saveAll([...rest, ...completed]);
  return true;
}
