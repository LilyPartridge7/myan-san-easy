import { IMAGES } from "@/data/images";
import type { WebsiteStyle } from "@/state/setupStore";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import type { L } from "@/i18n/types";

const STYLES: { id: WebsiteStyle; label: L; note: L; image: string }[] = [
  {
    id: "warm",
    label: { mm: "Warm & Friendly", en: "Warm & Friendly" },
    note: { mm: "အိမ်လိုနွေးထွေးတဲ့ ခံစားမှု", en: "A warm, homely feeling" },
    image: IMAGES.diningWarm,
  },
  {
    id: "modern",
    label: { mm: "Modern & Clean", en: "Modern & Clean" },
    note: { mm: "ရိုးရှင်း လတ်ဆတ်တဲ့ ပုံစံ", en: "A simple, fresh look" },
    image: IMAGES.table,
  },
  {
    id: "traditional",
    label: { mm: "Traditional", en: "Traditional" },
    note: { mm: "ရိုးရာ အရသာနဲ့ ဧည့်ဝတ်", en: "Traditional flavor and hospitality" },
    image: IMAGES.gallery2,
  },
  {
    id: "luxury",
    label: { mm: "Luxury", en: "Luxury" },
    note: { mm: "ဇိမ်ခံ ရင်သပ်ရှုမောဖွယ်", en: "Luxurious and stunning" },
    image: IMAGES.heroInterior,
  },
];

export function WebsiteStyleSelector({
  value,
  onChange,
}: {
  value: WebsiteStyle | null;
  onChange: (s: WebsiteStyle) => void;
}) {
  const { p } = useT();
  return (
    <div className="grid grid-cols-2 gap-3">
      {STYLES.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={cn(
            "group overflow-hidden rounded-2xl border text-left transition-all",
            value === s.id ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50",
          )}
        >
          <div className="relative h-24 overflow-hidden sm:h-32">
            <img
              src={s.image}
              alt={p(s.label)}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="bg-card p-3">
            <p className="text-[15px] font-semibold">{p(s.label)}</p>
            <p className="text-xs text-muted-foreground">{p(s.note)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
