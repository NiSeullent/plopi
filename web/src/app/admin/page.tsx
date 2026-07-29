import Link from "next/link";
import { listApplies, listOrders } from "@/lib/store";
import { providers } from "@/data/providers";
import { UPTIME_POLICIES, formatGb } from "@/lib/policy";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const orders = listOrders();
  const applies = listApplies();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-3xl font-bold tracking-tight">관리자</h1>
      <p className="mt-2 text-[var(--muted)]">
        퀵주문 · 입주신청 · 업체 현황을 한곳에서.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="퀵주문" value={String(orders.length)} href="/admin/orders" />
        <Stat label="입주신청" value={String(applies.length)} href="/admin" />
        <Stat label="등록 업체" value={String(providers.length)} href="/admin/providers" />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">최근 퀵주문</h2>
          <Link href="/admin/orders" className="text-sm text-[var(--brand)] font-semibold">
            전체 →
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-[1.4rem] bg-white border border-black/[0.04]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--canvas)] text-left text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">모드</th>
                <th className="px-4 py-3">트래픽 상한</th>
                <th className="px-4 py-3">암호화</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-t border-black/[0.04]">
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        o.mode === "live"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {o.mode === "live" ? "실서비스" : "테스트 서버"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatGb(o.trafficCapGb)}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{o.encryption}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">입주신청</h2>
        <div className="mt-4 space-y-3">
          {applies.length === 0 && (
            <p className="text-sm text-[var(--muted)]">아직 신청이 없습니다.</p>
          )}
          {applies.slice(0, 10).map((a) => (
            <div
              key={a.id}
              className="rounded-2xl bg-white border border-black/[0.04] px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">
                  {a.name} · {a.isp} · {a.bandwidthMbps}Mbps
                </div>
                <span className="text-xs text-[var(--muted)] font-mono">{a.id}</span>
              </div>
              <div className="mt-1 text-[var(--muted)]">
                {a.publicIp} · {a.cpuModel} ·{" "}
                {a.isResidential
                  ? `가정용 Provider Quota ${RESIDENTIAL_HINT}`
                  : "사업자 회선"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[1.5rem] bg-[#0a0a0a] p-6 text-white">
        <h2 className="text-lg font-bold">업타임 정책</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {UPTIME_POLICIES.map((p) => (
            <li key={p.hours}>
              {p.hours}h · {p.mode === "test" ? "테스트 서버" : "실서비스"} · 트래픽{" "}
              {formatGb(p.trafficCapGb)}
              {p.requiresContinuousPing ? " (연속 핑 성공 필요)" : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const RESIDENTIAL_HINT = "100G";

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[1.4rem] bg-white border border-black/[0.04] p-5 hover:shadow-md transition"
    >
      <div className="text-sm text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
    </Link>
  );
}
