import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AccessibilityPreferences, Task } from "@/lib/types";
import { DEFAULT_PREFERENCES } from "@/lib/types";
import { loadPreferences, loadTasks, savePreferences, saveTasks } from "@/lib/storage";

export type AuthUser = { name: string };

type State = {
  preferences: AccessibilityPreferences;
  tasks: Task[];
  hydrated: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  hydrate: () => Promise<void>;
  setPreferences: (p: Partial<AccessibilityPreferences>) => Promise<void>;
  login: (input: { identifier: string; password: string }) => boolean;
  logout: () => void;
  addTask: (title: string, description: string, reminderAt: string | null) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  deleteActiveTask: (id: string) => Promise<void>;
};

function newId(): string {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      preferences: { ...DEFAULT_PREFERENCES },
      tasks: [],
      hydrated: false,
      isAuthenticated: false,
      user: null,

      hydrate: async () => {
        const [preferences, tasks] = await Promise.all([loadPreferences(), loadTasks()]);
        set({ preferences, tasks, hydrated: true });
      },

      setPreferences: async (patch) => {
        const next = { ...get().preferences, ...patch };
        await savePreferences(next);
        set({ preferences: next });
      },

      login: ({ identifier, password }) => {
        const id = identifier.trim();
        const pw = password.trim();
        if (!id || !pw) return false;
        set({ isAuthenticated: true, user: { name: id } });
        return true;
      },

      logout: () => set({ isAuthenticated: false, user: null }),

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

      uncompleteTask: async (id) => {
        const tasks = get().tasks.map((x) =>
          x.id === id ? { ...x, completed: false, completedAt: null } : x
        );
        await saveTasks(tasks);
        set({ tasks });
      },

      deleteActiveTask: async (id) => {
        const list = get().tasks;
        const target = list.find((x) => x.id === id);
        if (!target || target.completed) return;
        const tasks = list.filter((x) => x.id !== id);
        await saveTasks(tasks);
        set({ tasks });
      },
    }),
    {
      name: "seniorease_auth_v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
