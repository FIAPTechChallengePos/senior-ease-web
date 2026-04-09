"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Início", icon: "⌂" },
  { href: "/personalize", label: "Ajustes", icon: "⚙" },
  { href: "/tasks", label: "Tarefas", icon: "☑" },
  { href: "/profile", label: "Perfil", icon: "👤" },
];

export function AppNavigation() {
  const pathname = usePathname();
  return (
    <nav
      className="flex flex-wrap gap-a11y-2 border-b-2 border-[var(--border)] bg-[var(--surface)] px-4 py-a11y-3"
      aria-label="Principal"
    >
      {links.map((item) => {
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
      })}
    </nav>
  );
}
