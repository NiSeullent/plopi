export type IspCarrier = "SKB" | "KT" | "U+" | "기타";
export type HostingKind = "웹호스팅" | "온라인PC호스팅" | "서버호스팅" | "컨테이너호스팅";
export type OrderStatus =
  | "pending"
  | "provisioning"
  | "test"
  | "live"
  | "failed"
  | "cancelled";
export type NodeMode = "test" | "live";

export interface PricePlan {
  id: string;
  name: string;
  kind: HostingKind;
  monthlyPrice: number;
  setupFee: number;
  cpu: string;
  memoryGb: number;
  storageGb: number;
  trafficGb: number | "unlimited";
  features: string[];
}

export interface OpenHours {
  timezone: string;
  weekdays: string;
  weekends: string;
  holidays: string;
}

export interface DowntimeWindow {
  id: string;
  startsAt: string;
  endsAt: string;
  reason: string;
  planned: boolean;
}

export interface ProviderTrafficPricing {
  includedGb: number;
  overagePerGb: number;
  residentialCapGb: number;
}

export interface ProviderServerPricing {
  baseMonthly: number;
  cpuUnit: number;
  memoryGbUnit: number;
  storageGbUnit: number;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  region: string;
  rating: number;
  reviewCount: number;
  isp: IspCarrier[];
  lineInfo: string;
  bandwidthMbps: number;
  isResidential: boolean;
  openHours: OpenHours;
  downtimes: DowntimeWindow[];
  plans: PricePlan[];
  trafficPricing: ProviderTrafficPricing;
  serverPricing: ProviderServerPricing;
  uptimePercent: number;
  homepageBuilder: boolean;
  tags: string[];
}

export interface ProviderQuota {
  providerId: string;
  userQuotaGb: number | "unlimited";
  providerQuotaGb: number | "unlimited";
  residentialLimited: boolean;
  reason?: string;
}

export interface UptimePolicy {
  hours: number;
  trafficCapGb: number | "unlimited";
  mode: NodeMode;
  requiresContinuousPing: boolean;
}

export interface ApplyPayload {
  name: string;
  email: string;
  phone: string;
  isp: IspCarrier;
  lineInfo: string;
  bandwidthMbps: number;
  isResidential: boolean;
  publicIp: string;
  cpuModel: string;
  memoryGb: number;
  storageGb: number;
  depositWon: number;
  notes?: string;
}

export interface QuickOrderPayload {
  product: HostingKind;
  providerId?: string;
  planId?: string;
  domain?: string;
  region?: string;
  cpuCores: number;
  memoryGb: number;
  storageGb: number;
  buyNew: boolean;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: OrderStatus;
  mode: NodeMode;
  payload: QuickOrderPayload;
  swarmReady: boolean;
  sandboxRequired: true;
  encryption: "aes-256-gcm+wireguard";
  l4Balancing: boolean;
  uptimeHours: number;
  trafficCapGb: number | "unlimited";
  depositLockedUntil?: string;
}

export interface CacheRewardSpec {
  cpuModel: string;
  monthlyCache: number;
  baseline: "E5-2699v4";
}

export interface DeployTarget {
  kind: "웹호스팅" | "컨테이너호스팅";
  serverId?: string;
  buyNew?: boolean;
  image?: string;
  domain?: string;
}
