import type { Task } from "@/domain/entities/task";

export interface TaskRepository {
  listActive(): Task[];
  listCompleted(): Task[];
  saveAll(tasks: Task[]): void;
}
