import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useStore } from "@/lib/store";
import { colorsFor, scaleForFont } from "@/lib/theme";

export function HeaderAuthActions() {
  const router = useRouter();
  const preferences = useStore((s) => s.preferences);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const logout = useStore((s) => s.logout);
  const colors = colorsFor(preferences);
  const scale = scaleForFont(preferences);

  const textStyle = {
    fontSize: 17 * scale,
    fontWeight: "600" as const,
    color: colors.primary,
  };

  if (isAuthenticated) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        onPress={() => {
          logout();
          router.replace("/");
        }}
        style={({ pressed }) => [{ paddingHorizontal: 12, paddingVertical: 8, opacity: pressed ? 0.75 : 1 }]}
      >
        <Text style={textStyle}>Sair</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Entrar"
      onPress={() => router.replace("/")}
      style={({ pressed }) => [{ paddingHorizontal: 12, paddingVertical: 8, opacity: pressed ? 0.75 : 1 }]}
    >
      <Text style={textStyle}>Entrar</Text>
    </Pressable>
  );
}
