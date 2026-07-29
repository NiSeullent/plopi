import { NextResponse } from "next/server";

/** OAuth2 authorize — CLI가 브라우저로 여는 엔드포인트 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("client_id") ?? "plopi-cli";
  const redirectUri =
    url.searchParams.get("redirect_uri") ?? "http://127.0.0.1:9876/callback";
  const state = url.searchParams.get("state") ?? "dev";
  const code = `plopi_code_${Buffer.from(`${clientId}:${Date.now()}`).toString("base64url")}`;

  const dest = new URL(redirectUri);
  dest.searchParams.set("code", code);
  dest.searchParams.set("state", state);

  // 개발용: 즉시 승인 후 리다이렉트 (실서비스에선 로그인 UI)
  return NextResponse.redirect(dest.toString());
}
