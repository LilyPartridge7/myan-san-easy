import { useEffect, useState } from "react";
import { useT } from "@/i18n";

const STEPS = [
  { en: "Problem", mm: "အခက်အခဲ", tone: "bg-accent-orange" },
  { en: "Recommendation", mm: "အကြံပြုချက်", tone: "bg-accent-violet" },
  { en: "MyanSan Help", mm: "မြန်ဆန် အကူအညီ", tone: "bg-accent-cyan" },
  { en: "Paid", mm: "ငွေရှင်းပြီး", tone: "bg-accent-green" },
  { en: "Your Growth", mm: "သင့်ဆိုင် တိုးတက်မှု", tone: "bg-accent-violet" },
];

export function HeroFlow() {
  const { p } = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % STEPS.length), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <ol className="mt-6 flex flex-wrap items-center gap-1.5" aria-label={p({ en: "How MyanSan works", mm: "မြန်ဆန် အလုပ်ပုံ" })}>
      {STEPS.map((s, k) => {
        const on = k <= i;
        return (
          <li key={s.en} className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-500 ${
                k === i ? "scale-105 border-white/70 bg-white/20 text-white" : on ? "border-white/30 bg-white/10 text-white/90" : "border-white/15 text-white/45"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${s.tone} ${k === i ? "animate-pulse" : ""}`} />
              {p(s)}
            </span>
            {k < STEPS.length - 1 ? <span className={`text-[10px] ${on ? "text-white/70" : "text-white/25"}`}>→</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
