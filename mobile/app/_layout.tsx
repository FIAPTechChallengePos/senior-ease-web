import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useStore } from "@/lib/store";
import { HeaderAuthActions } from "@/components/HeaderAuthActions";

export default function RootLayout() {
  const hydrate = useStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerTitleStyle: { fontSize: 20, fontWeight: "700" },
          headerBackTitle: "Voltar",
          headerRight: () => <HeaderAuthActions />,
        }}
      >
        <Stack.Screen name="index" options={{ title: "SeniorEase" }} />
        <Stack.Screen name="login" options={{ title: "Entrar", headerRight: () => null }} />
        <Stack.Screen name="personalize" options={{ title: "Ajustes" }} />
        <Stack.Screen name="tasks" options={{ title: "Tarefas" }} />
        <Stack.Screen name="profile" options={{ title: "Perfil" }} />
      </Stack>
    </>
  );
}
