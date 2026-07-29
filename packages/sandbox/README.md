# Plopi Sandbox OS

Debian rootfs + 유틸리티 조합. Mesh 노드(사측/개인 보상측)에 설치됩니다.

## 특징

- **DHCP 미지원** — 공인 IP 고정만
- 관제 서버 DNS 명단을 받아 도메인 → 컨테이너 라우팅
- Docker Swarm + L4 로드밸런서
- WireGuard / AES-256-GCM 으로 외부 직접 접근 차단

## 빌드

```bash
./scripts/build-sandbox.sh
```

`debootstrap`이 없으면 매니페스트 스텁만 생성됩니다.
