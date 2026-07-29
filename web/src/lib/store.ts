import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ApplyPayload, OrderRecord } from "@/lib/types";
import { seedOrders } from "@/data/providers";
import {
  DEPOSIT_RECOVER_DAYS,
  resolveUptimePolicy,
} from "@/lib/policy";

const DATA_DIR = join(process.cwd(), ".data");
const ORDERS_FILE = join(DATA_DIR, "orders.json");
const APPLIES_FILE = join(DATA_DIR, "applies.json");

function ensure() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(ORDERS_FILE)) {
    writeFileSync(ORDERS_FILE, JSON.stringify(seedOrders, null, 2));
  }
  if (!existsSync(APPLIES_FILE)) {
    writeFileSync(APPLIES_FILE, JSON.stringify([], null, 2));
  }
}

export function listOrders(): OrderRecord[] {
  ensure();
  return JSON.parse(readFileSync(ORDERS_FILE, "utf8"));
}

export function getOrder(id: string): OrderRecord | undefined {
  return listOrders().find((o) => o.id === id);
}

export function saveOrders(orders: OrderRecord[]) {
  ensure();
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export function createOrder(
  payload: OrderRecord["payload"],
): OrderRecord {
  const orders = listOrders();
  const policy = resolveUptimePolicy(0, false);
  const order: OrderRecord = {
    id: `ord_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    status: "provisioning",
    mode: policy.mode,
    payload,
    swarmReady: true,
    sandboxRequired: true,
    encryption: "aes-256-gcm+wireguard",
    l4Balancing: true,
    uptimeHours: 0,
    trafficCapGb: policy.trafficCapGb,
    depositLockedUntil: new Date(
      Date.now() + DEPOSIT_RECOVER_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString(),
  };
  orders.unshift(order);
  saveOrders(orders);
  // 시뮬: 곧 테스트 모드로 전환
  setTimeout(() => {
    const latest = listOrders();
    const idx = latest.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      latest[idx] = { ...latest[idx], status: "test", mode: "test" };
      saveOrders(latest);
    }
  }, 1500);
  return order;
}

export function listApplies(): (ApplyPayload & { id: string; createdAt: string; status: string })[] {
  ensure();
  return JSON.parse(readFileSync(APPLIES_FILE, "utf8"));
}

export function createApply(payload: ApplyPayload) {
  const rows = listApplies();
  const row = {
    id: `app_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    status: "review",
    ...payload,
  };
  rows.unshift(row);
  ensure();
  writeFileSync(APPLIES_FILE, JSON.stringify(rows, null, 2));
  return row;
}
