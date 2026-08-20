// DEMO PRICING — mock numbers only, no real billing.
import type { PackageId } from "./packages";
import type { HelpService } from "@/state/setupStore";

export const PACKAGE_PRICING: Record<PackageId, { setup: number; monthly: number }> = {
  start: { setup: 150000, monthly: 25000 },
  growth: { setup: 350000, monthly: 45000 },
  partner: { setup: 550000, monthly: 75000 },
};

export const HELP_PRICING: Record<HelpService, number> = {
  menuDigital: 40000,
  qrStand: 30000,
  staffTraining: 25000,
  websiteHelp: 50000,
  selfServe: 0,
};

export const formatMMK = (n: number) => `${n.toLocaleString("en-US")} MMK`;

export function quote(pkg: PackageId, help: HelpService[]) {
  const base = PACKAGE_PRICING[pkg];
  const optional = help.reduce((a, h) => a + (HELP_PRICING[h] ?? 0), 0);
  return {
    setup: base.setup,
    monthly: base.monthly,
    optional,
    totalToday: base.setup + optional,
  };
}
