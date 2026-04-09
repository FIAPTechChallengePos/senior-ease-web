import type { AccessibilityPreferences } from "@/lib/types";

export function scaleForFont(p: AccessibilityPreferences): number {
  const m: Record<AccessibilityPreferences["fontSize"], number> = {
    small: 0.9,
    medium: 1,
    large: 1.12,
    xlarge: 1.28,
  };
  return m[p.fontSize];
}

export function spacingFor(p: AccessibilityPreferences): number {
  const m: Record<AccessibilityPreferences["spacing"], number> = {
    compact: 8,
    comfortable: 12,
    spacious: 18,
  };
  return m[p.spacing];
}

export function colorsFor(p: AccessibilityPreferences) {
  const high = p.contrast === "high";
  return {
    bg: high ? "#000000" : "#f3f4f6",
    card: high ? "#ffff00" : "#ffffff",
    text: high ? "#000000" : "#111827",
    border: high ? "#000000" : "#d1d5db",
    primary: high ? "#000000" : "#1d4ed8",
    primaryText: high ? "#ffff00" : "#ffffff",
  };
}
