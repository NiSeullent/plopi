import type { Metadata } from "next";
import { Outfit, Noto_Sans_KR } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const noto = Noto_Sans_KR({
  variable: "--font-korean",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "플로피(Plopi) — 전국 호스팅 가격비교 · 퀵주문",
    template: "%s | 플로피 Plopi",
  },
  description:
    "웹호스팅 · 온라인PC · 서버 · 컨테이너 가격비교와 홈페이지 제작, 퀵주문, 입주신청까지. 대한민국 호스팅 비교 플랫폼 플로피.",
  icons: {
    icon: "/brand/plopi-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} ${noto.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/5 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold tracking-tight text-[var(--ink)]">
                plopi · 플로피
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">
                전국 웹호스팅 / 온라인PC / 서버호스팅 가격비교 · 홈페이지 제작
              </p>
            </div>
            <p className="text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} Plopi. pf.nyase.kr
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
