import { create } from "zustand";
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
import { updateTask } from "@/application/use-cases/update-task";
import { listActiveTasks, listCompletedTasks } from "@/application/use-cases/list-tasks";

const accessibilityRepo = new LocalAccessibilityRepository();
const taskRepo = new LocalTaskRepository();

export type ToastMessage = { id: string; text: string; variant: "success" | "info" };

type State = {
  preferences: AccessibilityPreferences;
  activeTasks: Task[];
  completedTasks: Task[];
  toasts: ToastMessage[];
  guidedTaskId: string | null;
  hydrated: boolean;
  setPreferences: (next: Partial<AccessibilityPreferences>) => void;
  hydrate: () => void;
  addTask: (input: { title: string; description?: string; reminderAt?: string | null }) => boolean;
  toggleComplete: (id: string) => void;
  editTask: (
    id: string,
    patch: Partial<Pick<Task, "title" | "description" | "reminderAt">>
  ) => boolean;
  startGuidedFlow: (id: string | null) => void;
  pushToast: (text: string, variant?: ToastMessage["variant"]) => void;
  dismissToast: (id: string) => void;
};

let toastSeq = 0;

export const useSeniorEaseStore = create<State>((set, get) => ({
  preferences: { ...DEFAULT_ACCESSIBILITY_PREFERENCES },
  activeTasks: [],
  completedTasks: [],
  toasts: [],
  guidedTaskId: null,
  hydrated: false,

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

  startGuidedFlow: (id) => set({ guidedTaskId: id }),

  pushToast: (text, variant = "info") => {
    const id = `toast_${++toastSeq}`;
    set((s) => ({ toasts: [...s.toasts, { id, text, variant }] }));
    setTimeout(() => get().dismissToast(id), 4000);
  },

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
