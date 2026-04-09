import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";

export function listActiveTasks(repo: TaskRepository): Task[] {
  return repo.listActive();
}

export function listCompletedTasks(repo: TaskRepository): Task[] {
  return repo.listCompleted();
}
