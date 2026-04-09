import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";

const KEY = "seniorease_tasks_v1";

function normalizeTask(raw: unknown): Task | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string" || typeof o.completed !== "boolean") {
    return null;
  }
  return {
    id: o.id,
    title: o.title,
    description: typeof o.description === "string" ? o.description : "",
    completed: o.completed,
    reminderAt: o.reminderAt === null || typeof o.reminderAt === "string" ? o.reminderAt : null,
    createdAt: typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString(),
    completedAt: o.completedAt === null || typeof o.completedAt === "string" ? o.completedAt : null,
  };
}

function parseTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeTask).filter((t): t is Task => t !== null);
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
      return parseTasks(data);
    } catch {
      return [];
    }
  }
}
