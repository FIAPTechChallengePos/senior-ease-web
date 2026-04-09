import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { useStore } from "@/lib/store";
import { colorsFor, scaleForFont, spacingFor } from "@/lib/theme";
import { BigPressable } from "@/components/BigPressable";
import type { AccessibilityPreferences } from "@/lib/types";

const FONT_OPTS: { key: AccessibilityPreferences["fontSize"]; label: string }[] = [
  { key: "small", label: "Pequeno" },
  { key: "medium", label: "Médio" },
  { key: "large", label: "Grande" },
  { key: "xlarge", label: "Extra grande" },
];

export default function PersonalizeScreen() {
  const preferences = useStore((s) => s.preferences);
  const setPreferences = useStore((s) => s.setPreferences);
  const colors = colorsFor(preferences);
  const scale = scaleForFont(preferences);
  const gap = spacingFor(preferences);

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.bg }]}>
      <Text style={[styles.lead, { color: colors.text, fontSize: 17 * scale, marginBottom: gap }]}>
        Escolha o que deixa a tela mais confortável. Tudo é salvo neste celular.
      </Text>

      <Section title="Tamanho da letra" colors={colors} scale={scale} gap={gap}>
        <View style={{ gap: gap * 0.75 }}>
          {FONT_OPTS.map((o) => (
            <BigPressable
              key={o.key}
              label={o.label}
              variant={preferences.fontSize === o.key ? "primary" : "secondary"}
              colors={colors}
              scale={scale}
              onPress={() => void setPreferences({ fontSize: o.key })}
            />
          ))}
        </View>
      </Section>

      <Section title="Contraste" colors={colors} scale={scale} gap={gap}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
          <BigPressable
            label="Normal"
            variant={preferences.contrast === "normal" ? "primary" : "secondary"}
            colors={colors}
            scale={scale}
            onPress={() => void setPreferences({ contrast: "normal" })}
          />
          <BigPressable
            label="Alto contraste"
            variant={preferences.contrast === "high" ? "primary" : "secondary"}
            colors={colors}
            scale={scale}
            onPress={() => void setPreferences({ contrast: "high" })}
          />
        </View>
      </Section>

      <Section title="Modo da interface" colors={colors} scale={scale} gap={gap}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
          <BigPressable
            label="Básico"
            variant={preferences.interfaceMode === "basic" ? "primary" : "secondary"}
            colors={colors}
            scale={scale}
            onPress={() => void setPreferences({ interfaceMode: "basic" })}
          />
          <BigPressable
            label="Avançado"
            variant={preferences.interfaceMode === "advanced" ? "primary" : "secondary"}
            colors={colors}
            scale={scale}
            onPress={() => void setPreferences({ interfaceMode: "advanced" })}
          />
        </View>
      </Section>

      <View
        style={[
          styles.card,
          { borderColor: colors.border, backgroundColor: colors.card, marginTop: gap, padding: gap + 8 },
        ]}
      >
        <RowSwitch
          label="Confirmar antes de concluir tarefa"
          value={preferences.confirmCriticalActions}
          onValueChange={(v) => void setPreferences({ confirmCriticalActions: v })}
          colors={colors}
          scale={scale}
        />
      </View>
    </ScrollView>
  );
}

function Section({
  title,
  children,
  colors,
  scale,
  gap,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof colorsFor>;
  scale: number;
  gap: number;
}) {
  return (
    <View
      style={[
        styles.card,
        { borderColor: colors.border, backgroundColor: colors.card, marginBottom: gap, padding: gap + 8 },
      ]}
    >
      <Text style={{ fontSize: 20 * scale, fontWeight: "700", color: colors.text }}>{title}</Text>
      <View style={{ marginTop: gap }}>{children}</View>
    </View>
  );
}

function RowSwitch({
  label,
  value,
  onValueChange,
  colors,
  scale,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  colors: ReturnType<typeof colorsFor>;
  scale: number;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Text style={{ flex: 1, fontSize: 17 * scale, color: colors.text }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        trackColor={{ true: colors.primary, false: "#ccc" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, padding: 16 },
  card: { borderWidth: 2, borderRadius: 16 },
  lead: { lineHeight: 24 },
});
