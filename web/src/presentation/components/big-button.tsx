"use client";

import Link from "next/link";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export function bigButtonClassName(
  variant: ButtonVariant = "primary",
  className?: string
): string {
  return clsx(
    "inline-flex min-h-[52px] min-w-[52px] items-center justify-center rounded-xl px-6 py-3 text-a11y-base font-semibold",
    "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2",
    "transition-transform active:scale-[0.98]",
    variant === "primary" &&
      "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] shadow-md hover:opacity-95",
    variant === "secondary" &&
      "border-2 border-[var(--border-strong)] bg-[var(--surface-muted)] text-[var(--text)]",
    variant === "ghost" && "bg-transparent text-[var(--link)] underline-offset-4 hover:underline",
    className
  );
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function BigButton({ className, variant = "primary", children, ...rest }: Props) {
  return (
    <button type="button" className={bigButtonClassName(variant, className)} {...rest}>
      {children}
    </button>
  );
}

type LinkProps = {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

export function BigLink({ href, variant = "primary", className, children }: LinkProps) {
  return (
    <Link href={href} className={bigButtonClassName(variant, className)}>
      {children}
    </Link>
  );
}
