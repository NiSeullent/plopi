import Link from "next/link";
import { listOrders } from "@/lib/store";
import { formatGb } from "@/lib/policy";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  const orders = listOrders();
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link href="/admin" className="text-sm text-[var(--brand)] font-medium">
        ← 관리자
      </Link>
      <h1 className="mt-4 text-3xl font-bold">퀵주문 목록</h1>
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-[1.35rem] bg-white border border-black/[0.04] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-mono text-sm font-semibold">{o.id}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">
                  {o.payload.product} · provider {o.payload.providerId} · plan{" "}
                  {o.payload.planId}
                </div>
              </div>
              <div className="text-right text-sm">
                <div>
                  {o.status} / {o.mode}
                </div>
                <div className="text-[var(--muted)]">
                  업타임 {o.uptimeHours}h · 상한 {formatGb(o.trafficCapGb)}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Chip>Swarm {o.swarmReady ? "ready" : "pending"}</Chip>
              <Chip>L4 LB {o.l4Balancing ? "on" : "off"}</Chip>
              <Chip>Sandbox required</Chip>
              <Chip>{o.encryption}</Chip>
              {o.payload.domain && <Chip>{o.payload.domain}</Chip>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[var(--soft)] px-2.5 py-1 font-medium text-[var(--brand)]">
      {children}
    </span>
  );
}
