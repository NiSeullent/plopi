import Link from "next/link";
import type { Provider } from "@/lib/types";
import { formatGb, formatWon } from "@/lib/policy";

export function ProviderCard({ provider }: { provider: Provider }) {
  const cheapest = Math.min(...provider.plans.map((p) => p.monthlyPrice));
  const nextDowntime = provider.downtimes[0];

  return (
    <Link
      href={`/providers/${provider.id}`}
      className="group block rounded-[1.5rem] bg-white p-5 border border-black/[0.04] shadow-[0_8px_30px_rgba(10,10,10,0.04)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(10,10,10,0.08)] transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {provider.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-[var(--soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--brand)]"
              >
                {t}
              </span>
            ))}
            {provider.isResidential && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                가정용 · Provider Quota {provider.trafficPricing.residentialCapGb}G
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold tracking-tight text-[var(--ink)]">
            {provider.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {provider.region} · {provider.isp.join("/")} ·{" "}
            {provider.bandwidthMbps >= 1000
              ? `${provider.bandwidthMbps / 1000}G`
              : `${provider.bandwidthMbps}M`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-[var(--muted)]">월</div>
          <div className="text-lg font-bold text-[var(--ink)]">
            {formatWon(cheapest)}~
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-[var(--canvas)] px-2 py-3">
          <div className="text-[11px] text-[var(--muted)]">업타임</div>
          <div className="mt-0.5 text-sm font-semibold">{provider.uptimePercent}%</div>
        </div>
        <div className="rounded-2xl bg-[var(--canvas)] px-2 py-3">
          <div className="text-[11px] text-[var(--muted)]">트래픽</div>
          <div className="mt-0.5 text-sm font-semibold">
            {formatGb(provider.plans[0]?.trafficGb ?? 0)}~
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--canvas)] px-2 py-3">
          <div className="text-[11px] text-[var(--muted)]">평점</div>
          <div className="mt-0.5 text-sm font-semibold">
            {provider.rating}{" "}
            <span className="text-[var(--muted)] font-normal">
              ({provider.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-[var(--muted)]">
          영업 {provider.openHours.weekdays}
        </span>
        {nextDowntime ? (
          <span className="text-amber-600 font-medium truncate max-w-[50%]">
            점검 {new Date(nextDowntime.startsAt).toLocaleDateString("ko-KR")}
          </span>
        ) : (
          <span className="text-emerald-600 font-medium">예정 다운타임 없음</span>
        )}
      </div>
    </Link>
  );
}
