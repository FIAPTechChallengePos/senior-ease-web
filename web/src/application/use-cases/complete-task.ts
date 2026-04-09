import type { Task, TaskId } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";
import { listActiveTasks, listCompletedTasks } from "@/application/use-cases/list-tasks";

export function completeTask(repo: TaskRepository, id: TaskId): boolean {
  const active = listActiveTasks(repo);
  const completed = listCompletedTasks(repo);
  const task = active.find((t) => t.id === id);
  if (!task) return false;
  const now = new Date().toISOString();
  const done: Task = { ...task, completed: true, completedAt: now };
  const restActive = active.filter((t) => t.id !== id);
  repo.saveAll([...restActive, ...completed, done]);
  return true;
}
