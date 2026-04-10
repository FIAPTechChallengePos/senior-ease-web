import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useStore } from "@/lib/store";
import { colorsFor, scaleForFont, spacingFor } from "@/lib/theme";
import { BigPressable } from "@/components/BigPressable";
import { GuestOnly } from "@/components/GuestOnly";
import type { ContrastMode, FontSizePreset } from "@/lib/types";

/** Mesma lógica da web: "grande" usa xlarge; "normal" usa medium nesta tela. */
const LOGIN_FONT_NORMAL: FontSizePreset = "medium";
const LOGIN_FONT_LARGE: FontSizePreset = "xlarge";

export default function LoginScreen() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  );
}

function LoginForm() {
  const router = useRouter();
  const preferences = useStore((s) => s.preferences);
  const setPreferences = useStore((s) => s.setPreferences);
  const login = useStore((s) => s.login);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const colors = colorsFor(preferences);
  const scale = scaleForFont(preferences);
  const gap = spacingFor(preferences);
  const isLargeElements = preferences.fontSize === LOGIN_FONT_LARGE;
  const isHighContrast = preferences.contrast === "high";

  const inputPad = isLargeElements ? 14 : 12;
  const inputMinH = isLargeElements ? 56 : 52;
  const inputFont = isLargeElements ? 20 * scale : 18 * scale;

  function handleSubmit() {
    const id = identifier.trim();
    const pw = password.trim();
    if (!id || !pw) {
      setShowError(true);
      return;
    }
    setShowError(false);
    if (login({ identifier: id, password: pw })) {
      router.replace("/");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.bg }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
              padding: isLargeElements ? 22 : 18,
              gap: isLargeElements ? 20 : 16,
            },
          ]}
        >
          <View>
            <Text style={[styles.h1, { color: colors.text, fontSize: 24 * scale }]}>Entrar no SeniorEase</Text>
            <Text style={[styles.lead, { color: colors.text, fontSize: 17 * scale, marginTop: gap }]}>
              Ajuste o tamanho e o contraste aqui mesmo antes de continuar.
            </Text>
          </View>

          <View
            style={[
              styles.a11yBox,
              {
                borderColor: colors.border,
                backgroundColor: highContrastMuted(colors, isHighContrast),
                padding: gap + 4,
                gap: isLargeElements ? 16 : 12,
              },
            ]}
          >
            <Text style={[styles.h2, { color: colors.text, fontSize: 20 * scale }]}>Acessibilidade nesta tela</Text>

            <View style={{ gap: isLargeElements ? 12 : 8 }}>
              <Text style={[styles.label, { color: colors.text, fontSize: 16 * scale }]}>Tamanho dos elementos</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
                <BigPressable
                  label="Tamanho normal"
                  variant={!isLargeElements ? "primary" : "secondary"}
                  colors={colors}
                  scale={scale}
                  onPress={() => void setPreferences({ fontSize: LOGIN_FONT_NORMAL })}
                  accessibilityState={{ selected: !isLargeElements }}
                />
                <BigPressable
                  label="Tamanho grande"
                  variant={isLargeElements ? "primary" : "secondary"}
                  colors={colors}
                  scale={scale}
                  onPress={() => void setPreferences({ fontSize: LOGIN_FONT_LARGE })}
                  accessibilityState={{ selected: isLargeElements }}
                />
              </View>
            </View>

            <View style={{ gap: isLargeElements ? 12 : 8 }}>
              <Text style={[styles.label, { color: colors.text, fontSize: 16 * scale }]}>Contraste</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
                <BigPressable
                  label="Contraste normal"
                  variant={!isHighContrast ? "primary" : "secondary"}
                  colors={colors}
                  scale={scale}
                  onPress={() => void setPreferences({ contrast: "normal" as ContrastMode })}
                  accessibilityState={{ selected: !isHighContrast }}
                />
                <BigPressable
                  label="Alto contraste"
                  variant={isHighContrast ? "primary" : "secondary"}
                  colors={colors}
                  scale={scale}
                  onPress={() => void setPreferences({ contrast: "high" as ContrastMode })}
                  accessibilityState={{ selected: isHighContrast }}
                />
              </View>
            </View>
          </View>

          <View style={{ gap: isLargeElements ? 18 : 14 }}>
            <View>
              <Text style={[styles.label, { color: colors.text, fontSize: 16 * scale }]}>Nome ou email</Text>
              <TextInput
                value={identifier}
                onChangeText={(t) => {
                  setIdentifier(t);
                  if (showError) setShowError(false);
                }}
                placeholder="Como prefere ser chamado ou seu email"
                placeholderTextColor="#888"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    minHeight: inputMinH,
                    paddingHorizontal: inputPad + 4,
                    paddingVertical: inputPad,
                    fontSize: inputFont,
                    marginTop: 8,
                  },
                ]}
                accessibilityLabel="Nome ou email"
              />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.text, fontSize: 16 * scale }]}>Senha</Text>
              <TextInput
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (showError) setShowError(false);
                }}
                placeholder="Digite sua senha"
                placeholderTextColor="#888"
                secureTextEntry
                textContentType="password"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    minHeight: inputMinH,
                    paddingHorizontal: inputPad + 4,
                    paddingVertical: inputPad,
                    fontSize: inputFont,
                    marginTop: 8,
                  },
                ]}
                accessibilityLabel="Senha"
              />
            </View>

            {showError ? (
              <View
                style={[
                  styles.errorBox,
                  {
                    borderColor: colors.border,
                    backgroundColor: highContrastMuted(colors, isHighContrast),
                  },
                ]}
                accessibilityRole="alert"
              >
                <Text style={{ color: colors.text, fontSize: 17 * scale, fontWeight: "600" }}>
                  Por favor, preencha os campos
                </Text>
              </View>
            ) : null}

            <BigPressable label="Entrar" colors={colors} scale={scale} onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function highContrastMuted(
  colors: ReturnType<typeof colorsFor>,
  isHigh: boolean
): string {
  if (isHigh) return "#e5e500";
  return "#f3f4f6";
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  card: {
    borderWidth: 2,
    borderRadius: 16,
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },
  a11yBox: {
    borderWidth: 1,
    borderRadius: 12,
  },
  h1: { fontWeight: "800" },
  h2: { fontWeight: "700" },
  lead: { lineHeight: 24 },
  label: { fontWeight: "600" },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    width: "100%",
  },
  errorBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
  },
});
