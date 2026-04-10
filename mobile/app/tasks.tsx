import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useStore } from "@/lib/store";
import { colorsFor, scaleForFont, spacingFor } from "@/lib/theme";
import { BigPressable } from "@/components/BigPressable";
import { RequireAuth } from "@/components/RequireAuth";

export default function TasksScreen() {
  return (
    <RequireAuth>
      <TasksScreenContent />
    </RequireAuth>
  );
}

function TasksScreenContent() {
  const preferences = useStore((s) => s.preferences);
  const tasks = useStore((s) => s.tasks);
  const addTask = useStore((s) => s.addTask);
  const completeTask = useStore((s) => s.completeTask);
  const colors = colorsFor(preferences);
  const scale = scaleForFont(preferences);
  const gap = spacingFor(preferences);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const active = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  async function onAdd() {
    const t = title.trim();
    if (!t) {
      Alert.alert("Título obrigatório", "Escreva um título antes de salvar.");
      return;
    }
    await addTask(title, description, null);
    setTitle("");
    setDescription("");
  }

  function onComplete(id: string, label: string) {
    const go = () => void completeTask(id);
    if (preferences.confirmCriticalActions) {
      Alert.alert("Concluir tarefa", `Marcar "${label}" como feita?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: go },
      ]);
    } else {
      go();
    }
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.bg }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card, marginBottom: gap }]}>
        <Text style={[styles.h2, { color: colors.text, fontSize: 20 * scale }]}>Nova tarefa</Text>
        <Text style={[styles.label, { color: colors.text, fontSize: 16 * scale }]}>Título</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex.: Ler o recado do dia"
          placeholderTextColor="#888"
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, fontSize: 18 * scale },
          ]}
          accessibilityLabel="Título da tarefa"
        />
        {preferences.interfaceMode === "advanced" ? (
          <>
            <Text style={[styles.label, { color: colors.text, fontSize: 16 * scale, marginTop: gap }]}>
              Detalhes
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Opcional"
              placeholderTextColor="#888"
              style={[
                styles.input,
                styles.textArea,
                { borderColor: colors.border, color: colors.text, fontSize: 18 * scale },
              ]}
              accessibilityLabel="Detalhes da tarefa"
            />
          </>
        ) : null}
        <View style={{ marginTop: gap }}>
          <BigPressable label="Salvar tarefa" colors={colors} scale={scale} onPress={() => void onAdd()} />
        </View>
      </View>

      <Text style={[styles.h2, { color: colors.text, fontSize: 20 * scale, marginBottom: gap }]}>
        Em aberto
      </Text>
      {active.length === 0 ? (
        <Text style={{ fontSize: 17 * scale, color: colors.text }}>Nenhuma tarefa ainda.</Text>
      ) : (
        active.map((t) => (
          <View
            key={t.id}
            style={[
              styles.card,
              { borderColor: colors.border, backgroundColor: colors.card, marginBottom: gap, padding: gap + 8 },
            ]}
          >
            <Text style={{ fontSize: 19 * scale, fontWeight: "700", color: colors.text }}>{t.title}</Text>
            {t.description && preferences.interfaceMode === "advanced" ? (
              <Text style={{ marginTop: 8, fontSize: 17 * scale, color: colors.text }}>{t.description}</Text>
            ) : null}
            <View style={{ marginTop: gap }}>
              <BigPressable
                label="Marcar como feita"
                colors={colors}
                scale={scale}
                onPress={() => onComplete(t.id, t.title)}
              />
            </View>
          </View>
        ))
      )}

      <Text
        style={[
          styles.h2,
          { color: colors.text, fontSize: 20 * scale, marginTop: gap * 2, marginBottom: gap },
        ]}
      >
        Concluídas
      </Text>
      {done.length === 0 ? (
        <Text style={{ fontSize: 17 * scale, color: colors.text }}>Ainda não há histórico.</Text>
      ) : (
        [...done].reverse().map((t) => (
          <Text key={t.id} style={{ fontSize: 17 * scale, color: colors.text, marginBottom: 8 }}>
            • {t.title}
          </Text>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, padding: 16 },
  card: { borderWidth: 2, borderRadius: 16, padding: 16 },
  h2: { fontWeight: "800" },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
});
