import { Alert, Platform } from "react-native";

/**
 * Confirma ações sensíveis. Em iOS/Android usa `Alert.alert`.
 * Na web (`Platform.OS === 'web'`), o `Alert.alert` do core não está implementado — usa `window.confirm`.
 */
export function runCriticalAction(
  confirmCriticalActions: boolean,
  alertTitle: string,
  message: string,
  onConfirm: () => void | Promise<void>
): void {
  const go = () => void Promise.resolve(onConfirm());

  if (!confirmCriticalActions) {
    go();
    return;
  }

  if (Platform.OS === "web") {
    const text = message ? `${alertTitle}\n\n${message}` : alertTitle;
    const ok = typeof globalThis.confirm === "function" ? globalThis.confirm(text) : false;
    if (ok) go();
    return;
  }

  Alert.alert(alertTitle, message, [
    { text: "Cancelar", style: "cancel" },
    { text: "Sim", onPress: go },
  ]);
}
