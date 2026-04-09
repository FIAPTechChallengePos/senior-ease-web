import type { AccessibilityPreferences } from "@/domain/entities/accessibility-preferences";

export interface AccessibilityRepository {
  load(): AccessibilityPreferences | null;
  save(preferences: AccessibilityPreferences): void;
}
