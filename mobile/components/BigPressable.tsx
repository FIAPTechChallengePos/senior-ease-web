import { forwardRef, type ComponentRef } from "react";
import {
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type Props = PressableProps & {
  label: string;
  /** Se definido, usado em leitores de tela em vez de `label` (ex.: rótulo curto na tela + frase completa no a11y). */
  accessibilityLabelOverride?: string;
  variant?: "primary" | "secondary";
  colors: { primary: string; primaryText: string; border: string; card: string; text: string };
  scale: number;
};

export const BigPressable = forwardRef<ComponentRef<typeof Pressable>, Props>(function BigPressable(
  { label, accessibilityLabelOverride, variant = "primary", colors, scale, style, ...rest },
  ref
) {
  const base: StyleProp<ViewStyle> = {
    minHeight: 52,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  };
  const vStyle: StyleProp<ViewStyle> =
    variant === "primary"
      ? { backgroundColor: colors.primary }
      : {
          backgroundColor: colors.card,
          borderWidth: 2,
          borderColor: colors.border,
        };
  const textStyle: StyleProp<TextStyle> = {
    fontSize: 18 * scale,
    fontWeight: "600",
    color: variant === "primary" ? colors.primaryText : colors.text,
  };
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabelOverride ?? label}
      style={({ pressed }) => [base, vStyle, pressed && { opacity: 0.9 }, style] as StyleProp<ViewStyle>[]}
      {...rest}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
});
