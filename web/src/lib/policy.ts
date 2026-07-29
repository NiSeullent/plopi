import type { CacheRewardSpec, UptimePolicy } from "@/lib/types";

/** 업타임 기반 트래픽/모드 정책 */
export const UPTIME_POLICIES: UptimePolicy[] = [
  { hours: 0, trafficCapGb: 0, mode: "test", requiresContinuousPing: false },
  { hours: 48, trafficCapGb: 30, mode: "live", requiresContinuousPing: false },
  { hours: 72, trafficCapGb: 100, mode: "live", requiresContinuousPing: false },
  {
    hours: 240,
    trafficCapGb: "unlimited",
    mode: "live",
    requiresContinuousPing: true,
  },
];

/** 가정용 인터넷 Provider Quota 상한 (User Quota와 별개) */
export const RESIDENTIAL_PROVIDER_QUOTA_GB = 100;

/** 서비스 가능 최소 회선 */
export const MIN_BANDWIDTH_MBPS = 1000;

/** 예치금 회수: 연속 업타임 3개월 */
export const DEPOSIT_RECOVER_DAYS = 90;

export const CACHE_REWARDS: CacheRewardSpec[] = [
  { cpuModel: "E5-2699v4", monthlyCache: 100_000, baseline: "E5-2699v4" },
  { cpuModel: "i5-2500", monthlyCache: 15_000, baseline: "E5-2699v4" },
];

export function resolveUptimePolicy(
  uptimeHours: number,
  continuousPingOk: boolean,
): UptimePolicy {
  if (uptimeHours >= 240 && continuousPingOk) {
    return UPTIME_POLICIES[3];
  }
  if (uptimeHours >= 72) return UPTIME_POLICIES[2];
  if (uptimeHours >= 48) return UPTIME_POLICIES[1];
  return UPTIME_POLICIES[0];
}

export function estimateMonthlyCache(cpuModel: string, utilization = 1): number {
  const exact = CACHE_REWARDS.find(
    (c) => c.cpuModel.toLowerCase() === cpuModel.toLowerCase(),
  );
  if (exact) return Math.round(exact.monthlyCache * utilization);

  // 대략 성능비 추정 (E5-2699v4 = 1.0)
  const rough: Record<string, number> = {
    "e5-2699v4": 1,
    "i5-2500": 0.15,
    "r5-5600x": 0.55,
    "r9-5950x": 0.95,
  };
  const key = cpuModel.toLowerCase();
  const ratio = rough[key] ?? 0.4;
  return Math.round(100_000 * ratio * utilization);
}

export function formatWon(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n) + "원";
}

export function formatGb(n: number | "unlimited"): string {
  return n === "unlimited" ? "무제한" : `${n}G`;
}
