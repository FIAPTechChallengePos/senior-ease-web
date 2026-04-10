import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AccessibilityPreferences, Task } from "@/lib/types";
import { DEFAULT_PREFERENCES } from "@/lib/types";

const PREF_KEY = "seniorease_accessibility_v1";
const TASK_KEY = "seniorease_tasks_v1";

function normalizeTask(entry: unknown): Task | null {
  if (!entry || typeof entry !== "object") return null;
  const o = entry as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string") return null;
  const createdAt =
    typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString();
  const reminderAt =
    o.reminderAt === null || typeof o.reminderAt === "string" ? o.reminderAt : null;
  const completedAt =
    o.completedAt === null || typeof o.completedAt === "string" ? o.completedAt : null;
  return {
    id: o.id,
    title: o.title,
    description: typeof o.description === "string" ? o.description : "",
    completed: Boolean(o.completed),
    reminderAt,
    createdAt,
    completedAt,
  };
}

export async function loadPreferences(): Promise<AccessibilityPreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREF_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const data = JSON.parse(raw) as AccessibilityPreferences;
    return { ...DEFAULT_PREFERENCES, ...data };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export async function savePreferences(p: AccessibilityPreferences): Promise<void> {
  await AsyncStorage.setItem(PREF_KEY, JSON.stringify(p));
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASK_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.map(normalizeTask).filter((t): t is Task => t !== null);
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}
