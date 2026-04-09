import { describe, expect, it } from "vitest";
import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";
import { deleteActiveTask } from "@/application/use-cases/delete-active-task";

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

describe("deleteActiveTask", () => {
  it("returns false when task is not active", () => {
    const repo = makeRepo();
    expect(deleteActiveTask(repo, "x")).toBe(false);
  });

  it("returns false when task is completed", () => {
    const repo = makeRepo([
      {
        id: "c1",
        title: "Feito",
        description: "",
        completed: true,
        reminderAt: null,
        createdAt: "2020-01-01T00:00:00.000Z",
        completedAt: "2020-01-02T00:00:00.000Z",
      },
    ]);
    expect(deleteActiveTask(repo, "c1")).toBe(false);
  });

  it("removes active task from storage", () => {
    const repo = makeRepo([
      {
        id: "a1",
        title: "Aberta",
        description: "",
        completed: false,
        reminderAt: null,
        createdAt: "2020-01-01T00:00:00.000Z",
        completedAt: null,
      },
    ]);
    expect(deleteActiveTask(repo, "a1")).toBe(true);
    expect(repo.listActive()).toHaveLength(0);
  });
});
