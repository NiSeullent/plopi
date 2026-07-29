"use client";

import { useState } from "react";
import { PrimaryButton, SelectCard, WizardShell } from "@/components/Wizard";

const TEMPLATES = [
  { id: "landing", title: "랜딩 페이지", desc: "브랜드 소개 + CTA" },
  { id: "shop", title: "미니 쇼핑몰", desc: "상품 목록 + 문의" },
  { id: "blog", title: "블로그/포트폴리오", desc: "글 목록 + 소개" },
];

export default function BuildPage() {
  const [tpl, setTpl] = useState<string>();
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <WizardShell
        hint="초안이 준비됐어요"
        title={`${name || "내 사이트"} 초안을 만들었어요`}
        footer={
          <PrimaryButton href="/quick-order">
            호스팅 퀵주문으로 이어가기
          </PrimaryButton>
        }
      >
        <div className="rounded-[1.35rem] bg-white px-5 py-5 text-[var(--ink)] text-sm">
          선택한 템플릿: <strong>{tpl}</strong>
          <br />
          플로피 메시 또는 비교된 웹호스팅에 바로 배포할 수 있어요.
        </div>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      hint="홈페이지 제작"
      title="어떤 사이트를 만들까요?"
      footer={
        <PrimaryButton
          disabled={!tpl}
          onClick={() => setDone(true)}
        >
          초안 만들기
        </PrimaryButton>
      }
    >
      {TEMPLATES.map((t) => (
        <SelectCard
          key={t.id}
          title={t.title}
          description={t.desc}
          selected={tpl === t.id}
          onClick={() => setTpl(t.id)}
        />
      ))}
      <div className="rounded-[1.35rem] bg-white px-5 py-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="사이트 이름"
          className="w-full rounded-xl bg-[var(--canvas)] px-3 py-3 text-[var(--ink)] outline-none"
        />
      </div>
    </WizardShell>
  );
}
