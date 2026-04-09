export type TaskId = string;

export type Task = {
  id: TaskId;
  title: string;
  description: string;
  completed: boolean;
  reminderAt: string | null;
  createdAt: string;
  completedAt: string | null;
};

export function createTaskDraft(input: {
  title: string;
  description?: string;
  reminderAt?: string | null;
}): Omit<Task, "id" | "createdAt" | "completedAt" | "completed"> {
  return {
    title: input.title.trim(),
    description: (input.description ?? "").trim(),
    reminderAt: input.reminderAt ?? null,
  };
}
