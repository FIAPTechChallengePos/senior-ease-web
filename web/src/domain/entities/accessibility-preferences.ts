export type FontSizePreset = "small" | "medium" | "large" | "xlarge";
export type ContrastMode = "normal" | "high";
export type SpacingPreset = "compact" | "comfortable" | "spacious";
export type InterfaceMode = "basic" | "advanced";

export type AccessibilityPreferences = {
  fontSize: FontSizePreset;
  contrast: ContrastMode;
  spacing: SpacingPreset;
  interfaceMode: InterfaceMode;
  reinforcedVisualFeedback: boolean;
  confirmCriticalActions: boolean;
  theme: "light" | "dark" | "system";
};

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  fontSize: "large",
  contrast: "normal",
  spacing: "comfortable",
  interfaceMode: "basic",
  reinforcedVisualFeedback: true,
  confirmCriticalActions: true,
  theme: "light",
};
