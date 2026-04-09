import { create } from "zustand";
import type { AccessibilityPreferences, Task } from "@/lib/types";
import { DEFAULT_PREFERENCES } from "@/lib/types";
import { loadPreferences, loadTasks, savePreferences, saveTasks } from "@/lib/storage";

type State = {
  preferences: AccessibilityPreferences;
  tasks: Task[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setPreferences: (p: Partial<AccessibilityPreferences>) => Promise<void>;
  addTask: (title: string, description: string, reminderAt: string | null) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
};

function newId(): string {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useStore = create<State>((set, get) => ({
  preferences: { ...DEFAULT_PREFERENCES },
  tasks: [],
  hydrated: false,

  hydrate: async () => {
    const [preferences, tasks] = await Promise.all([loadPreferences(), loadTasks()]);
    set({ preferences, tasks, hydrated: true });
  },

  setPreferences: async (patch) => {
    const next = { ...get().preferences, ...patch };
    await savePreferences(next);
    set({ preferences: next });
  },

  addTask: async (title, description, reminderAt) => {
    const t = title.trim();
    if (!t) return;
    const now = new Date().toISOString();
    const task: Task = {
      id: newId(),
      title: t,
      description: description.trim(),
      completed: false,
      reminderAt,
      createdAt: now,
      completedAt: null,
    };
    const tasks = [...get().tasks, task];
    await saveTasks(tasks);
    set({ tasks });
  },

  completeTask: async (id) => {
    const now = new Date().toISOString();
    const tasks = get().tasks.map((x) =>
      x.id === id ? { ...x, completed: true, completedAt: now } : x
    );
    await saveTasks(tasks);
    set({ tasks });
  },
}));
