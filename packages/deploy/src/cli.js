import { createServer } from "http";
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { spawn } from "child_process";

const DEFAULT_API = process.env.PLOPI_API || "https://pf.nyase.kr";
const CONFIG_DIR = join(homedir(), ".plopi");
const CONFIG_FILE = join(CONFIG_DIR, "credentials.json");

function loadCreds() {
  if (!existsSync(CONFIG_FILE)) return null;
  return JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
}

function saveCreds(data) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), { mode: 0o600 });
}

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  spawn(cmd, [url], { stdio: "ignore", detached: true }).unref();
}

async function login(apiBase) {
  const state = randomBytes(12).toString("hex");
  const port = 9876;
  const redirectUri = `http://127.0.0.1:${port}/callback`;

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
      if (url.pathname !== "/callback") {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const gotState = url.searchParams.get("state");
      const gotCode = url.searchParams.get("code");
      if (gotState !== state || !gotCode) {
        res.writeHead(400);
        res.end("invalid state/code");
        reject(new Error("OAuth callback invalid"));
        server.close();
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        "<h1>플로피 로그인 완료</h1><p>터미널로 돌아가 주세요.</p><script>window.close()</script>",
      );
      resolve(gotCode);
      server.close();
    });
    server.listen(port, "127.0.0.1", () => {
      const authUrl = `${apiBase}/api/auth/oauth?client_id=plopi-cli&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&response_type=code`;
      console.log("브라우저에서 플로피 계정으로 로그인하세요…");
      console.log(authUrl);
      openBrowser(authUrl);
    });
  });

  const tokenRes = await fetch(`${apiBase}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: "plopi-cli",
      redirect_uri: redirectUri,
    }),
  });
  if (!tokenRes.ok) throw new Error("token exchange failed");
  const token = await tokenRes.json();
  saveCreds({ ...token, apiBase, obtainedAt: new Date().toISOString() });
  console.log("로그인 성공. 자격증명이 ~/.plopi/credentials.json 에 저장됐습니다.");
  return token;
}

async function deploy(args) {
  const apiBase = process.env.PLOPI_API || loadCreds()?.apiBase || DEFAULT_API;
  let creds = loadCreds();
  if (!creds?.access_token) {
    creds = await login(apiBase);
  }

  const kind =
    argValue(args, "--kind") ||
    argValue(args, "-k") ||
    "컨테이너호스팅";
  const domain = argValue(args, "--domain") || argValue(args, "-d");
  const serverId = argValue(args, "--server");
  const buyNew = args.includes("--buy-new") || !serverId;
  const providerId = argValue(args, "--provider") || "prv_plopi_mesh";

  console.log(`배포 요청: ${kind} @ ${apiBase}`);
  const res = await fetch(`${apiBase}/api/deploy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creds.access_token}`,
    },
    body: JSON.stringify({
      kind,
      domain,
      serverId,
      buyNew,
      providerId,
      image: argValue(args, "--image"),
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      console.error("토큰이 만료됐습니다. `plopi login` 후 다시 시도하세요.");
    }
    throw new Error(data.error || `deploy failed (${res.status})`);
  }
  console.log(JSON.stringify(data, null, 2));
}

function argValue(args, key) {
  const i = args.indexOf(key);
  if (i >= 0 && args[i + 1]) return args[i + 1];
  return undefined;
}

function help() {
  console.log(`플로피 배포 툴킷 (plopi)

Usage:
  plopi login                 OAuth2로 플로피 계정 연동
  plopi deploy [options]      서버 구매/선택 후 배포
  plopi whoami                현재 자격증명 확인
  plopi logout                로컬 자격증명 삭제

deploy options:
  --kind, -k     웹호스팅 | 컨테이너호스팅 (default: 컨테이너호스팅)
  --domain, -d   배포 도메인
  --server       기존 서버 ID
  --buy-new      새 서버 구매
  --provider     업체 ID
  --image        컨테이너 이미지

Env:
  PLOPI_API      API 베이스 (default: https://pf.nyase.kr)
`);
}

export async function main(args) {
  const cmd = args[0] || "help";
  const apiBase = process.env.PLOPI_API || loadCreds()?.apiBase || DEFAULT_API;

  if (cmd === "help" || cmd === "--help" || cmd === "-h") return help();
  if (cmd === "login") return login(apiBase);
  if (cmd === "logout") {
    if (existsSync(CONFIG_FILE)) {
      writeFileSync(CONFIG_FILE, "{}");
      console.log("로그아웃했습니다.");
    }
    return;
  }
  if (cmd === "whoami") {
    const c = loadCreds();
    console.log(c ? JSON.stringify({ apiBase: c.apiBase, token_type: c.token_type, obtainedAt: c.obtainedAt }, null, 2) : "로그인 필요");
    return;
  }
  if (cmd === "deploy") return deploy(args.slice(1));

  console.error(`unknown command: ${cmd}`);
  help();
  process.exit(1);
}

export { login, deploy, loadCreds };
