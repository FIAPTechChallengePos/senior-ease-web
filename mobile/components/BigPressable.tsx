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
  variant?: "primary" | "secondary";
  colors: { primary: string; primaryText: string; border: string; card: string; text: string };
  scale: number;
};

export function BigPressable({
  label,
  variant = "primary",
  colors,
  scale,
  style,
  ...rest
}: Props) {
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
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [base, vStyle, pressed && { opacity: 0.9 }, style]}
      {...rest}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}
