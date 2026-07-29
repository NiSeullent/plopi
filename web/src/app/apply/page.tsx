"use client";

import { useMemo, useState } from "react";
import { PrimaryButton, SelectCard, WizardShell } from "@/components/Wizard";
import {
  MIN_BANDWIDTH_MBPS,
  RESIDENTIAL_PROVIDER_QUOTA_GB,
  estimateMonthlyCache,
} from "@/lib/policy";
import type { IspCarrier } from "@/lib/types";

const ISPS: IspCarrier[] = ["SKB", "KT", "U+", "기타"];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [isp, setIsp] = useState<IspCarrier | null>(null);
  const [isResidential, setIsResidential] = useState(false);
  const [bandwidthMbps, setBandwidthMbps] = useState(1000);
  const [lineInfo, setLineInfo] = useState("");
  const [publicIp, setPublicIp] = useState("");
  const [cpuModel, setCpuModel] = useState("E5-2699v4");
  const [memoryGb, setMemoryGb] = useState(64);
  const [storageGb, setStorageGb] = useState(500);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<string>();
  const [error, setError] = useState<string>();

  const cache = useMemo(() => estimateMonthlyCache(cpuModel), [cpuModel]);
  const eligible = bandwidthMbps >= MIN_BANDWIDTH_MBPS;

  async function submit() {
    setError(undefined);
    if (!eligible) {
      setError(`서비스는 ${MIN_BANDWIDTH_MBPS}Mbps(1기가) 이상만 가능합니다.`);
      return;
    }
    if (!isp || !name || !email || !publicIp || !lineInfo) {
      setError("필수 항목을 모두 입력해 주세요.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        isp,
        lineInfo,
        bandwidthMbps,
        isResidential,
        publicIp,
        cpuModel,
        memoryGb,
        storageGb,
        depositWon: 300000,
        notes,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "신청 실패");
      return;
    }
    setDoneId(data.id);
    setStep(4);
  }

  if (step === 4 && doneId) {
    return (
      <WizardShell
        hint="입주 심사가 시작됐어요"
        title="입주신청이 접수됐어요"
        footer={<PrimaryButton href="/admin">관리자에서 확인</PrimaryButton>}
      >
        <div className="rounded-[1.35rem] bg-white px-5 py-5 text-[var(--ink)] text-sm space-y-2">
          <div>
            신청번호 <strong className="font-mono">{doneId}</strong>
          </div>
          <div>
            Plopi Sandbox OS 설치 필요 · DHCP 미지원(공인 IP만)
          </div>
          <div>
            예치금은 연속 업타임 3개월 후 회수 가능
          </div>
          {isResidential && (
            <div className="text-amber-700 font-medium">
              가정용 인터넷: Provider Quota {RESIDENTIAL_PROVIDER_QUOTA_GB}G 적용
            </div>
          )}
        </div>
      </WizardShell>
    );
  }

  if (step === 0) {
    return (
      <WizardShell
        hint="개인·마이너 노드 환영해요"
        title="통신사를 알려 주세요"
        footer={
          <PrimaryButton disabled={!isp} onClick={() => setStep(1)}>
            다음
          </PrimaryButton>
        }
      >
        {ISPS.map((x) => (
          <SelectCard
            key={x}
            title={x}
            selected={isp === x}
            onClick={() => setIsp(x)}
          />
        ))}
      </WizardShell>
    );
  }

  if (step === 1) {
    return (
      <WizardShell
        hint="1기가 이상만 서비스 가능해요"
        title="회선 정보를 입력해 주세요"
        footer={
          <PrimaryButton disabled={!eligible || !lineInfo} onClick={() => setStep(2)}>
            다음
          </PrimaryButton>
        }
      >
        <div className="rounded-[1.35rem] bg-white px-5 py-4 space-y-4 text-[var(--ink)]">
          <div>
            <label className="text-sm text-[var(--muted)]">망 회선 정보</label>
            <input
              value={lineInfo}
              onChange={(e) => setLineInfo(e.target.value)}
              placeholder="예: SKB 기가 슬림 + 공인 IP 1개"
              className="mt-2 w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--muted)]">대역폭 (Mbps)</label>
            <input
              type="number"
              value={bandwidthMbps}
              onChange={(e) => setBandwidthMbps(Number(e.target.value))}
              className="mt-2 w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
            />
            {!eligible && (
              <p className="mt-2 text-sm text-[#FF4D6A]">
                1기가(1000Mbps) 미만은 서비스할 수 없어요.
              </p>
            )}
          </div>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isResidential}
              onChange={(e) => setIsResidential(e.target.checked)}
              className="h-5 w-5 rounded accent-[var(--brand)]"
            />
            가정용 인터넷인가요?
          </label>
          {isResidential && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
              가정용 인터넷 규정으로 Provider Quota {RESIDENTIAL_PROVIDER_QUOTA_GB}G
              이상 트래픽을 서비스할 수 없습니다. (User Quota와 별도 집계)
            </p>
          )}
        </div>
      </WizardShell>
    );
  }

  if (step === 2) {
    return (
      <WizardShell
        hint="Sandbox는 공인 IP만 지원해요"
        title="서버 스펙을 알려 주세요"
        footer={<PrimaryButton onClick={() => setStep(3)}>다음</PrimaryButton>}
      >
        <div className="rounded-[1.35rem] bg-white px-5 py-4 space-y-4 text-[var(--ink)]">
          <div>
            <label className="text-sm text-[var(--muted)]">공인 IP</label>
            <input
              value={publicIp}
              onChange={(e) => setPublicIp(e.target.value)}
              placeholder="x.x.x.x"
              className="mt-2 w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--muted)]">CPU 모델</label>
            <select
              value={cpuModel}
              onChange={(e) => setCpuModel(e.target.value)}
              className="mt-2 w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
            >
              <option value="E5-2699v4">E5-2699v4 (월 100,000 캐시)</option>
              <option value="i5-2500">i5-2500 (월 15,000 캐시)</option>
              <option value="R5-5600X">R5-5600X (추정)</option>
              <option value="R9-5950X">R9-5950X (추정)</option>
            </select>
            <p className="mt-2 text-sm text-[var(--muted)]">
              예상 캐시 리워드:{" "}
              <strong className="text-[var(--ink)]">
                {cache.toLocaleString()}캐시/월
              </strong>{" "}
              (메모리·CPU·연산량 비례, E5-2699v4 기준)
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--muted)]">메모리 GB</label>
              <input
                type="number"
                value={memoryGb}
                onChange={(e) => setMemoryGb(Number(e.target.value))}
                className="mt-2 w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--muted)]">스토리지 GB</label>
              <input
                type="number"
                value={storageGb}
                onChange={(e) => setStorageGb(Number(e.target.value))}
                className="mt-2 w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
              />
            </div>
          </div>
        </div>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      hint="예치금은 3개월 연속 업타임 후 회수"
      title="연락처를 남겨 주세요"
      footer={
        <>
          {error && <p className="mb-3 text-sm text-[#FF4D6A]">{error}</p>}
          <PrimaryButton disabled={loading} onClick={submit}>
            {loading ? "제출 중…" : "입주신청"}
          </PrimaryButton>
        </>
      }
    >
      <div className="rounded-[1.35rem] bg-white px-5 py-4 space-y-4 text-[var(--ink)]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호"
          className="w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="메모 (선택)"
          rows={3}
          className="w-full rounded-xl bg-[var(--canvas)] px-3 py-3 outline-none resize-none"
        />
      </div>
    </WizardShell>
  );
}
