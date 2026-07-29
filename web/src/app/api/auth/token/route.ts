import { NextResponse } from "next/server";

/** OAuth2 token exchange */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = body.code as string | undefined;
  if (!code) {
    return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
  }
  const accessToken = `plopi_at_${Buffer.from(code).toString("base64url")}`;
  return NextResponse.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: `plopi_rt_${Date.now().toString(36)}`,
    scope: "deploy:write orders:read",
  });
}
