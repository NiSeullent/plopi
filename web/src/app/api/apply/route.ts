import { NextResponse } from "next/server";
import { createApply, listApplies } from "@/lib/store";
import { MIN_BANDWIDTH_MBPS } from "@/lib/policy";
import type { ApplyPayload } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ applies: listApplies() });
}

export async function POST(req: Request) {
  const body = (await req.json()) as ApplyPayload;
  if (body.bandwidthMbps < MIN_BANDWIDTH_MBPS) {
    return NextResponse.json(
      {
        error: `minimum_bandwidth_${MIN_BANDWIDTH_MBPS}`,
        message: "1기가 이상 회선만 서비스 가능합니다.",
      },
      { status: 400 },
    );
  }
  if (!body.publicIp || !body.isp || !body.lineInfo) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const row = createApply(body);
  return NextResponse.json(row, { status: 201 });
}
