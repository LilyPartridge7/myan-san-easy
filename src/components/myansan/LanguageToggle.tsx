import { useSetup } from "@/state/setupStore";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

/** Myanmar / English font-and-language mode switch. Used in the top nav. */
export function LanguageToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { state, update } = useSetup();
  const { t } = useT();
  const options = [
    { id: "mm" as const, label: "မြန်မာ", short: "မြန်" },
    { id: "en" as const, label: "English", short: "EN" },
  ];

  return (
    <div
      role="group"
      aria-label={t("langGroupLabel")}
      className={cn(
        "flex items-center gap-0.5 rounded-full border p-0.5",
        tone === "dark" ? "border-white/40 bg-white/10" : "border-border bg-card",
      )}
    >
      {options.map((o) => {
        const active = state.language === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => update({ language: o.id })}
            className={cn(
              "min-h-9 rounded-full px-3 text-xs font-semibold transition-colors",
              active
                ? tone === "dark"
                  ? "bg-white text-[oklch(0.28_0.06_260)] shadow-sm"
                  : "bg-primary text-primary-foreground shadow-sm"
                : tone === "dark"
                  ? "font-medium text-white/70 hover:bg-white/10"
                  : "font-medium text-muted-foreground hover:bg-muted",
            )}
          >
            <span className="hidden sm:inline">{o.label}</span>
            <span className="sm:hidden">{o.short}</span>
          </button>
        );
      })}
    </div>
  );
}
