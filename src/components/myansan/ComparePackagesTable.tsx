import { PACKAGES } from "@/data/packages";
import { monthlyLabel, setupLabel } from "@/data/pricing";
import { useT } from "@/i18n";

/** Compact side-by-side package comparison, reusing package data. */
export function ComparePackagesTable() {
  const { p, lang } = useT();
  return (
    <div className="fade-up mt-4 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-secondary/60">
          <tr>
            <th className="p-3" />
            {PACKAGES.map((k) => (
              <th key={k.id} className="p-3 font-semibold">{p(k.name)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <td className="p-3 text-muted-foreground">{p({ mm: "လစဉ်", en: "Monthly" })}</td>
            {PACKAGES.map((k) => <td key={k.id} className="p-3">{monthlyLabel(k.id, lang)}</td>)}
          </tr>
          <tr>
            <td className="p-3 text-muted-foreground">Setup</td>
            {PACKAGES.map((k) => <td key={k.id} className="p-3">{setupLabel(k.id, lang)}</td>)}
          </tr>
          <tr>
            <td className="p-3 align-top text-muted-foreground">{p({ mm: "ပါဝင်မှု", en: "Includes" })}</td>
            {PACKAGES.map((k) => (
              <td key={k.id} className="p-3 align-top">
                <ul className="space-y-1">{k.benefits.map((b) => <li key={b.mm}>• {p(b)}</li>)}</ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
