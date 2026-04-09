import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AccessibilityPreferences, Task } from "@/lib/types";
import { DEFAULT_PREFERENCES } from "@/lib/types";

const PREF_KEY = "seniorease_accessibility_v1";
const TASK_KEY = "seniorease_tasks_v1";

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
    const data = JSON.parse(raw) as Task[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}
