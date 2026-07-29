import { NextResponse } from "next/server";
import {
  RESIDENTIAL_PROVIDER_QUOTA_GB,
  resolveUptimePolicy,
  formatGb,
} from "@/lib/policy";
import { providers } from "@/data/providers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const providerId = url.searchParams.get("providerId");
  const uptimeHours = Number(url.searchParams.get("uptimeHours") ?? 0);
  const continuousPingOk = url.searchParams.get("ping") === "1";
  const provider = providers.find((p) => p.id === providerId);

  const policy = resolveUptimePolicy(uptimeHours, continuousPingOk);
  const residential = provider?.isResidential ?? false;

  let userQuota = policy.trafficCapGb;
  let providerQuota: number | "unlimited" = "unlimited";
  let reason: string | undefined;

  if (residential) {
    providerQuota = RESIDENTIAL_PROVIDER_QUOTA_GB;
    reason = "가정용 인터넷 규정 — Provider Quota 100G";
    if (userQuota !== "unlimited") {
      userQuota = Math.min(userQuota, RESIDENTIAL_PROVIDER_QUOTA_GB);
    } else {
      userQuota = RESIDENTIAL_PROVIDER_QUOTA_GB;
    }
  }

  return NextResponse.json({
    mode: policy.mode,
    userQuotaGb: userQuota,
    userQuotaLabel: formatGb(userQuota),
    providerQuotaGb: providerQuota,
    providerQuotaLabel: formatGb(providerQuota),
    residentialLimited: residential,
    reason,
    policy,
  });
}
