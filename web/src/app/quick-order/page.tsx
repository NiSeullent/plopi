"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PrimaryButton, SelectCard, WizardShell } from "@/components/Wizard";
import { providers } from "@/data/providers";
import type { HostingKind } from "@/lib/types";

const PRODUCTS: { id: HostingKind; desc: string }[] = [
  { id: "웹호스팅", desc: "사이트·랜딩에 최적" },
  { id: "온라인PC호스팅", desc: "원격 PC / 작업용" },
  { id: "서버호스팅", desc: "루트 전용 서버" },
  { id: "컨테이너호스팅", desc: "Docker Swarm 메시" },
];

function QuickOrderInner() {
  const router = useRouter();
  const search = useSearchParams();
  const presetProvider = search.get("provider") ?? undefined;

  const [step, setStep] = useState(0);
  const [products, setProducts] = useState<HostingKind[]>([]);
  const [buyNew, setBuyNew] = useState<boolean | null>(null);
  const [providerId, setProviderId] = useState<string | undefined>(presetProvider);
  const [planId, setPlanId] = useState<string>();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<string>();

  const provider = providers.find((p) => p.id === providerId);
  const plans = useMemo(
    () =>
      (provider?.plans ?? []).filter(
        (p) => products.length === 0 || products.includes(p.kind),
      ),
    [provider, products],
  );

  async function submit() {
    if (!providerId || !planId || products.length === 0 || buyNew === null)
      return;
    setLoading(true);
    const plan = plans.find((p) => p.id === planId);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: products[0],
        providerId,
        planId,
        domain: domain || undefined,
        cpuCores: 2,
        memoryGb: plan?.memoryGb ?? 2,
        storageGb: plan?.storageGb ?? 20,
        buyNew,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.id) {
      setDoneId(data.id);
      setStep(5);
    }
  }

  if (step === 5 && doneId) {
    return (
      <WizardShell
        hint="주문이 접수됐어요"
        title="퀵주문 프로비저닝이 시작됐어요"
        footer={
          <PrimaryButton onClick={() => router.push(`/admin/orders`)}>
            주문 상태 보기
          </PrimaryButton>
        }
      >
        <div className="rounded-[1.35rem] bg-white px-5 py-5 text-[var(--ink)]">
          <div className="text-sm text-[var(--muted)]">주문번호</div>
          <div className="mt-1 font-mono font-semibold">{doneId}</div>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li>· Plopi Sandbox OS 기반 Docker Swarm 구성</li>
            <li>· L4 라우터 로드밸런싱</li>
            <li>· 전 구간 암호화 (외부 접근 불가)</li>
            <li>· 업타임 48시간까지는 테스트 서버로만 동작</li>
          </ul>
        </div>
      </WizardShell>
    );
  }

  if (step === 0) {
    return (
      <WizardShell
        hint="여러 개 선택할 수 있어요."
        title="무엇을 찾고 계신가요?"
        footer={
          <PrimaryButton
            disabled={products.length === 0}
            onClick={() => setStep(1)}
          >
            다음
          </PrimaryButton>
        }
      >
        {PRODUCTS.map((p) => (
          <SelectCard
            key={p.id}
            title={p.id}
            description={p.desc}
            selected={products.includes(p.id)}
            onClick={() =>
              setProducts((prev) =>
                prev.includes(p.id)
                  ? prev.filter((x) => x !== p.id)
                  : [...prev, p.id],
              )
            }
          />
        ))}
      </WizardShell>
    );
  }

  if (step === 1) {
    return (
      <WizardShell
        hint="서버를 어떻게 준비할까요?"
        title="새 서버를 구매할까요, 기존 서버를 쓸까요?"
        footer={
          <PrimaryButton
            disabled={buyNew === null}
            onClick={() => setStep(2)}
          >
            다음
          </PrimaryButton>
        }
      >
        <SelectCard
          title="새 서버 구매"
          description="플로피가 업체를 통해 즉시 프로비저닝"
          selected={buyNew === true}
          onClick={() => setBuyNew(true)}
        />
        <SelectCard
          title="기존 서버 선택"
          description="웹호스팅 / 컨테이너호스팅 중 선택"
          selected={buyNew === false}
          onClick={() => setBuyNew(false)}
        />
      </WizardShell>
    );
  }

  if (step === 2) {
    return (
      <WizardShell
        hint="업체마다 요금·트래픽이 달라요"
        title="어느 업체로 진행할까요?"
        footer={
          <PrimaryButton
            disabled={!providerId}
            onClick={() => setStep(3)}
          >
            다음
          </PrimaryButton>
        }
      >
        {providers.map((p) => (
          <SelectCard
            key={p.id}
            title={p.name}
            description={`${p.region} · ${p.isp.join("/")} · 업타임 ${p.uptimePercent}%`}
            selected={providerId === p.id}
            onClick={() => setProviderId(p.id)}
          />
        ))}
      </WizardShell>
    );
  }

  if (step === 3) {
    return (
      <WizardShell
        hint="가격표를 확인했어요"
        title="플랜을 골라 주세요"
        footer={
          <PrimaryButton disabled={!planId} onClick={() => setStep(4)}>
            다음
          </PrimaryButton>
        }
      >
        {plans.map((plan) => (
          <SelectCard
            key={plan.id}
            title={`${plan.name} · 월 ${plan.monthlyPrice.toLocaleString()}원`}
            description={`${plan.kind} · ${plan.cpu} / ${plan.memoryGb}GB · 트래픽 ${plan.trafficGb === "unlimited" ? "무제한" : plan.trafficGb + "G"}`}
            selected={planId === plan.id}
            onClick={() => setPlanId(plan.id)}
          />
        ))}
      </WizardShell>
    );
  }

  return (
    <WizardShell
      hint="도메인은 나중에 바꿔도 돼요"
      title="거의 다 왔어요. 도메인을 알려 주세요"
      footer={
        <PrimaryButton disabled={loading} onClick={submit}>
          {loading ? "주문 중…" : "퀵주문 실행"}
        </PrimaryButton>
      }
    >
      <div className="rounded-[1.35rem] bg-white px-5 py-4">
        <label className="text-sm text-[var(--muted)]">도메인 (선택)</label>
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="app.example.com"
          className="mt-2 w-full rounded-xl bg-[var(--canvas)] px-3 py-3 text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
        />
      </div>
    </WizardShell>
  );
}

export default function QuickOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <QuickOrderInner />
    </Suspense>
  );
}
