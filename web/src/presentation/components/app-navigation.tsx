"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useSeniorEaseStore } from "@/presentation/store/seniorease-store";
import { BigButton } from "@/presentation/components/big-button";

const links = [
  { href: "/", label: "Início", icon: "⌂" },
  { href: "/personalize", label: "Ajustes", icon: "⚙" },
  { href: "/tasks", label: "Tarefas", icon: "☑" },
  { href: "/profile", label: "Perfil", icon: "👤" },
];

export function AppNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useSeniorEaseStore((s) => s.isAuthenticated);
  const logout = useSeniorEaseStore((s) => s.logout);

  return (
    <nav
      className="flex flex-wrap items-center gap-a11y-2 border-b-2 border-[var(--border)] bg-[var(--surface)] px-4 py-a11y-3"
      aria-label="Principal"
    >
      {isAuthenticated
        ? links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-h-[52px] min-w-[52px] items-center gap-2 rounded-xl px-4 py-2 text-a11y-base",
                  "focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--focus-ring)]",
                  active
                    ? "bg-[var(--nav-active-bg)] font-bold text-[var(--nav-active-fg)]"
                    : "text-[var(--text)] hover:bg-[var(--surface-muted)]"
                )}
              >
                <span aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })
        : (
            <p className="max-w-[min(100%,28rem)] px-1 text-a11y-base text-[var(--text-muted)]">
              Inicie sua sessão
            </p>
          )}

      <div className="ml-auto flex items-center">
        {isAuthenticated ? (
          <BigButton
            type="button"
            variant="secondary"
            className="min-h-[52px]"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Sair
          </BigButton>
        ) : (
          <Link
            href="/login"
            className={clsx(
              "flex min-h-[52px] min-w-[52px] items-center gap-2 rounded-xl px-4 py-2 text-a11y-base font-semibold",
              "focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--focus-ring)]",
              pathname === "/login"
                ? "bg-[var(--nav-active-bg)] font-bold text-[var(--nav-active-fg)]"
                : "border-2 border-[var(--border-strong)] bg-[var(--surface-muted)] text-[var(--text)]"
            )}
          >
            <span aria-hidden>→</span>
            <span>Entrar</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
