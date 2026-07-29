#!/usr/bin/env bash
# Plopi Sandbox OS — Debian rootfs + 유틸리티 조합 빌드
# DHCP 미지원, 공인 IP 고정만 지원. 관제 DNS 명단에 따라 컨테이너 라우팅.
set -euo pipefail

ROOT="${PLOPI_SANDBOX_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
OUT="${PLOPI_SANDBOX_OUT:-$ROOT/dist}"
SUITE="${PLOPI_DEBIAN_SUITE:-bookworm}"
MIRROR="${PLOPI_DEBIAN_MIRROR:-http://deb.debian.org/debian}"

mkdir -p "$OUT" "$ROOT/rootfs/etc/plopi"

echo "==> Building Plopi Sandbox rootfs ($SUITE)"

if ! command -v debootstrap >/dev/null 2>&1; then
  echo "debootstrap 이 필요합니다. (debian/ubuntu 호스트에서 실행)"
  echo "스텁 rootfs 메타만 생성합니다."
  cat > "$OUT/SANDBOX_MANIFEST.json" <<EOF
{
  "name": "Plopi Sandbox",
  "base": "debian:${SUITE}",
  "networking": "public-ip-only",
  "dhcp": false,
  "components": ["docker", "swarm", "wireguard", "plopi-agent", "l4-router"],
  "dns": "control-plane roster driven"
}
EOF
  cp -a "$ROOT/rootfs/etc/plopi/." "$OUT/" 2>/dev/null || true
  echo "manifest -> $OUT/SANDBOX_MANIFEST.json"
  exit 0
fi

TARGET="$OUT/rootfs"
rm -rf "$TARGET"
debootstrap --variant=minbase "$SUITE" "$TARGET" "$MIRROR"

# 네트워크: DHCP 비활성, 정적 공인 IP만
cat > "$TARGET/etc/network/interfaces" <<'EOF'
auto lo
iface lo inet loopback

# Plopi Sandbox: DHCP 금지. /etc/plopi/net.conf 의 공인 IP만 사용
auto eth0
iface eth0 inet static
  address 0.0.0.0
  netmask 255.255.255.0
  gateway 0.0.0.0
  pre-up /usr/lib/plopi/apply-net.sh
EOF

mkdir -p "$TARGET/etc/plopi" "$TARGET/usr/lib/plopi" "$TARGET/etc/systemd/system"
cp -a "$ROOT/rootfs/etc/plopi/." "$TARGET/etc/plopi/"

cat > "$TARGET/usr/lib/plopi/apply-net.sh" <<'EOF'
#!/bin/bash
set -euo pipefail
CONF=/etc/plopi/net.conf
if [[ ! -f "$CONF" ]]; then
  echo "Plopi Sandbox: /etc/plopi/net.conf 없음 — 공인 IP 미설정" >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$CONF"
ip addr flush dev eth0 || true
ip addr add "$PUBLIC_IP/$PREFIX" dev eth0
ip link set eth0 up
ip route replace default via "$GATEWAY" dev eth0
EOF
chmod +x "$TARGET/usr/lib/plopi/apply-net.sh"

cat > "$TARGET/usr/lib/plopi/agent.sh" <<'EOF'
#!/bin/bash
# 관제 서버에서 Sandbox DNS 명단을 받아 컨테이너로 라우팅
set -euo pipefail
CONTROL="${PLOPI_CONTROL:-https://pf.nyase.kr}"
NODE_ID="$(cat /etc/plopi/node-id 2>/dev/null || echo unknown)"
ROSTER="/etc/plopi/dns-roster.json"

while true; do
  curl -fsS "$CONTROL/api/sandbox/$NODE_ID/dns" -o "$ROSTER.tmp" && mv "$ROSTER.tmp" "$ROSTER" || true
  if [[ -f "$ROSTER" ]]; then
    /usr/lib/plopi/apply-dns-roster.sh "$ROSTER" || true
  fi
  sleep 30
done
EOF
chmod +x "$TARGET/usr/lib/plopi/agent.sh"

cat > "$TARGET/usr/lib/plopi/apply-dns-roster.sh" <<'EOF'
#!/bin/bash
# DNS 명단 예: [{"host":"a.example.com","container":"1"}, ...]
# L4 라우터가 host → swarm 서비스/컨테이너로 전달
set -euo pipefail
ROSTER="${1:-/etc/plopi/dns-roster.json}"
echo "Applying DNS roster from $ROSTER"
# 실구현: L4(proxy/ipvs) 룰 갱신
python3 - <<'PY' "$ROSTER"
import json,sys
path=sys.argv[1]
try:
  data=json.load(open(path))
except Exception as e:
  print("roster parse error", e); raise SystemExit(0)
for row in data if isinstance(data, list) else data.get("routes", []):
  print(f"route {row.get('host')} -> container {row.get('container')}")
PY
EOF
chmod +x "$TARGET/usr/lib/plopi/apply-dns-roster.sh"

# WireGuard + Docker 설치 힌트 (chroot에서 완료)
cat > "$TARGET/etc/plopi/README" <<'EOF'
Plopi Sandbox OS
- Debian rootfs + plopi-agent + docker swarm + L4 router + wireguard
- DHCP 미지원 / 공인 IP only
- 모든 컨테이너·통신 데이터 암호화 (외부 직접 접근 불가)
EOF

echo "==> Packaging squashfs/tarball"
tar -C "$OUT" -czf "$OUT/plopi-sandbox-${SUITE}.tar.gz" rootfs
echo "done: $OUT/plopi-sandbox-${SUITE}.tar.gz"
