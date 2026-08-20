// DEMO PRICING — SINGLE SOURCE OF TRUTH for every price shown in the app.
// Mock numbers only, no real billing.
import type { PackageId } from "./packages";
import type { HelpService } from "@/state/setupStore";

export const PACKAGE_PRICING: Record<
  PackageId,
  { setup: number; monthly: number; from: boolean }
> = {
  start: { setup: 150000, monthly: 29000, from: false },
  growth: { setup: 200000, monthly: 59000, from: false },
  partner: { setup: 300000, monthly: 99000, from: true },
};

export const HELP_PRICING: Record<HelpService, number> = {
  menuDigital: 40000,
  qrStand: 30000,
  staffTraining: 25000,
  websiteHelp: 50000,
  selfServe: 0,
};

export const formatMMK = (n: number) => `${n.toLocaleString("en-US")} MMK`;

/** "59,000 MMK / month" or "From 99,000 MMK / month" */
export const monthlyLabel = (id: PackageId) => {
  const p = PACKAGE_PRICING[id];
  return `${p.from ? "From " : ""}${formatMMK(p.monthly)} / month`;
};

/** "200,000 MMK" or "From 300,000 MMK" */
export const setupLabel = (id: PackageId) => {
  const p = PACKAGE_PRICING[id];
  return `${p.from ? "From " : ""}${formatMMK(p.setup)}`;
};

export function quote(pkg: PackageId, help: HelpService[]) {
  const base = PACKAGE_PRICING[pkg];
  const optional = help.reduce((a, h) => a + (HELP_PRICING[h] ?? 0), 0);
  return {
    setup: base.setup,
    monthly: base.monthly,
    optional,
    /** Setup fee + first month + add-ons */
    totalToday: base.setup + base.monthly + optional,
    /** Partner needs a quotation — totals are indicative only. */
    isQuote: base.from,
  };
}
