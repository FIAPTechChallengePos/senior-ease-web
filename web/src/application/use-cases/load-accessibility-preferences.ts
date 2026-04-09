import {
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  type AccessibilityPreferences,
} from "@/domain/entities/accessibility-preferences";
import type { AccessibilityRepository } from "@/domain/repositories/accessibility-repository";

export function loadAccessibilityPreferences(
  repo: AccessibilityRepository
): AccessibilityPreferences {
  return repo.load() ?? DEFAULT_ACCESSIBILITY_PREFERENCES;
}
