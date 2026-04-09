import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useStore } from "@/lib/store";
import { colorsFor, scaleForFont, spacingFor } from "@/lib/theme";
import { BigPressable } from "@/components/BigPressable";

export default function HomeScreen() {
  const preferences = useStore((s) => s.preferences);
  const colors = colorsFor(preferences);
  const scale = scaleForFont(preferences);
  const gap = spacingFor(preferences);

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card, marginBottom: gap }]}>
        <Text style={[styles.h1, { color: colors.text, fontSize: 24 * scale }]}>Bem-vindo</Text>
        <Text style={[styles.p, { color: colors.text, fontSize: 18 * scale, marginTop: gap }]}>
          Toque nos botões abaixo. Letras e contraste vêm dos ajustes salvos no aparelho.
        </Text>
      </View>
      <View style={{ gap }}>
        <Link href="/personalize" asChild>
          <BigPressable label="Abrir ajustes de acessibilidade" colors={colors} scale={scale} />
        </Link>
        <Link href="/tasks" asChild>
          <BigPressable
            label="Organizar tarefas"
            variant="secondary"
            colors={colors}
            scale={scale}
          />
        </Link>
        <Link href="/profile" asChild>
          <BigPressable label="Ver perfil" variant="secondary" colors={colors} scale={scale} />
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, padding: 16 },
  card: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
  },
  h1: { fontWeight: "800" },
  p: { lineHeight: 26 },
});
