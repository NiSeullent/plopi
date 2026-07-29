import Link from "next/link";
import { providers } from "@/data/providers";
import { formatWon } from "@/lib/policy";

export default function AdminProvidersPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link href="/admin" className="text-sm text-[var(--brand)] font-medium">
        ← 관리자
      </Link>
      <h1 className="mt-4 text-3xl font-bold">업체 관리</h1>
      <div className="mt-6 overflow-x-auto rounded-[1.4rem] bg-white border border-black/[0.04]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--canvas)] text-left text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">업체</th>
              <th className="px-4 py-3">통신사</th>
              <th className="px-4 py-3">트래픽 초과/GB</th>
              <th className="px-4 py-3">서버 기본요금</th>
              <th className="px-4 py-3">가정용</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className="border-t border-black/[0.04]">
                <td className="px-4 py-3">
                  <Link
                    href={`/providers/${p.id}`}
                    className="font-semibold text-[var(--brand)]"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{p.isp.join(", ")}</td>
                <td className="px-4 py-3">
                  {formatWon(p.trafficPricing.overagePerGb)}
                </td>
                <td className="px-4 py-3">
                  {formatWon(p.serverPricing.baseMonthly)}
                </td>
                <td className="px-4 py-3">{p.isResidential ? "Y" : "N"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
