import type { Metadata } from "next";
import { AccessibilityRoot } from "@/presentation/components/accessibility-root";
import { AppNavigation } from "@/presentation/components/app-navigation";
import { ToastStack } from "@/presentation/components/toast-stack";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeniorEase",
  description: "Plataforma acessível para idosos — estudos e trabalho com mais tranquilidade.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AccessibilityRoot>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--btn-primary-bg)] focus:px-4 focus:py-3 focus:text-[var(--btn-primary-fg)]"
          >
            Pular para o conteúdo
          </a>
          <AppNavigation />
          <main
            id="main-content"
            className="mx-auto max-w-3xl px-4 py-a11y-3"
            tabIndex={-1}
          >
            {children}
          </main>
          <ToastStack />
        </AccessibilityRoot>
      </body>
    </html>
  );
}
