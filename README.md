# 플로피 (Plopi)

전국 **웹호스팅 / 온라인PC호스팅 / 서버호스팅** 가격비교 및 홈페이지 제작 플랫폼.

- 웹: `web/` → pf.nyase.kr
- 배포 CLI: `packages/deploy` → `@plopi/deploy`
- Sandbox OS: `packages/sandbox`

## Quick start

```bash
npm install
npm run dev
# http://localhost:3000
```

```bash
npm run deploy:cli -- help
npm run sandbox:build
```

## 구성

| 경로 | 설명 |
|------|------|
| `/compare` | 업체 가격·다운타임·영업시간 비교 |
| `/quick-order` | 자체 API 퀵주문 (Swarm + L4) |
| `/apply` | 개인/마이너 입주신청 |
| `/admin` | 관리자 |
| `/build` | 홈페이지 제작 |
| `/docs` | 정책·CLI 문서 |

## 라이선스

MIT
