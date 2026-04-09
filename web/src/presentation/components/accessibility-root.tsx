"use client";

import { useEffect } from "react";
import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";
import type {
  FontSizePreset,
  SpacingPreset,
} from "@/domain/entities/accessibility-preferences";

const fontVars: Record<FontSizePreset, { base: string; lg: string; xl: string }> = {
  small: { base: "0.95rem", lg: "1.05rem", xl: "1.15rem" },
  medium: { base: "1.05rem", lg: "1.2rem", xl: "1.35rem" },
  large: { base: "1.15rem", lg: "1.35rem", xl: "1.55rem" },
  xlarge: { base: "1.3rem", lg: "1.55rem", xl: "1.85rem" },
};

const spacingVars: Record<SpacingPreset, { s1: string; s2: string; s3: string }> = {
  compact: { s1: "0.35rem", s2: "0.65rem", s3: "1rem" },
  comfortable: { s1: "0.5rem", s2: "0.9rem", s3: "1.35rem" },
  spacious: { s1: "0.75rem", s2: "1.2rem", s3: "1.75rem" },
};

export function AccessibilityRoot({ children }: { children: React.ReactNode }) {
  const preferences = useSeniorEaseStore((s) => s.preferences);
  const hydrate = useSeniorEaseStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const root = document.documentElement;
    const fonts = fontVars[preferences.fontSize];
    const spaces = spacingVars[preferences.spacing];
    root.style.setProperty("--a11y-font-base", fonts.base);
    root.style.setProperty("--a11y-font-lg", fonts.lg);
    root.style.setProperty("--a11y-font-xl", fonts.xl);
    root.style.setProperty("--a11y-spacing-1", spaces.s1);
    root.style.setProperty("--a11y-spacing-2", spaces.s2);
    root.style.setProperty("--a11y-spacing-3", spaces.s3);
    root.dataset.contrast = preferences.contrast;
    root.dataset.interface = preferences.interfaceMode;
    root.dataset.reinforced = preferences.reinforcedVisualFeedback ? "on" : "off";
    const dark =
      preferences.theme === "dark" ||
      (preferences.theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light";
  }, [preferences]);

  useEffect(() => {
    if (preferences.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.dataset.theme = mq.matches ? "dark" : "light";
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preferences.theme]);

  return <>{children}</>;
}
