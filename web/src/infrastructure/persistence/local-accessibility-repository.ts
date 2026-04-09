import {
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  type AccessibilityPreferences,
} from "@/domain/entities/accessibility-preferences";
import type { AccessibilityRepository } from "@/domain/repositories/accessibility-repository";

const KEY = "seniorease_accessibility_v1";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parsePreferences(raw: string | null): AccessibilityPreferences | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (!isRecord(data)) return null;
    const fontSize = data.fontSize;
    const contrast = data.contrast;
    const spacing = data.spacing;
    const interfaceMode = data.interfaceMode;
    if (
      fontSize !== "small" &&
      fontSize !== "medium" &&
      fontSize !== "large" &&
      fontSize !== "xlarge"
    )
      return null;
    if (contrast !== "normal" && contrast !== "high") return null;
    if (spacing !== "compact" && spacing !== "comfortable" && spacing !== "spacious")
      return null;
    if (interfaceMode !== "basic" && interfaceMode !== "advanced") return null;
    const theme = data.theme;
    if (theme !== "light" && theme !== "dark" && theme !== "system") return null;
    return {
      fontSize,
      contrast,
      spacing,
      interfaceMode,
      reinforcedVisualFeedback: Boolean(data.reinforcedVisualFeedback),
      confirmCriticalActions: Boolean(data.confirmCriticalActions),
      theme,
    };
  } catch {
    return null;
  }
}

export class LocalAccessibilityRepository implements AccessibilityRepository {
  load(): AccessibilityPreferences | null {
    if (typeof window === "undefined") return null;
    return parsePreferences(window.localStorage.getItem(KEY));
  }

  save(preferences: AccessibilityPreferences): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(preferences));
  }
}

export function getDefaultPreferences(): AccessibilityPreferences {
  return { ...DEFAULT_ACCESSIBILITY_PREFERENCES };
}
