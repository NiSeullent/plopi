# @plopi/deploy

플로피(Plopi) npm 배포 툴킷. OAuth2로 계정 연동 후 웹호스팅/컨테이너호스팅 배포를 진행합니다.

## Install

```bash
npm i -g @plopi/deploy
# 또는
npx @plopi/deploy
```

## Usage

```bash
plopi login
plopi deploy --kind 컨테이너호스팅 --domain app.example.com --buy-new
plopi deploy --kind 웹호스팅 --server srv_123 --domain site.example.com
```

환경변수 `PLOPI_API`로 API 엔드포인트를 지정할 수 있습니다 (기본: `https://pf.nyase.kr`).

배포 대상 노드는 **Plopi Sandbox OS**가 설치되어 있어야 하며, Docker Swarm + L4 라우팅으로 프로비저닝됩니다.
