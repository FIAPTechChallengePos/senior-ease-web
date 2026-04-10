import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useStore } from "@/lib/store";
import { colorsFor, scaleForFont, spacingFor } from "@/lib/theme";
import { BigPressable } from "@/components/BigPressable";
import { RequireAuth } from "@/components/RequireAuth";

const L: Record<string, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
  xlarge: "Extra grande",
  normal: "Normal",
  high: "Alto",
  basic: "Básico",
  advanced: "Avançado",
};

export default function ProfileScreen() {
  return (
    <RequireAuth>
      <ProfileScreenContent />
    </RequireAuth>
  );
}

function ProfileScreenContent() {
  const preferences = useStore((s) => s.preferences);
  const tasks = useStore((s) => s.tasks);
  const user = useStore((s) => s.user);
  const colors = colorsFor(preferences);
  const scale = scaleForFont(preferences);
  const gap = spacingFor(preferences);
  const active = tasks.filter((t) => !t.completed).length;
  const done = tasks.filter((t) => t.completed).length;

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card, marginBottom: gap }]}>
        <Text style={[styles.h1, { color: colors.text, fontSize: 22 * scale }]}>Resumo</Text>
        {user ? (
          <Text style={[styles.row, { color: colors.text, fontSize: 17 * scale, marginTop: gap }]}>
            Conta: {user.name}
          </Text>
        ) : null}
        <Text style={[styles.row, { color: colors.text, fontSize: 17 * scale }]}>
          Letra: {L[preferences.fontSize]}
        </Text>
        <Text style={[styles.row, { color: colors.text, fontSize: 17 * scale }]}>
          Contraste: {L[preferences.contrast]}
        </Text>
        <Text style={[styles.row, { color: colors.text, fontSize: 17 * scale }]}>
          Modo: {L[preferences.interfaceMode]}
        </Text>
        <Text style={[styles.row, { color: colors.text, fontSize: 17 * scale }]}>
          Tarefas abertas: {active}
        </Text>
        <Text style={[styles.row, { color: colors.text, fontSize: 17 * scale }]}>
          Concluídas: {done}
        </Text>
      </View>
      <Link href="/personalize" asChild>
        <BigPressable label="Editar ajustes" colors={colors} scale={scale} />
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, padding: 16, gap: 12 },
  card: { borderWidth: 2, borderRadius: 16, padding: 20 },
  h1: { fontWeight: "800" },
  row: { marginTop: 6 },
});
