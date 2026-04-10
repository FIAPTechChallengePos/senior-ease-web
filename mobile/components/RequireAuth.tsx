import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useStore } from "@/lib/store";

type Props = { children: ReactNode };

/** Após reidratar o persist: sem sessão, envia para `/login`. */
export function RequireAuth({ children }: Props) {
  const router = useRouter();
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useStore.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useStore.persist.onFinishHydration(() => {
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 24 }}
        accessibilityLabel="Carregando"
      >
        <ActivityIndicator size="large" accessibilityLabel="A carregar" />
        <Text style={{ fontSize: 17 }}>Carregando…</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
