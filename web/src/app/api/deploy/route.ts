import { NextResponse } from "next/server";
import { createOrder } from "@/lib/store";

/** CLI 배포 API — Bearer 토큰 필요 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer plopi_at_")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const kind = body.kind as "웹호스팅" | "컨테이너호스팅" | undefined;
  if (!kind) {
    return NextResponse.json({ error: "kind_required" }, { status: 400 });
  }

  const order = createOrder({
    product: kind,
    providerId: body.providerId ?? "prv_plopi_mesh",
    planId: body.planId ?? "pm-ct-s",
    domain: body.domain,
    cpuCores: body.cpuCores ?? 2,
    memoryGb: body.memoryGb ?? 2,
    storageGb: body.storageGb ?? 20,
    buyNew: Boolean(body.buyNew ?? !body.serverId),
  });

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    mode: order.mode,
    swarm: {
      stack: "plopi-sandbox",
      l4: true,
      encryption: order.encryption,
      dnsRouting:
        "관제 서버 DNS 명단에 따라 Sandbox 내 컨테이너로 L4 라우팅",
    },
    message:
      "배포가 큐에 등록되었습니다. 업타임 48시간까지는 테스트 서버로만 동작합니다.",
  });
}
