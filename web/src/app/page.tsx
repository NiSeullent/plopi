import Link from "next/link";
import { providers } from "@/data/providers";
import { ProviderCard } from "@/components/ProviderCard";

export default function HomePage() {
  const featured = providers.slice(0, 3);

  return (
    <>
      {/* Hero — brand first, neo-modern dark plane */}
      <section className="relative overflow-hidden hero-grid noise min-h-[92vh] flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-24 h-72 w-72 rounded-full bg-[var(--brand)]/20 blur-3xl animate-float" />
          <div className="absolute left-10 bottom-20 h-56 w-56 rounded-full bg-[#ff6b4a]/15 blur-3xl animate-float delay-2" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/plopi-mark.svg" alt="" width={18} height={18} />
              플로피 · Plopi
            </div>
            <h1 className="animate-fade-up delay-1 text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              호스팅,
              <br />
              <span className="text-[var(--brand)]">한눈에 비교</span>하고
              <br />
              바로 입주하세요
            </h1>
            <p className="animate-fade-up delay-2 mt-5 max-w-md text-lg text-white/60">
              웹 · 온라인PC · 서버 · 컨테이너 가격비교와 홈페이지 제작.
              퀵주문으로 Swarm 메시까지 한 번에.
            </p>
            <div className="animate-fade-up delay-3 mt-9 flex flex-wrap gap-3">
              <Link
                href="/quick-order"
                className="animate-pulse-ring rounded-full bg-[var(--brand)] px-7 py-3.5 text-base font-semibold text-white hover:brightness-110 transition"
              >
                퀵주문 시작
              </Link>
              <Link
                href="/compare"
                className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition"
              >
                가격비교
              </Link>
            </div>
          </div>

          {/* Dominant visual plane — mesh / floppy metaphor */}
          <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
            <div className="relative h-[420px] w-[420px]">
              <div className="absolute inset-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm" />
              <div className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] bg-[var(--brand)] shadow-[0_30px_80px_rgba(107,124,255,0.45)] animate-float">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/plopi-mark.svg"
                  alt="Plopi"
                  width={120}
                  height={120}
                  className="brightness-0 invert opacity-95"
                />
              </div>
              <div className="absolute left-16 top-16 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] shadow-xl">
                Docker Swarm
              </div>
              <div className="absolute bottom-20 right-10 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] shadow-xl">
                L4 Load Balance
              </div>
              <div className="absolute bottom-28 left-8 rounded-2xl bg-[#111] px-4 py-3 text-sm font-semibold text-white border border-white/10">
                Plopi Sandbox OS
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
              지금 비교할 수 있는 업체
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              다운타임 · 영업시간 · 가격표를 한 화면에서.
            </p>
          </div>
          <Link
            href="/compare"
            className="text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            플로피가 하는 일
          </h2>
          <p className="mt-2 text-white/50">한 섹션, 하나의 목적.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "가격비교",
                d: "업체별 요금 · 트래픽 · 서버비를 산정하고 비교합니다.",
                href: "/compare",
              },
              {
                t: "퀵주문",
                d: "자체 API로 즉시 프로비저닝. Swarm + L4 라우팅.",
                href: "/quick-order",
              },
              {
                t: "입주신청",
                d: "개인·마이너 노드도 Plopi Sandbox로 메시 입주.",
                href: "/apply",
              },
            ].map((x) => (
              <Link
                key={x.t}
                href={x.href}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <div className="text-lg font-bold text-white">{x.t}</div>
                <p className="mt-2 text-sm text-white/55">{x.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
