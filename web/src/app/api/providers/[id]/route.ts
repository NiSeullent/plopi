import { NextResponse } from "next/server";
import { providers } from "@/data/providers";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const provider = providers.find((p) => p.id === id || p.slug === id);
  if (!provider) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ provider });
}
