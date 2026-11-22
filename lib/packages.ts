/**
 * Single source of truth for Dioshift pricing.
 * Every package is priced at the same CPM (cost per 1,000 impressions),
 * so changing CPM here updates every price on the site.
 */
export const CPM = 25;

export type PackageId = "75k" | "100k" | "150k" | "200k" | "250k" | "300k";

export interface Package {
  id: PackageId;
  impressions: number;
  monthlyPrice: number;
  label: string;
  popular?: boolean;
}

const priceFor = (impressions: number) => (impressions / 1000) * CPM;

const definePackage = (pkg: Omit<Package, "monthlyPrice">): Package => ({
  ...pkg,
  monthlyPrice: priceFor(pkg.impressions),
});

export const PACKAGES: Package[] = [
  definePackage({ id: "75k", impressions: 75_000, label: "Starter" }),
  definePackage({ id: "100k", impressions: 100_000, label: "Local" }),
  definePackage({ id: "150k", impressions: 150_000, label: "Growth", popular: true }),
  definePackage({ id: "200k", impressions: 200_000, label: "Expanded" }),
  definePackage({ id: "250k", impressions: 250_000, label: "Regional" }),
  definePackage({ id: "300k", impressions: 300_000, label: "Market Leader" }),
];

/** 150000 -> "150,000" */
export function formatImpressions(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** 3750 -> "$3,750" */
export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

export function getPackageById(id: string | null | undefined): Package | undefined {
  if (!id) return undefined;
  return PACKAGES.find((p) => p.id === id);
}
