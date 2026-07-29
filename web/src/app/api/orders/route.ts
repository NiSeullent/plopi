import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/store";
import type { QuickOrderPayload } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(req: Request) {
  const body = (await req.json()) as QuickOrderPayload;
  if (!body.product || body.buyNew === undefined) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const order = createOrder(body);
  return NextResponse.json(order, { status: 201 });
}
