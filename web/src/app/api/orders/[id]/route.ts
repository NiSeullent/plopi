import { NextResponse } from "next/server";
import { getOrder, listOrders, saveOrders } from "@/lib/store";
import { resolveUptimePolicy } from "@/lib/policy";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const order = getOrder(id);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ order });
}

/** 관제 시뮬: 업타임/핑 갱신 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const body = await req.json();
  const orders = listOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const uptimeHours = Number(body.uptimeHours ?? orders[idx].uptimeHours);
  const continuousPingOk = Boolean(body.continuousPingOk ?? false);
  const policy = resolveUptimePolicy(uptimeHours, continuousPingOk);

  orders[idx] = {
    ...orders[idx],
    uptimeHours,
    mode: policy.mode,
    trafficCapGb: policy.trafficCapGb,
    status: policy.mode === "live" ? "live" : orders[idx].status === "provisioning" ? "test" : orders[idx].status,
  };
  saveOrders(orders);
  return NextResponse.json({ order: orders[idx] });
}
