"use client";

import { useMemo, useState } from "react";
import { providers } from "@/data/providers";
import { ProviderCard } from "@/components/ProviderCard";
import type { HostingKind, IspCarrier } from "@/lib/types";

const KINDS: (HostingKind | "전체")[] = [
  "전체",
  "웹호스팅",
  "온라인PC호스팅",
  "서버호스팅",
  "컨테이너호스팅",
];

const ISPS: (IspCarrier | "전체")[] = ["전체", "SKB", "KT", "U+", "기타"];

export default function ComparePage() {
  const [kind, setKind] = useState<(typeof KINDS)[number]>("전체");
  const [isp, setIsp] = useState<(typeof ISPS)[number]>("전체");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      if (kind !== "전체" && !p.plans.some((pl) => pl.kind === kind)) return false;
      if (isp !== "전체" && !p.isp.includes(isp)) return false;
      if (q && !`${p.name} ${p.region} ${p.tags.join(" ")}`.includes(q))
        return false;
      return true;
    });
  }, [kind, isp, q]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]">
        가격비교
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        업체마다 다운타임 · 영업시간 · 가격표를 함께 확인하세요.
      </p>

      <div className="mt-8 rounded-[1.5rem] bg-white p-5 border border-black/[0.04]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="업체명, 지역 검색"
          className="w-full rounded-2xl bg-[var(--canvas)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                kind === k
                  ? "bg-[var(--brand)] text-white"
                  : "bg-[var(--canvas)] text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {ISPS.map((k) => (
            <button
              key={k}
              onClick={() => setIsp(k)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                isp === k
                  ? "bg-[var(--ink)] text-white"
                  : "bg-[var(--canvas)] text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {k === "전체" ? "통신사 전체" : k}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-sm text-[var(--muted)]">
        {filtered.length}개 업체
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
}
