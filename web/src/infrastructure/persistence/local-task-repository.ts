import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";

const KEY = "seniorease_tasks_v1";

function isTaskArray(v: unknown): v is Task[] {
  if (!Array.isArray(v)) return false;
  return v.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Task).id === "string" &&
      typeof (item as Task).title === "string" &&
      typeof (item as Task).completed === "boolean"
  );
}

export class LocalTaskRepository implements TaskRepository {
  listActive(): Task[] {
    return this.readAll().filter((t) => !t.completed);
  }

  listCompleted(): Task[] {
    return this.readAll().filter((t) => t.completed);
  }

  saveAll(tasks: Task[]): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(tasks));
  }

  private readAll(): Task[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return [];
      const data = JSON.parse(raw) as unknown;
      return isTaskArray(data) ? data : [];
    } catch {
      return [];
    }
  }
}
