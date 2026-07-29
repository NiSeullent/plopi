"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/compare", label: "가격비교" },
  { href: "/quick-order", label: "퀵주문", badge: "NEW" },
  { href: "/apply", label: "입주신청" },
  { href: "/build", label: "홈페이지제작" },
  { href: "/docs", label: "문서" },
  { href: "/admin", label: "관리자" },
];

export function Header({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        dark
          ? "bg-[#0a0a0a]/70 border-white/10 backdrop-blur-xl"
          : "bg-white/90 border-black/5 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Logo invert={dark} />
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-sm rounded-full transition ${
                  dark
                    ? active
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                    : active
                      ? "text-[var(--ink)] bg-[var(--soft)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/[0.03]"
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-0.5 rounded-full bg-[#FF4D6A] px-1.5 text-[9px] font-bold text-white leading-4">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/quick-order"
          className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition"
        >
          시작하기
        </Link>
      </div>
    </header>
  );
}
