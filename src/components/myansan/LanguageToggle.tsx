import { useSetup } from "@/state/setupStore";
import { cn } from "@/lib/utils";

/** Myanmar / English font-and-language mode switch. Used in the top nav. */
export function LanguageToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { state, update } = useSetup();
  const options = [
    { id: "mm" as const, label: "မြန်မာ", short: "မြန်" },
    { id: "en" as const, label: "English", short: "EN" },
  ];

  return (
    <div
      role="group"
      aria-label="Language and font mode"
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
              "min-h-9 rounded-full px-3 text-xs font-medium transition-colors",
              active
                ? tone === "dark"
                  ? "bg-white text-[oklch(0.28_0.06_260)]"
                  : "bg-primary text-primary-foreground"
                : tone === "dark"
                  ? "text-white/80 hover:bg-white/10"
                  : "text-muted-foreground hover:bg-muted",
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