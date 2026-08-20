import { Check } from "lucide-react";
import type { PackageId } from "@/data/packages";
import { PACKAGES, getPackage } from "@/data/packages";
import { monthlyLabel, setupLabel } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

export function PackageCard({
  id,
  recommendedFor,
  selected,
  onChoose,
  compact,
}: {
  id: PackageId;
  recommendedFor?: string;
  selected?: boolean;
  onChoose?: () => void;
  compact?: boolean;
}) {
  const pkg = getPackage(id);
  const { t, p } = useT();
  const name = p(pkg.name);
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm transition-all",
        selected ? "border-primary ring-1 ring-primary" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{p(pkg.tagline)}</p>
        </div>
        {id === "growth" ? (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-accent-foreground">
            {t("pkgRecommended")}
          </span>
        ) : null}
      </div>
      {recommendedFor ? (
        <p className="mt-2 text-sm font-medium text-primary">
          {t("pkgRecommendedFor", { name: recommendedFor })}
        </p>
      ) : null}
      <div className="mt-4 rounded-xl bg-secondary/60 px-4 py-3">
        <p className="text-[17px] font-semibold tracking-tight">{monthlyLabel(id)}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {id === "partner" ? t("pkgCustomSetup") : t("pkgOneTimeSetup")}: {setupLabel(id)}
        </p>
      </div>
      <ul className={cn("mt-4 space-y-2", compact && "text-sm")}>
        {pkg.benefits.map((b) => (
          <li key={b.mm} className="flex gap-2 text-[15px] leading-relaxed">
            <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>{p(b)}</span>
          </li>
        ))}
      </ul>
      {onChoose ? (
        <button
          onClick={onChoose}
          className="mt-5 min-h-12 w-full rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t("pkgChoose", { name })}
        </button>
      ) : null}
    </div>
  );
}

export function ComparePackages({ onChoose }: { onChoose: (id: PackageId) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PACKAGES.map((p) => (
        <PackageCard key={p.id} id={p.id} compact onChoose={() => onChoose(p.id)} />
      ))}
    </div>
  );
}
