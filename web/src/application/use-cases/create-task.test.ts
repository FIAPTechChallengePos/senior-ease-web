import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";
import { createTask } from "@/application/use-cases/create-task";

function makeRepo(initial: Task[] = []): TaskRepository {
  let tasks = [...initial];
  return {
    listActive: () => tasks.filter((t) => !t.completed),
    listCompleted: () => tasks.filter((t) => t.completed),
    saveAll: (next) => {
      tasks = [...next];
    },
  };
}

describe("createTask", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", { randomUUID: () => "test-uuid-1" });
  });

  it("rejects empty title", () => {
    const repo = makeRepo();
    const result = createTask(repo, { title: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeTruthy();
  });

  it("creates task and persists", () => {
    const repo = makeRepo();
    const result = createTask(repo, { title: "Estudar", description: "Capítulo 1" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.task.title).toBe("Estudar");
      expect(result.task.description).toBe("Capítulo 1");
      expect(result.task.completed).toBe(false);
    }
    expect(repo.listActive()).toHaveLength(1);
    expect(repo.listActive()[0].title).toBe("Estudar");
  });
});
