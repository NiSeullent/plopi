import { NextResponse } from "next/server";

/** Sandbox 에이전트가 주기적으로 받는 DNS 명단 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ nodeId: string }> },
) {
  const { nodeId } = await ctx.params;
  return NextResponse.json({
    nodeId,
    routes: [
      { host: "demo.plopi.kr", container: "1" },
      { host: "api-demo.plopi.kr", container: "2" },
    ],
    encrypted: true,
    updatedAt: new Date().toISOString(),
  });
}
