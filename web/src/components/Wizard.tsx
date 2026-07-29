"use client";

import { ReactNode } from "react";

export function SelectCard({
  selected,
  onClick,
  title,
  description,
  right,
}: {
  selected?: boolean;
  onClick?: () => void;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-[1.35rem] px-5 py-4 transition-all duration-200 border ${
        selected
          ? "bg-white text-[var(--ink)] border-transparent shadow-[0_0_0_3px_rgba(107,124,255,0.45)]"
          : "bg-white text-[var(--ink)] border-transparent hover:shadow-[0_0_0_2px_rgba(255,255,255,0.25)]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[1.05rem] font-semibold tracking-tight">
            {title}
          </div>
          {description && (
            <div className="mt-1 text-sm text-[var(--muted)]">{description}</div>
          )}
        </div>
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
            selected
              ? "border-[var(--brand)] bg-[var(--brand)] text-white"
              : "border-black/15 text-transparent"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7.2L5.8 10L11 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {right}
    </button>
  );
}

export function WizardShell({
  hint,
  title,
  children,
  footer,
}: {
  hint?: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0a0a0a] text-white">
      <div className="mx-auto flex max-w-lg flex-col px-5 pb-16 pt-16 md:pt-24">
        {hint && (
          <p className="mb-3 text-sm text-white/45 animate-fade-up">{hint}</p>
        )}
        <h1 className="mb-8 text-[1.85rem] font-bold leading-snug tracking-tight animate-fade-up delay-1">
          {title}
        </h1>
        <div className="flex flex-col gap-3 animate-fade-up delay-2">
          {children}
        </div>
        {footer && <div className="mt-8 animate-fade-up delay-3">{footer}</div>}
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  disabled,
  onClick,
  href,
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
}) {
  const className = `flex w-full items-center justify-center rounded-[1.1rem] px-5 py-4 text-[1.05rem] font-semibold transition ${
    disabled
      ? "bg-[#9AA6FF]/40 text-white/70 cursor-not-allowed"
      : "bg-[var(--brand)] text-white hover:brightness-110 active:scale-[0.99]"
  }`;

  if (href && !disabled) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
