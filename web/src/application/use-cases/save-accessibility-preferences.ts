import type { AccessibilityPreferences } from "@/domain/entities/accessibility-preferences";
import type { AccessibilityRepository } from "@/domain/repositories/accessibility-repository";

export function saveAccessibilityPreferences(
  repo: AccessibilityRepository,
  preferences: AccessibilityPreferences
): void {
  repo.save(preferences);
}
