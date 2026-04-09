import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import {
  type AccessibilityPreferences,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
} from "@/domain/entities/accessibility-preferences";
import type { Task } from "@/domain/entities/task";
import { LocalAccessibilityRepository } from "@/infrastructure/persistence/local-accessibility-repository";
import { LocalTaskRepository } from "@/infrastructure/persistence/local-task-repository";
import { loadAccessibilityPreferences } from "@/application/use-cases/load-accessibility-preferences";
import { saveAccessibilityPreferences } from "@/application/use-cases/save-accessibility-preferences";
import { createTask } from "@/application/use-cases/create-task";
import { completeTask } from "@/application/use-cases/complete-task";
import { uncompleteTask as applyUncompleteTask } from "@/application/use-cases/uncomplete-task";
import { updateTask } from "@/application/use-cases/update-task";
import { deleteActiveTask as applyDeleteActiveTask } from "@/application/use-cases/delete-active-task";
import { listActiveTasks, listCompletedTasks } from "@/application/use-cases/list-tasks";

const accessibilityRepo = new LocalAccessibilityRepository();
const taskRepo = new LocalTaskRepository();

export type ToastMessage = { id: string; text: string; variant: "success" | "info" };

export type AuthUser = { name: string };

type State = {
  preferences: AccessibilityPreferences;
  activeTasks: Task[];
  completedTasks: Task[];
  toasts: ToastMessage[];
  hydrated: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  setPreferences: (next: Partial<AccessibilityPreferences>) => void;
  hydrate: () => void;
  login: (input: { identifier: string; password: string }) => boolean;
  logout: () => void;
  addTask: (input: { title: string; description?: string; reminderAt?: string | null }) => boolean;
  toggleComplete: (id: string) => void;
  uncompleteTask: (id: string) => void;
  deleteActiveTask: (id: string) => void;
  editTask: (
    id: string,
    patch: Partial<Pick<Task, "title" | "description" | "reminderAt">>
  ) => boolean;
  pushToast: (text: string, variant?: ToastMessage["variant"]) => void;
  dismissToast: (id: string) => void;
};

let toastSeq = 0;

const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useSeniorEaseStore = create<State>()(
  persist(
    (set, get) => ({
      preferences: { ...DEFAULT_ACCESSIBILITY_PREFERENCES },
      activeTasks: [],
      completedTasks: [],
      toasts: [],
      hydrated: false,
      isAuthenticated: false,
      user: null,

      hydrate: () => {
        const preferences = loadAccessibilityPreferences(accessibilityRepo);
        set({
          preferences,
          activeTasks: listActiveTasks(taskRepo),
          completedTasks: listCompletedTasks(taskRepo),
          hydrated: true,
        });
      },

      setPreferences: (next) => {
        const merged = { ...get().preferences, ...next };
        saveAccessibilityPreferences(accessibilityRepo, merged);
        set({ preferences: merged });
      },

      login: ({ identifier, password }) => {
        const id = identifier.trim();
        const pw = password.trim();
        if (!id || !pw) return false;
        set({ isAuthenticated: true, user: { name: id } });
        return true;
      },

      logout: () => set({ isAuthenticated: false, user: null }),

      addTask: (input) => {
        const result = createTask(taskRepo, input);
        if (!result.ok) {
          get().pushToast(result.error, "info");
          return false;
        }
        set({
          activeTasks: listActiveTasks(taskRepo),
          completedTasks: listCompletedTasks(taskRepo),
        });
        get().pushToast("Tarefa criada com sucesso.", "success");
        return true;
      },

      toggleComplete: (id) => {
        const task = get().activeTasks.find((t) => t.id === id);
        if (!task) return;
        const ok = completeTask(taskRepo, id);
        if (ok) {
          set({
            activeTasks: listActiveTasks(taskRepo),
            completedTasks: listCompletedTasks(taskRepo),
          });
          get().pushToast("Ótimo! Tarefa concluída.", "success");
        }
      },

      uncompleteTask: (id) => {
        const ok = applyUncompleteTask(taskRepo, id);
        if (ok) {
          set({
            activeTasks: listActiveTasks(taskRepo),
            completedTasks: listCompletedTasks(taskRepo),
          });
          get().pushToast("Tarefa voltou para em aberto.", "success");
        }
      },

      deleteActiveTask: (id) => {
        const ok = applyDeleteActiveTask(taskRepo, id);
        if (!ok) return;
        set({
          activeTasks: listActiveTasks(taskRepo),
          completedTasks: listCompletedTasks(taskRepo),
        });
        get().pushToast("Tarefa excluída.", "success");
      },

      editTask: (id, patch) => {
        const result = updateTask(taskRepo, id, patch);
        if (!result.ok) {
          get().pushToast(result.error, "info");
          return false;
        }
        set({
          activeTasks: listActiveTasks(taskRepo),
          completedTasks: listCompletedTasks(taskRepo),
        });
        get().pushToast("Alterações salvas.", "success");
        return true;
      },

      pushToast: (text, variant = "info") => {
        const id = `toast_${++toastSeq}`;
        set((s) => ({ toasts: [...s.toasts, { id, text, variant }] }));
        setTimeout(() => get().dismissToast(id), 4000);
      },

      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "seniorease_auth_v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : serverStorage
      ),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
