import { IMAGES } from "@/data/images";
import type { WebsiteStyle } from "@/state/setupStore";
import { cn } from "@/lib/utils";

const STYLES: { id: WebsiteStyle; label: string; note: string; image: string }[] = [
  { id: "warm", label: "Warm & Friendly", note: "အိမ်လိုနွေးထွေးတဲ့ ခံစားမှု", image: IMAGES.diningWarm },
  { id: "modern", label: "Modern & Clean", note: "ရိုးရှင်း လတ်ဆတ်တဲ့ ပုံစံ", image: IMAGES.table },
  { id: "traditional", label: "Traditional", note: "ရိုးရာ အရသာနဲ့ ဧည့်ဝတ်", image: IMAGES.gallery2 },
  { id: "luxury", label: "Luxury", note: "ဇိမ်ခံ ရင်သပ်ရှုမောဖွယ်", image: IMAGES.heroInterior },
];

export function WebsiteStyleSelector({
  value,
  onChange,
}: {
  value: WebsiteStyle | null;
  onChange: (s: WebsiteStyle) => void;
}) {
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
              alt={s.label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="bg-card p-3">
            <p className="text-[15px] font-semibold">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.note}</p>
          </div>
        </button>
      ))}
    </div>
  );
}