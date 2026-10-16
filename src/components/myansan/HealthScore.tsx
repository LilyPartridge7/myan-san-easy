import type { Health } from "@/services/mockConsultant";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

const KIND = {
  strong: { mm: "အားသာချက်", en: "STRONG", cls: "text-primary" },
  attention: { mm: "ဂရုစိုက်ရန်", en: "NEEDS ATTENTION", cls: "text-destructive" },
  opportunity: { mm: "အခွင့်အလမ်း", en: "OPPORTUNITY", cls: "text-muted-foreground" },
} as const;

/** Restaurant Health Score card — initial (from consultation) or sample (connected systems). */
export function HealthScore({ health, sample, compact, onImprove }: { health: Health; sample?: boolean; compact?: boolean; onImprove?: () => void }) {
  const { p } = useT();
  return (
    <div className={cn("rounded-3xl border border-border bg-card", compact ? "p-4" : "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">
          {sample ? p({ mm: "RESTAURANT HEALTH SCORE", en: "RESTAURANT HEALTH SCORE" }) : p({ mm: "INITIAL RESTAURANT HEALTH SCORE", en: "INITIAL RESTAURANT HEALTH SCORE" })}
        </p>
        {null}
      </div>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-4xl font-semibold tracking-tight">{health.total}<span className="text-lg text-muted-foreground"> / 100</span></p>
        <span className={cn("mb-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wider", health.total >= 75 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>
          {p(health.status).toUpperCase()}
        </span>
      </div>
      <ul className="mt-4 space-y-2.5">
        {health.dims.map((d) => (
          <li key={d.key}>
            <div className="flex justify-between text-xs"><span>{p(d.label)}</span><span className="font-medium">{d.score} / 20</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full rounded-full transition-all duration-500", d.score >= 14 ? "bg-primary" : d.score >= 10 ? "bg-primary/60" : "bg-destructive/70")} style={{ width: `${d.score * 5}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <ul className="mt-4 space-y-2 border-t border-border pt-4">
        {health.insights.map((i) => (
          <li key={i.kind} className="text-sm">
            <span className={cn("mr-2 text-[10px] font-bold tracking-widest", KIND[i.kind].cls)}>{p(KIND[i.kind])}</span>
            {p(i.text)}
          </li>
        ))}
      </ul>
      {!sample && (
        <p className="mt-3 text-[11px] text-muted-foreground">
          {p({ mm: "လက်ရှိ Setup အကဲဖြတ်ချက်ပေါ် အခြေခံထားပါတယ်။ မြန်ဆန် System တွေ ချိတ်ပြီးသုံးလာရင် Score ပိုတိကျလာပါမယ်။", en: "Based on your current setup assessment. Your score becomes more accurate as your restaurant starts using connected MyanSan systems." })}
        </p>
      )}
      {onImprove && (
        <button onClick={onImprove} className="mt-4 min-h-11 rounded-full border border-primary px-5 text-sm font-medium text-primary hover:bg-primary/5">
          {p({ mm: "ဘယ်လိုပိုကောင်းအောင်လုပ်မလဲ ကြည့်မယ်", en: "See How to Improve" })}
        </button>
      )}
    </div>
  );
}
