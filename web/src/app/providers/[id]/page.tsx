import Link from "next/link";
import { notFound } from "next/navigation";
import { providers } from "@/data/providers";
import { formatGb, formatWon, RESIDENTIAL_PROVIDER_QUOTA_GB } from "@/lib/policy";

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = providers.find((p) => p.id === id);
  if (!provider) notFound();

  const trafficCost = (gb: number) => {
    const over = Math.max(0, gb - provider.trafficPricing.includedGb);
    return over * provider.trafficPricing.overagePerGb;
  };

  const serverCost = (cpu: number, mem: number, disk: number) =>
    provider.serverPricing.baseMonthly +
    cpu * provider.serverPricing.cpuUnit +
    mem * provider.serverPricing.memoryGbUnit +
    disk * provider.serverPricing.storageGbUnit;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link href="/compare" className="text-sm text-[var(--brand)] font-medium">
        ← 가격비교
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{provider.name}</h1>
          <p className="mt-2 text-[var(--muted)]">
            {provider.region} · {provider.lineInfo}
          </p>
        </div>
        <Link
          href={`/quick-order?provider=${provider.id}`}
          className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          이 업체로 퀵주문
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.4rem] bg-white p-5 border border-black/[0.04]">
          <div className="text-xs font-semibold text-[var(--muted)]">영업시간</div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>평일</dt>
              <dd className="font-medium">{provider.openHours.weekdays}</dd>
            </div>
            <div className="flex justify-between">
              <dt>주말</dt>
              <dd className="font-medium">{provider.openHours.weekends}</dd>
            </div>
            <div className="flex justify-between">
              <dt>공휴일</dt>
              <dd className="font-medium">{provider.openHours.holidays}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-[1.4rem] bg-white p-5 border border-black/[0.04]">
          <div className="text-xs font-semibold text-[var(--muted)]">회선 · 통신사</div>
          <div className="mt-3 text-sm space-y-2">
            <div>
              통신사: <strong>{provider.isp.join(", ")}</strong>
            </div>
            <div>
              대역폭: <strong>{provider.bandwidthMbps} Mbps</strong>
            </div>
            <div>
              가정용:{" "}
              <strong>{provider.isResidential ? "예 (Provider Quota 적용)" : "아니오"}</strong>
            </div>
          </div>
        </div>
        <div className="rounded-[1.4rem] bg-white p-5 border border-black/[0.04]">
          <div className="text-xs font-semibold text-[var(--muted)]">쿼타</div>
          <div className="mt-3 text-sm space-y-2">
            <div>
              User Quota: 플랜별 {formatGb(provider.plans[0]?.trafficGb ?? 0)}~
            </div>
            <div>
              Provider Quota:{" "}
              <strong>
                {provider.isResidential
                  ? `${RESIDENTIAL_PROVIDER_QUOTA_GB}G (가정용 규정)`
                  : "제한 없음*"}
              </strong>
            </div>
            <p className="text-xs text-[var(--muted)]">
              *업타임 정책에 따른 트래픽 상한은 별도 적용
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">다운타임</h2>
        {provider.downtimes.length === 0 ? (
          <p className="mt-3 text-sm text-emerald-600 font-medium">
            예정된 다운타임이 없습니다.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {provider.downtimes.map((d) => (
              <li
                key={d.id}
                className="rounded-2xl bg-white border border-black/[0.04] px-4 py-3 text-sm"
              >
                <div className="font-semibold">{d.reason}</div>
                <div className="mt-1 text-[var(--muted)]">
                  {new Date(d.startsAt).toLocaleString("ko-KR")} →{" "}
                  {new Date(d.endsAt).toLocaleString("ko-KR")} ·{" "}
                  {d.planned ? "계획됨" : "가능 구간"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">가격표</h2>
        <div className="mt-4 overflow-x-auto rounded-[1.4rem] bg-white border border-black/[0.04]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--canvas)] text-left text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">플랜</th>
                <th className="px-4 py-3 font-medium">종류</th>
                <th className="px-4 py-3 font-medium">스펙</th>
                <th className="px-4 py-3 font-medium">트래픽</th>
                <th className="px-4 py-3 font-medium">월요금</th>
              </tr>
            </thead>
            <tbody>
              {provider.plans.map((plan) => (
                <tr key={plan.id} className="border-t border-black/[0.04]">
                  <td className="px-4 py-3 font-semibold">{plan.name}</td>
                  <td className="px-4 py-3">{plan.kind}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {plan.cpu} / {plan.memoryGb}GB / {plan.storageGb}GB
                  </td>
                  <td className="px-4 py-3">{formatGb(plan.trafficGb)}</td>
                  <td className="px-4 py-3 font-bold">
                    {formatWon(plan.monthlyPrice)}
                    {plan.setupFee > 0 && (
                      <span className="ml-1 text-xs font-normal text-[var(--muted)]">
                        +설치 {formatWon(plan.setupFee)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.4rem] bg-white p-5 border border-black/[0.04]">
          <h3 className="font-bold">트래픽 비용 산정 (이 업체)</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            포함 {provider.trafficPricing.includedGb}G · 초과 GB당{" "}
            {formatWon(provider.trafficPricing.overagePerGb)}
          </p>
          <p className="mt-4 text-sm">
            예) 1,500G 사용 시 초과분 ≈{" "}
            <strong>{formatWon(trafficCost(1500))}</strong>
          </p>
        </div>
        <div className="rounded-[1.4rem] bg-white p-5 border border-black/[0.04]">
          <h3 className="font-bold">서버 비용 산정 (이 업체)</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            기본 {formatWon(provider.serverPricing.baseMonthly)} + vCPU{" "}
            {formatWon(provider.serverPricing.cpuUnit)} + RAM GB{" "}
            {formatWon(provider.serverPricing.memoryGbUnit)} + Disk GB{" "}
            {formatWon(provider.serverPricing.storageGbUnit)}
          </p>
          <p className="mt-4 text-sm">
            예) 4vCPU / 8GB / 100GB ≈{" "}
            <strong>{formatWon(serverCost(4, 8, 100))}/월</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
