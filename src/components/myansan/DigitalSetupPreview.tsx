import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { RestaurantPreview } from "@/components/myansan/RestaurantPreview";
import { IMAGES } from "@/data/images";
import { MENU, formatMMK } from "@/data/menu";
import type { SystemRec } from "@/services/mockConsultant";
import type { Template } from "@/state/setupStore";
import type { L } from "@/i18n/types";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

type TabId = "overview" | "pos" | "kitchen" | "website" | "qr" | "owner" | "integration" | "training";

const TAB_LABEL: Record<TabId, L> = {
  overview: { mm: "အကျဉ်းချုပ်", en: "Overview" },
  pos: { mm: "POS", en: "POS" },
  kitchen: { mm: "Kitchen", en: "Kitchen" },
  website: { mm: "Website", en: "Website" },
  qr: { mm: "QR Ordering", en: "QR Ordering" },
  owner: { mm: "Owner View", en: "Owner View" },
  integration: { mm: "လက်ရှိ POS ချိတ်ဆက်မှု", en: "Existing POS Integration" },
  training: { mm: "Staff Training", en: "Staff Training" },
};

const BENEFIT: Record<Exclude<TabId, "overview">, L> = {
  pos: { mm: "Table Order တွေကို တစ်နေရာတည်းမှာ စီမံပြီး လက်ဖြင့်လုပ်ရတာ လျှော့နိုင်မယ်။", en: "Keep table orders organized and reduce manual work." },
  kitchen: { mm: "Order အသစ်တွေကို Kitchen က ရှင်းရှင်းလင်းလင်း မြင်ပြီး နောက်ကျမှု လျှော့နိုင်မယ်။", en: "Reduce delays between service staff and kitchen." },
  website: { mm: "သင့်ဆိုင်ကို Online မှာ Professional ဖြစ်အောင် ပြနိုင်မယ်။", en: "Give your restaurant a professional online presence." },
  qr: { mm: "Customer က Table ကနေ Order တင်နိုင်လို့ Waiter ရဲ့အလုပ်ကို လျှော့ပေးနိုင်မယ်။", en: "Reduce how many orders waiters need to take manually." },
  owner: { mm: "ဆိုင်မှာမရှိတဲ့အချိန်တောင် အရေးကြီးတဲ့အခြေအနေတွေကို ကြည့်နိုင်မယ်။", en: "See important restaurant activity without checking everything manually." },
  integration: { mm: "POS အသစ်ထပ်မဝယ်ဘဲ လက်ရှိ System ကို ချိတ်ဆက်ပေးမယ်။", en: "Connect the POS you already use instead of buying another one." },
  training: { mm: "Staff အသစ်တွေ System ကို မြန်မြန်သင်ယူနိုင်မယ်။", en: "Help new staff learn the system faster." },
};

function tabsFor(systems: SystemRec[]): TabId[] {
  const ids = new Set(systems.map((s) => s.id));
  if (ids.size === 0) return ["overview", "website", "qr", "training"];
  const tabs: TabId[] = ["overview"];
  if (ids.has("pos_order_management")) tabs.push("pos");
  if (ids.has("kitchen_order_screen")) tabs.push("kitchen");
  if (ids.has("restaurant_website")) tabs.push("website");
  if (ids.has("qr_ordering") || ids.has("digital_menu") || ids.has("menu_management")) tabs.push("qr");
  if (ids.has("reporting")) tabs.push("owner");
  if (ids.has("integration")) tabs.push("integration");
  if (ids.has("staff_training")) tabs.push("training");
  return tabs;
}

function SampleBadge() {
  const { p } = useT();
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-primary">
      {p({ mm: "နမူနာ Preview", en: "SAMPLE PREVIEW" })}
    </span>
  );
}

function Panel({ tab, children }: { tab: Exclude<TabId, "overview">; children: React.ReactNode }) {
  const { p } = useT();
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{p(TAB_LABEL[tab])}</h2>
        <SampleBadge />
      </div>
      <p className="mb-6 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        {p(BENEFIT[tab])}
      </p>
      {children}
    </section>
  );
}

const ORDER = [
  { name: "Chicken Hotpot", qty: 1, price: 12000 },
  { name: "Premium Beef", qty: 2, price: 7500 },
  { name: "Milk Tea", qty: 2, price: 4000 },
];

function POSPreview() {
  const { p } = useT();
  const tables = [
    { n: "03", s: { mm: "ပေးပြီး", en: "Served" } },
    { n: "07", s: { mm: "ပြင်ဆင်နေ", en: "Preparing" } },
    { n: "12", s: { mm: "Order အသစ်", en: "New Order" } },
  ];
  return (
    <Panel tab="pos">
      <div className="grid gap-4 md:grid-cols-[1fr_1.3fr]">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground">{p({ mm: "TABLE များ", en: "TABLES" })}</p>
          <div className="space-y-2">
            {tables.map((t) => (
              <div key={t.n} className={cn("flex items-center justify-between rounded-xl border px-4 py-3", t.n === "07" ? "border-primary bg-primary/5" : "border-border")}>
                <span className="font-medium">Table {t.n}</span>
                <span className="text-xs text-muted-foreground">{p(t.s)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">TABLE 07</p>
          <ul className="mt-3 divide-y divide-border">
            {ORDER.map((o) => (
              <li key={o.name} className="flex justify-between py-2 text-sm">
                <span>{o.name} ×{o.qty}</span>
                <span className="text-muted-foreground">{formatMMK(o.qty * o.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between font-semibold">
            <span>{p({ mm: "စုစုပေါင်း", en: "Total" })}</span>
            <span>{formatMMK(35000)}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[{ mm: "Order အသစ်", en: "New Order" }, { mm: "Item ထည့်", en: "Add Item" }, { mm: "ငွေရှင်း", en: "Payment" }, { mm: "ပြီးပြီ", en: "Complete" }].map((b, i) => (
              <span key={i} className={cn("inline-flex min-h-11 items-center justify-center rounded-full px-3 text-sm font-medium", i === 3 ? "bg-primary text-primary-foreground" : "border border-border")}>
                {p(b)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

type KCard = { table: string; items: string[]; col: 0 | 1 | 2 };
function KitchenPreview() {
  const { p } = useT();
  const [cards, setCards] = useState<KCard[]>([
    { table: "07", items: ["Chicken Hotpot ×1", "Premium Beef ×2"], col: 0 },
    { table: "03", items: ["Seafood Hotpot ×1"], col: 1 },
    { table: "11", items: ["Milk Tea ×2"], col: 2 },
  ]);
  const cols: L[] = [{ mm: "အသစ်", en: "NEW" }, { mm: "ပြင်ဆင်နေ", en: "PREPARING" }, { mm: "အဆင်သင့်", en: "READY" }];
  const move = (t: string) => setCards((cs) => cs.map((c) => (c.table === t && c.col < 2 ? { ...c, col: (c.col + 1) as 1 | 2 } : c)));
  return (
    <Panel tab="kitchen">
      <div className="grid gap-4 md:grid-cols-3">
        {cols.map((label, ci) => (
          <div key={ci} className="rounded-2xl border border-border bg-muted/40 p-3">
            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground">{p(label)}</p>
            <div className="space-y-3">
              {cards.filter((c) => c.col === ci).map((c) => (
                <div key={c.table} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-lg font-semibold">TABLE {c.table}</p>
                  <ul className="mt-2 space-y-1 text-[15px]">
                    {c.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                  {ci < 2 && (
                    <button onClick={() => move(c.table)} className="mt-3 min-h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {ci === 0 ? p({ mm: "စမယ်", en: "Start" }) : p({ mm: "အဆင်သင့်", en: "Ready" })}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function QRPreviewTab({ name }: { name: string }) {
  const { p } = useT();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placed, setPlaced] = useState(false);
  const items = MENU.filter((m) => !m.soldOut).slice(0, 4);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = items.reduce((a, m) => a + (cart[m.id] ?? 0) * m.price, 0);
  return (
    <Panel tab="qr">
      <div className="mx-auto max-w-sm overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="px-5 py-4">
          <p className="text-xs tracking-[0.3em] text-muted-foreground">{name}</p>
          <p className="font-semibold">Table 07</p>
        </div>
        <ul className="divide-y divide-border">
          {items.map((m) => (
            <li key={m.id} className="flex items-center gap-3 px-5 py-3">
              <img src={m.image} alt={m.name} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{formatMMK(m.price)}</p>
              </div>
              <button onClick={() => { setPlaced(false); setCart((c) => ({ ...c, [m.id]: (c[m.id] ?? 0) + 1 })); }} className="min-h-10 rounded-full border border-border px-4 text-sm font-medium">
                {cart[m.id] ? `×${cart[m.id]}` : p({ mm: "ထည့်", en: "Add" })}
              </button>
            </li>
          ))}
        </ul>
        <div className="p-4">
          <button disabled={count === 0} onClick={() => { setPlaced(true); setCart({}); }} className="min-h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50">
            {placed ? p({ mm: "Order ရောက်ပါပြီ ✓", en: "Order received ✓" }) : `${p({ mm: "Order တင်မယ်", en: "Place Order" })}${count ? ` · ${formatMMK(total)}` : ""}`}
          </button>
        </div>
      </div>
    </Panel>
  );
}

function TrainingPreview() {
  const { p } = useT();
  const lessons: [L, string][] = [
    [{ mm: "Order အသစ်ဘယ်လိုကြည့်မလဲ", en: "Taking and checking orders" }, "3"],
    [{ mm: "Kitchen Screen ဘယ်လိုသုံးမလဲ", en: "Using the kitchen screen" }, "4"],
    [{ mm: "Sold Out ဘယ်လိုပြောင်းမလဲ", en: "Marking items sold out" }, "2"],
    [{ mm: "အကူအညီ ဘယ်လိုတောင်းမလဲ", en: "Getting support" }, "2"],
  ];
  return (
    <Panel tab="training">
      <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground">{p({ mm: "STAFF အမြန်လေ့ကျင့်ခန်း", en: "STAFF QUICK TRAINING" })}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {lessons.map(([title, min], i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Lesson {i + 1} · {min} min</p>
            <p className="mt-1 font-medium">{p(title)}</p>
            <span className="mt-3 inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm">{p({ mm: "Lesson ကြည့်မယ်", en: "Preview Lesson" })}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function OwnerPreview() {
  const { p } = useT();
  const stats: [L, string][] = [
    [{ mm: "ရောင်းအား", en: "Sales" }, formatMMK(320000)],
    [{ mm: "Order", en: "Orders" }, "42"],
    [{ mm: "အလုပ်အများဆုံးအချိန်", en: "Busy Time" }, "12:00–1:30 PM"],
    [{ mm: "Sold Out", en: "Sold Out" }, "2 items"],
    [{ mm: "ဆိုင်ခွဲ", en: "Branch Status" }, "2 active"],
  ];
  return (
    <Panel tab="owner">
      <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground">{p({ mm: "ယနေ့", en: "TODAY" })}</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map(([l, v], i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{p(l)}</p>
            <p className="mt-1 text-lg font-semibold">{v}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function IntegrationPreview() {
  const { p } = useT();
  const steps: L[] = [
    { mm: "လက်ရှိ POS ကို ဆက်သုံးမယ်", en: "Keep your current POS" },
    { mm: "QR / Kitchen / Report ကို ချိတ်ဆက်မယ်", en: "Connect QR, kitchen and reports to it" },
    { mm: "ဆိုင်ခွဲအားလုံးကို တစ်နေရာတည်းက ကြည့်မယ်", en: "See all branches from one place" },
  ];
  return (
    <Panel tab="integration">
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{i + 1}</span>
            <span>{p(s)}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function DigitalSetupPreview({
  systems,
  name,
  tagline,
  color,
  template,
}: {
  systems: SystemRec[];
  name: string;
  tagline: string;
  color: string;
  template: Template;
}) {
  const { p } = useT();
  const tabs = useMemo(() => tabsFor(systems), [systems]);
  const [active, setActive] = useState<TabId>("overview");
  const current = tabs.includes(active) ? active : "overview";

  return (
    <div>
      <header className="mx-auto max-w-5xl px-4 pt-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {p({ mm: "သင့်ဆိုင် Digital Setup ကို ကြည့်မယ်", en: "Preview Your Digital Setup" })}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {p({ mm: "သင့်ဆိုင်အတွက် အကြံပြုထားတဲ့ System နမူနာတွေကို ကြည့်နိုင်ပါတယ်။", en: "See sample systems recommended for your restaurant." })}
        </p>
      </header>
      <nav className="sticky top-[61px] z-30 mt-6 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-3">
          {tabs.map((id) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                "min-h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
                current === id ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground",
              )}
            >
              {p(TAB_LABEL[id])}
            </button>
          ))}
        </div>
      </nav>

      <div key={current} className="page-enter">
        {current === "overview" && (
          <section className="mx-auto max-w-5xl px-4 py-8">
            <p className="text-xs tracking-[0.3em] text-muted-foreground">{name}</p>
            <h2 className="mt-1 text-xl font-semibold">{p({ mm: "သင့်ဆိုင်အတွက် အကြံပြု Digital Setup", en: "Your Recommended Digital Setup" })}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(systems.length ? systems : []).map((s) => (
                <div key={s.id} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{p(s.label)}</p>
                    <p className="text-sm text-muted-foreground">{p(s.why)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {tabs.filter((x) => x !== "overview").map((id) => (
                <button key={id} onClick={() => setActive(id)} className="min-h-11 rounded-full border border-border bg-card px-5 text-sm font-medium">
                  {p({ mm: `${p(TAB_LABEL[id])} ကြည့်မယ်`, en: `View ${p(TAB_LABEL[id])}` })}
                </button>
              ))}
            </div>
          </section>
        )}
        {current === "pos" && <POSPreview />}
        {current === "kitchen" && <KitchenPreview />}
        {current === "qr" && <QRPreviewTab name={name} />}
        {current === "training" && <TrainingPreview />}
        {current === "owner" && <OwnerPreview />}
        {current === "integration" && <IntegrationPreview />}
        {current === "website" && (
          <div>
            <div className="mx-auto max-w-5xl px-4 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{p(BENEFIT.website)}</p>
                <SampleBadge />
              </div>
            </div>
            <div className="mt-4">
              <RestaurantPreview template={template} name={name} tagline={tagline} color={color} heroImage={IMAGES.heroInterior} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
