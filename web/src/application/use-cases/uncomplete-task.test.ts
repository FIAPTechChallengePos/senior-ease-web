import { describe, expect, it } from "vitest";
import type { Task } from "@/domain/entities/task";
import type { TaskRepository } from "@/domain/repositories/task-repository";
import { completeTask } from "@/application/use-cases/complete-task";
import { uncompleteTask } from "@/application/use-cases/uncomplete-task";

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

describe("uncompleteTask", () => {
  it("returns false when id is not in completed list", () => {
    const repo = makeRepo();
    expect(uncompleteTask(repo, "missing")).toBe(false);
  });

  it("moves task back to active and clears completedAt", () => {
    const repo = makeRepo([
      {
        id: "a1",
        title: "Ler",
        description: "",
        completed: false,
        reminderAt: null,
        createdAt: "2020-01-01T00:00:00.000Z",
        completedAt: null,
      },
    ]);
    expect(completeTask(repo, "a1")).toBe(true);
    expect(repo.listActive()).toHaveLength(0);
    expect(repo.listCompleted()).toHaveLength(1);

    expect(uncompleteTask(repo, "a1")).toBe(true);
    expect(repo.listCompleted()).toHaveLength(0);
    const active = repo.listActive();
    expect(active).toHaveLength(1);
    expect(active[0].completed).toBe(false);
    expect(active[0].completedAt).toBeNull();
    expect(active[0].title).toBe("Ler");
  });
});
