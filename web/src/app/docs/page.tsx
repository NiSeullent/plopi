import Link from "next/link";
import {
  UPTIME_POLICIES,
  RESIDENTIAL_PROVIDER_QUOTA_GB,
  MIN_BANDWIDTH_MBPS,
  DEPOSIT_RECOVER_DAYS,
  CACHE_REWARDS,
  formatGb,
} from "@/lib/policy";

export const metadata = { title: "문서" };

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 prose-none">
      <h1 className="text-3xl font-bold tracking-tight">플로피 문서</h1>
      <p className="mt-3 text-[var(--muted)]">
        플랫폼 규칙 · Sandbox · 배포 CLI · 쿼타 정책
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold">업타임 & 트래픽</h2>
        <ul className="space-y-2 text-sm text-[var(--muted)]">
          {UPTIME_POLICIES.map((p) => (
            <li key={p.hours} className="rounded-2xl bg-white border border-black/[0.04] px-4 py-3">
              <strong className="text-[var(--ink)]">{p.hours}시간</strong> —{" "}
              {p.mode === "test" ? "테스트 서버만" : "실서비스"} · 트래픽{" "}
              {formatGb(p.trafficCapGb)}
              {p.requiresContinuousPing ? " · 연속 핑 성공 필요" : ""}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[var(--muted)]">
          48시간 이전까지는 테스트 서버로만 동작하며 실서비스로 동작하지 않습니다.
          가정용 인터넷 Provider Quota({RESIDENTIAL_PROVIDER_QUOTA_GB}G)는 별개입니다.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold">입주 조건</h2>
        <ul className="list-disc pl-5 text-sm text-[var(--muted)] space-y-1">
          <li>최소 회선 {MIN_BANDWIDTH_MBPS}Mbps (1기가) 이상</li>
          <li>통신사: SKB / KT / U+ / 기타 + 망 회선 정보</li>
          <li>가정용 체크 시 Provider Quota {RESIDENTIAL_PROVIDER_QUOTA_GB}G</li>
          <li>공인 IP 필수 (Plopi Sandbox는 DHCP 미지원)</li>
          <li>예치금 회수: 연속 업타임 {DEPOSIT_RECOVER_DAYS}일</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold">캐시 리워드</h2>
        <ul className="text-sm text-[var(--muted)] space-y-1">
          {CACHE_REWARDS.map((c) => (
            <li key={c.cpuModel}>
              {c.cpuModel}: 월 {c.monthlyCache.toLocaleString()}캐시 (메모리·CPU·연산량 비례)
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold">배포 CLI</h2>
        <pre className="rounded-2xl bg-[#0a0a0a] text-white text-sm p-4 overflow-x-auto">{`npm i -g @plopi/deploy
plopi login
plopi deploy --kind 컨테이너호스팅 --domain app.example.com --buy-new`}</pre>
        <p className="text-sm text-[var(--muted)]">
          OAuth2로 플로피 계정 연동 후 서버 구매/기존 서버 선택(웹호스팅·컨테이너호스팅)하면
          Swarm 배포가 진행됩니다.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold">보안</h2>
        <p className="text-sm text-[var(--muted)]">
          모든 통신 데이터 및 컨테이너는 외부에서 직접 접근할 수 없도록 암호화됩니다
          (AES-256-GCM + WireGuard 메시).
        </p>
      </section>

      <div className="mt-12 flex gap-3">
        <Link href="/quick-order" className="text-sm font-semibold text-[var(--brand)]">
          퀵주문 →
        </Link>
        <Link href="/apply" className="text-sm font-semibold text-[var(--brand)]">
          입주신청 →
        </Link>
      </div>
    </div>
  );
}
