import { useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { RestaurantPreview } from "@/components/myansan/RestaurantPreview";
import { IMAGES } from "@/data/images";
import { formatMMK } from "@/data/menu";
import { PACKAGES, SYSTEM_AVAILABILITY, systemInclusion, type PackageId } from "@/data/packages";
import { monthlyLabel, setupLabel } from "@/data/pricing";
import type { SystemRec } from "@/services/mockConsultant";
import type { Template } from "@/state/setupStore";
import type { L } from "@/i18n/types";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { QRPreview } from "@/components/myansan/QRPreview";
import { WebsiteStyleSelector } from "@/components/myansan/WebsiteStyleSelector";
import { useSetupOptional } from "@/state/setupStore";
import { CoachTab, FeedbackTab, HealthTab } from "@/components/myansan/ImproveTabs";

type TabId = "overview" | "pos" | "kitchen" | "website" | "qr" | "owner" | "integration" | "training" | "health" | "coach" | "feedback";

const TAB_LABEL: Record<TabId, L> = {
  overview: { mm: "အကျဉ်းချုပ်", en: "Overview" },
  pos: { mm: "POS", en: "POS" },
  kitchen: { mm: "Kitchen", en: "Kitchen" },
  website: { mm: "Website", en: "Website" },
  qr: { mm: "QR Ordering", en: "QR Ordering" },
  owner: { mm: "Owner View", en: "Owner View" },
  integration: { mm: "POS ချိတ်ဆက်မှု", en: "POS Integration" },
  training: { mm: "Staff Training", en: "Staff Training" },
  health: { mm: "Health Score", en: "Health Score" },
  coach: { mm: "Growth Coach", en: "Growth Coach" },
  feedback: { mm: "Feedback", en: "Feedback" },
};

const TAB_SYSTEM: Record<Exclude<TabId, "overview" | "health" | "coach" | "feedback">, string> = {
  pos: "pos_order_management",
  kitchen: "kitchen_order_screen",
  website: "restaurant_website",
  qr: "qr_ordering",
  owner: "reporting",
  integration: "integration",
  training: "staff_training",
};

function tabsFor(systems: SystemRec[]): TabId[] {
  const ids = new Set(systems.map((s) => s.id));
  const improve: TabId[] = ["health", "feedback", "coach"];
  if (ids.size === 0) return ["overview", "qr", "pos", "kitchen", "website", "training", ...improve];
  const tabs: TabId[] = ["overview"];
  if (ids.has("qr_ordering") || ids.has("digital_menu") || ids.has("menu_management")) tabs.push("qr");
  if (ids.has("pos_order_management")) tabs.push("pos");
  if (ids.has("kitchen_order_screen")) tabs.push("kitchen");
  if (ids.has("restaurant_website")) tabs.push("website");
  if (ids.has("staff_training")) tabs.push("training");
  if (ids.has("reporting")) tabs.push("owner");
  if (ids.has("integration")) tabs.push("integration");
  return [...tabs, ...improve];
}

/* ---------- One consistent demo dataset ---------- */
type Cat = "Popular" | "Hotpot" | "Meat" | "Drinks";
type Dish = { id: string; name: string; mm: string; price: number; cat: Cat; img: string };
const DISHES: Dish[] = [
  { id: "chicken", name: "Chicken Hotpot", mm: "ကြက်သား Hotpot", price: 12000, cat: "Popular", img: IMAGES.hotpot },
  { id: "seafood", name: "Seafood Hotpot", mm: "ပင်လယ်စာ Hotpot", price: 18000, cat: "Hotpot", img: IMAGES.food1 },
  { id: "beef", name: "Premium Beef", mm: "အမဲသား Premium", price: 22000, cat: "Meat", img: IMAGES.food2 },
  { id: "veg", name: "Vegetable Set", mm: "ဟင်းသီးဟင်းရွက် Set", price: 6000, cat: "Hotpot", img: IMAGES.food3 },
  { id: "milktea", name: "Milk Tea", mm: "လက်ဖက်ရည်", price: 3000, cat: "Drinks", img: IMAGES.drink },
  { id: "soda", name: "Soft Drink", mm: "အအေး", price: 2000, cat: "Drinks", img: IMAGES.gallery3 },
];
const dish = (id: string) => DISHES.find((d) => d.id === id)!;

type Status = "new" | "sent" | "preparing" | "ready" | "paid";
type Order = { id: string; table: string; items: Record<string, number>; status: Status; minAgo: number; pay?: string };
const orderTotal = (o: Order) => Object.entries(o.items).reduce((a, [k, q]) => a + dish(k).price * q, 0);

const SEED: Order[] = [
  { id: "A099", table: "12", items: { chicken: 2 }, status: "ready", minAgo: 12 },
  { id: "A101", table: "03", items: { seafood: 1, veg: 1 }, status: "preparing", minAgo: 8 },
  { id: "A102", table: "02", items: { beef: 1, soda: 2 }, status: "paid", minAgo: 25, pay: "KBZPay" },
];

const STATUS_L: Record<Status, L> = {
  new: { mm: "Order အသစ်", en: "New Order" },
  sent: { mm: "Kitchen ပို့ပြီး", en: "Sent to Kitchen" },
  preparing: { mm: "ပြင်ဆင်နေ", en: "Preparing" },
  ready: { mm: "Ready", en: "Ready" },
  paid: { mm: "ငွေရှင်းပြီး", en: "Paid" },
};
const STATUS_CLS: Record<Status, string> = {
  new: "bg-primary/15 text-primary",
  sent: "bg-primary/10 text-primary",
  preparing: "bg-accent text-accent-foreground",
  ready: "bg-secondary text-secondary-foreground ring-1 ring-primary/40",
  paid: "bg-muted text-muted-foreground",
};

function StatusPill({ s }: { s: Status }) {
  const { p } = useT();
  return <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", STATUS_CLS[s])}>{p(STATUS_L[s])}</span>;
}

function SampleTag() {
  const { p } = useT();
  return null;
}

function InclusionBadge({ pkg, systemId }: { pkg: PackageId; systemId: string }) {
  const { p } = useT();
  const inc = systemInclusion(pkg, systemId);
  const av = SYSTEM_AVAILABILITY[systemId] ?? "available";
  return (
    <span className="flex flex-wrap gap-1">
      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider", inc === "included" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground")}>
        {inc === "included" ? p({ mm: "ပါဝင်ပြီး", en: "INCLUDED" }) : p({ mm: "ထပ်ထည့်နိုင်", en: "OPTIONAL ADD-ON" })}
      </span>
      {av !== "available" && (
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
          {av === "pilot" ? p({ mm: "ရနိုင်ပါပြီ", en: "AVAILABLE" }) : p({ mm: "မကြာမီ", en: "COMING SOON" })}
        </span>
      )}
    </span>
  );
}

function Frame({ tab, pkg, children, hint }: { tab: keyof typeof TAB_SYSTEM; pkg: PackageId; children: React.ReactNode; hint: L }) {
  const { p } = useT();
  return (
    <section className="ms-page mx-auto px-3 py-5 sm:px-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold">{p(TAB_LABEL[tab])}</h2>
        <InclusionBadge pkg={pkg} systemId={TAB_SYSTEM[tab]} />
        <SampleTag />
      </div>
      <p className="mb-3 text-xs text-muted-foreground">{p(hint)}</p>
      {children}
    </section>
  );
}

/* ---------- QR ordering ---------- */
function QRTab({ name, pkg, onPlace }: { name: string; pkg: PackageId; onPlace: (items: Record<string, number>) => string }) {
  const { p, lang } = useT();
  const [cat, setCat] = useState<Cat | "All">("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placed, setPlaced] = useState<string | null>(null);
  const change = (id: string, d: number) => {
    setPlaced(null);
    setCart((c) => {
      const n = Math.max(0, (c[id] ?? 0) + d);
      const next = { ...c, [id]: n };
      if (!n) delete next[id];
      return next;
    });
  };
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((a, [k, q]) => a + dish(k).price * q, 0);
  const list = DISHES.filter((d) => cat === "All" || d.cat === cat);
  return (
    <Frame tab="qr" pkg={pkg} hint={{ mm: "Customer က Table 07 မှာ QR scan ပြီး မြင်ရမယ့် Screen ပါ။ Order တင်ကြည့်ပြီး POS / Kitchen မှာ စစ်ကြည့်ပါ။", en: "What a customer at Table 07 sees after scanning. Place an order, then check POS and Kitchen." }}>
      <div className="mx-auto max-w-[380px] overflow-hidden rounded-[2.2rem] border-[6px] border-foreground/80 bg-card shadow-xl">
        <div className="border-b border-border px-4 py-3">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-muted-foreground">{name}</p>
          <p className="font-semibold">Table 07</p>
        </div>
        {placed ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-7 w-7" /></div>
            <p className="mt-4 text-lg font-semibold">ORDER #{placed} {p({ mm: "ရောက်ပါပြီ", en: "RECEIVED" })}</p>
            <p className="mt-1 text-sm text-muted-foreground">{p({ mm: "သင့် Order ကို ပြင်ဆင်နေပါပြီ...", en: "Preparing your order..." })}</p>
            <button onClick={() => setPlaced(null)} className="mt-6 min-h-11 rounded-full border border-border px-5 text-sm">{p({ mm: "ထပ်မှာမယ်", en: "Order more" })}</button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto px-4 py-3">
              {(["All", "Popular", "Hotpot", "Meat", "Drinks"] as const).map((c) => (
                <button key={c} onClick={() => setCat(c)} className={cn("min-h-9 shrink-0 rounded-full px-3 text-xs font-medium", cat === c ? "bg-foreground text-background" : "border border-border")}>
                  {c === "All" ? p({ mm: "အားလုံး", en: "All" }) : c}
                </button>
              ))}
            </div>
            <ul className="max-h-[360px] divide-y divide-border overflow-y-auto">
              {list.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-4 py-2.5">
                  <img src={d.img} alt={d.name} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{lang === "mm" ? d.mm : d.name}</p>
                    <p className="text-xs text-muted-foreground">{formatMMK(d.price)}</p>
                  </div>
                  {cart[d.id] ? (
                    <div className="flex items-center gap-2">
                      <button aria-label="remove" onClick={() => change(d.id, -1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-border"><Minus className="h-4 w-4" /></button>
                      <span className="w-4 text-center text-sm font-semibold">{cart[d.id]}</span>
                      <button aria-label="add" onClick={() => change(d.id, 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => change(d.id, 1)} className="min-h-9 rounded-full border border-border px-4 text-sm font-medium">{p({ mm: "ထည့်", en: "Add" })}</button>
                  )}
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-3">
              {count > 0 && (
                <p className="mb-2 text-xs text-muted-foreground">
                  {p({ mm: "Cart", en: "Cart" })}: {Object.entries(cart).map(([k, q]) => `${dish(k).name} ×${q}`).join(", ")}
                </p>
              )}
              <button disabled={!count} onClick={() => { setPlaced(onPlace(cart)); setCart({}); }} className="min-h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50">
                {p({ mm: "Order တင်မယ်", en: "Place Order" })}{count ? ` · ${formatMMK(total)}` : ""}
              </button>
            </div>
          </>
        )}
      </div>
    </Frame>
  );
}

/* ---------- POS ---------- */
function POSTab({ orders, setOrders, pkg }: { orders: Order[]; setOrders: React.Dispatch<React.SetStateAction<Order[]>>; pkg: PackageId }) {
  const { p, lang } = useT();
  const [table, setTable] = useState("07");
  const [paying, setPaying] = useState(false);
  const tables = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, "0"));
  const active = (t: string) => orders.find((o) => o.table === t && o.status !== "paid");
  const cur = active(table);
  const upd = (fn: (o: Order) => Order) => cur && setOrders((os) => os.map((o) => (o.id === cur.id ? fn(o) : o)));
  const editItem = (id: string, d: number) =>
    upd((o) => {
      const items = { ...o.items, [id]: Math.max(0, (o.items[id] ?? 0) + d) };
      if (!items[id]) delete items[id];
      return { ...o, items };
    });
  const tableState = (t: string): { l: L; cls: string } => {
    const o = active(t);
    if (!o) return { l: { mm: "အားတယ်", en: "Available" }, cls: "border-border" };
    return { l: STATUS_L[o.status], cls: o.status === "new" ? "border-primary bg-primary/10" : o.status === "ready" ? "border-primary/50 bg-secondary" : "border-border bg-muted" };
  };
  return (
    <Frame tab="pos" pkg={pkg} hint={{ mm: "Cashier / Waiter သုံးမယ့် Screen ပါ။ Table ကိုနှိပ်ပြီး Order ကြည့်ပါ။", en: "The screen your cashier and waiters use. Tap a table to open its order." }}>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <div className="grid min-w-[760px] grid-cols-[1.1fr_1.3fr_0.9fr]">
          <div className="border-r border-border p-3">
            <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "TABLE များ", en: "TABLES" })} · 20</p>
            <div className="grid grid-cols-4 gap-1.5">
              {tables.map((t) => {
                const s = tableState(t);
                return (
                  <button key={t} onClick={() => { setTable(t); setPaying(false); }} className={cn("rounded-lg border px-1 py-2 text-left", s.cls, table === t && "ring-2 ring-primary")}>
                    <p className="text-sm font-semibold">{t}</p>
                    <p className="truncate text-[9px] text-muted-foreground">{p(s.l)}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="border-r border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "လက်ရှိ ORDER", en: "CURRENT ORDER" })}</p>
              {cur && <StatusPill s={cur.status} />}
            </div>
            <p className="mt-1 text-lg font-semibold">TABLE {table}{cur && <span className="ml-2 text-sm font-normal text-muted-foreground">#{cur.id}</span>}</p>
            {cur ? (
              <>
                <ul className="mt-3 divide-y divide-border">
                  {Object.entries(cur.items).map(([k, q]) => (
                    <li key={k} className="flex items-center justify-between py-2 text-sm">
                      <div>
                        <p className="font-medium">{lang === "mm" ? dish(k).mm : dish(k).name}</p>
                        <p className="text-xs text-muted-foreground">{q} × {dish(k).price.toLocaleString("en-US")}</p>
                      </div>
                      {cur.status === "new" && (
                        <div className="flex gap-1">
                          <button aria-label="less" onClick={() => editItem(k, -1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border"><Minus className="h-3.5 w-3.5" /></button>
                          <button aria-label="more" onClick={() => editItem(k, 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                  <span>{p({ mm: "စုစုပေါင်း", en: "Subtotal" })}</span>
                  <span>{formatMMK(orderTotal(cur))}</span>
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">{p({ mm: "ဒီ Table မှာ Order မရှိသေးပါ။ QR Ordering မှာ Table 07 အတွက် Order တင်ကြည့်ပါ။", en: "No open order. Try placing a Table 07 order in QR Ordering." })}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 p-4">
            <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "လုပ်ဆောင်ချက်", en: "ACTIONS" })}</p>
            <button disabled={!cur || cur.status !== "new"} onClick={() => editItem("milktea", 1)} className="min-h-11 rounded-xl border border-border text-sm font-medium disabled:opacity-40">{p({ mm: "Item ထည့်", en: "Add Item" })}</button>
            <button disabled={!cur || cur.status !== "new"} onClick={() => upd((o) => ({ ...o, status: "sent" }))} className="min-h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-40">{p({ mm: "Kitchen ကို ပို့မယ်", en: "Send to Kitchen" })}</button>
            <button disabled={!cur} onClick={() => setPaying((v) => !v)} className="min-h-11 rounded-xl border border-border text-sm font-medium disabled:opacity-40">{p({ mm: "ငွေရှင်း", en: "Payment" })}</button>
            {paying && cur && (
              <div className="grid gap-1.5 rounded-xl bg-muted p-2">
                {["Cash", "KBZPay", "WavePay"].map((m) => (
                  <button key={m} onClick={() => { upd((o) => ({ ...o, status: "paid", pay: m })); setPaying(false); }} className="min-h-10 rounded-lg bg-card text-sm font-medium">{m}</button>
                ))}
                <p className="text-center text-[10px] text-muted-foreground">DEMO MODE</p>
              </div>
            )}
            <div className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
              {p({ mm: "ယနေ့ Order", en: "Today's orders" })}: {orders.length} · {p({ mm: "ငွေရှင်းပြီး", en: "Paid" })}: {orders.filter((o) => o.status === "paid").map((o) => `#${o.id} ${o.pay}`).join(", ") || "—"}
            </div>
          </div>
        </div>
        <div className="flex min-w-[760px] border-t border-border text-xs font-medium text-muted-foreground">
          {[{ mm: "Table", en: "Tables" }, { mm: "Order", en: "Orders" }, { mm: "Menu", en: "Menu" }, { mm: "Payment", en: "Payments" }].map((n, i) => (
            <span key={i} className={cn("flex-1 py-2.5 text-center", i === 0 && "text-primary")}>{p(n)}</span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ---------- Kitchen ---------- */
function KitchenTab({ orders, setOrders, pkg }: { orders: Order[]; setOrders: React.Dispatch<React.SetStateAction<Order[]>>; pkg: PackageId }) {
  const { p, lang } = useT();
  const cols: { s: Status[]; l: L }[] = [
    { s: ["new", "sent"], l: { mm: "အသစ်", en: "NEW" } },
    { s: ["preparing"], l: { mm: "ပြင်ဆင်နေ", en: "PREPARING" } },
    { s: ["ready"], l: { mm: "READY", en: "READY" } },
  ];
  const move = (id: string, s: Status) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: s } : o)));
  return (
    <Frame tab="kitchen" pkg={pkg} hint={{ mm: "Kitchen ထဲက Screen ပါ။ Order ကို နှိပ်ပြီး ရှေ့ဆက်ရွှေ့ပါ — POS မှာ Status ပါ ပြောင်းသွားမယ်။", en: "The kitchen display. Move orders forward — POS status updates too." }}>
      <div className="overflow-x-auto rounded-2xl bg-foreground/95 p-3">
        <div className="grid min-w-[720px] grid-cols-3 gap-3">
          {cols.map((c, ci) => {
            const list = orders.filter((o) => c.s.includes(o.status));
            return (
              <div key={ci} className="rounded-xl bg-background/10 p-2">
                <p className="mb-2 px-1 text-xs font-bold tracking-widest text-background">{p(c.l)} · {list.length}</p>
                <div className="space-y-2">
                  {list.map((o) => (
                    <div key={o.id} className={cn("rounded-xl bg-card p-3", ci === 0 && "ring-2 ring-primary")}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-lg font-bold">TABLE {o.table}</p>
                        <span className="text-xs text-muted-foreground">{o.minAgo} min</span>
                      </div>
                      <p className="text-xs text-muted-foreground">ORDER #{o.id}</p>
                      <ul className="mt-2 space-y-0.5 text-[15px] font-medium">
                        {Object.entries(o.items).map(([k, q]) => <li key={k}>{lang === "mm" ? dish(k).mm : dish(k).name} ×{q}</li>)}
                      </ul>
                      {ci === 0 && <button onClick={() => move(o.id, "preparing")} className="mt-3 min-h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground">{p({ mm: "စပြင်မယ်", en: "Start Preparing" })}</button>}
                      {ci === 1 && <button onClick={() => move(o.id, "ready")} className="mt-3 min-h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground">{p({ mm: "Ready လုပ်မယ်", en: "Mark Ready" })}</button>}
                      {ci === 2 && <p className="mt-2 text-xs font-semibold text-primary">✓ READY</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

/* ---------- Training ---------- */
const LESSONS: { t: L; steps: L[] }[] = [
  {
    t: { mm: "Order အသစ်ရောက်လာရင် ဘယ်လိုလုပ်မလဲ", en: "How to Handle a New Order" },
    steps: [
      { mm: "NEW column မှာ Order ကိုကြည့်ပါ။", en: "Check the NEW order column." },
      { mm: "Table Number ကိုစစ်ပါ။", en: "Confirm the table number." },
      { mm: "\"စပြင်မယ်\" ကိုနှိပ်ပါ။", en: "Press \"Start Preparing\"." },
      { mm: "ပြီးရင် \"Ready\" လုပ်ပါ။", en: "When food is finished, press \"Ready\"." },
    ],
  },
  { t: { mm: "QR Order ကို POS မှာ စစ်နည်း", en: "Checking QR orders in POS" }, steps: [{ mm: "Table ကို နှိပ်ပါ။", en: "Tap the table." }, { mm: "Item တွေ မှန်မမှန် စစ်ပါ။", en: "Check the items are correct." }, { mm: "Kitchen ကို ပို့ပါ။", en: "Send to kitchen." }] },
  { t: { mm: "Sold Out ပြောင်းနည်း", en: "Marking items sold out" }, steps: [{ mm: "Menu ကို ဖွင့်ပါ။", en: "Open Menu." }, { mm: "Item ကို Sold Out လုပ်ပါ။", en: "Switch the item to Sold Out." }] },
  { t: { mm: "ငွေရှင်းနည်း", en: "Taking payment" }, steps: [{ mm: "Payment ကို နှိပ်ပါ။", en: "Tap Payment." }, { mm: "Cash / KBZPay / WavePay ရွေးပါ။", en: "Choose Cash, KBZPay or WavePay." }] },
];
function TrainingTab({ pkg }: { pkg: PackageId }) {
  const { p } = useT();
  const [open, setOpen] = useState<number | null>(0);
  const [done, setDone] = useState<number[]>([]);
  return (
    <Frame tab="training" pkg={pkg} hint={{ mm: "Staff အသစ်တွေ ဖုန်းကနေ သင်ယူနိုင်တဲ့ Lesson တိုလေးတွေပါ။", en: "Short lessons new staff can follow on a phone." }}>
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">{p({ mm: "STAFF အမြန်လေ့ကျင့်ခန်း", en: "STAFF QUICK TRAINING" })}</p>
          <p className="text-xs font-medium">{done.length} / {LESSONS.length} {p({ mm: "ပြီး", en: "lessons completed" })}</p>
        </div>
        <div className="h-1.5 bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(done.length / LESSONS.length) * 100}%` }} /></div>
        {LESSONS.map((l, i) => (
          <div key={i} className="border-b border-border last:border-0">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex min-h-14 w-full items-center gap-3 px-4 text-left">
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold", done.includes(i) ? "bg-primary text-primary-foreground" : "bg-muted")}>{done.includes(i) ? <Check className="h-4 w-4" /> : i + 1}</span>
              <span className="flex-1 text-sm font-medium">{p(l.t)}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4">
                <ol className="space-y-2">
                  {l.steps.map((s, si) => (
                    <li key={si} className="rounded-xl bg-muted/60 px-3 py-2 text-sm"><span className="mr-2 text-xs font-semibold text-primary">Step {si + 1}</span>{p(s)}</li>
                  ))}
                </ol>
                <button onClick={() => { setDone((d) => (d.includes(i) ? d : [...d, i])); setOpen(i + 1 < LESSONS.length ? i + 1 : null); }} className="mt-3 min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                  {p({ mm: "Lesson ပြီးပြီ", en: "Complete Lesson" })}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- Owner ---------- */
function OwnerTab({ pkg, branches }: { pkg: PackageId; branches: boolean }) {
  const { p } = useT();
  const stats: [L, string][] = [
    [{ mm: "ရောင်းအား", en: "Sales" }, formatMMK(320000)],
    [{ mm: "Order", en: "Orders" }, "42"],
    [{ mm: "ပျမ်းမျှ Order", en: "Average Order" }, formatMMK(7620)],
    [{ mm: "လူရှိ Table", en: "Occupied Tables" }, "8 / 20"],
    [{ mm: "အလုပ်အများဆုံး", en: "Busy Time" }, "12:00–1:30 PM"],
    [{ mm: "Sold Out", en: "Sold Out" }, "2 items"],
  ];
  return (
    <Frame tab="owner" pkg={pkg} hint={{ mm: "ဆိုင်ရှင် ဖုန်းကနေ ကြည့်မယ့် ယနေ့အခြေအနေ။", en: "Today at a glance, from the owner's phone." }}>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        {stats.map(([l, v], i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[11px] text-muted-foreground">{p(l)}</p>
            <p className="mt-1 font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "အရောင်းရဆုံး", en: "TOP ITEMS" })}</p>
          {[["Chicken Hotpot", 18], ["Milk Tea", 15], ["Premium Beef", 11]].map(([n, c]) => (
            <div key={n} className="py-1.5 text-sm">
              <div className="flex justify-between"><span>{n}</span><span className="text-muted-foreground">{c} orders</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(Number(c) / 18) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        {branches && (
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "ဆိုင်ခွဲ", en: "BRANCHES" })}</p>
            {[["Branch 1", 185000], ["Branch 2", 135000]].map(([n, v]) => (
              <div key={n} className="flex justify-between py-1.5 text-sm"><span>{n} — {p({ mm: "ဖွင့်", en: "Open" })}</span><span>{formatMMK(Number(v))}</span></div>
            ))}
          </div>
        )}
      </div>
    </Frame>
  );
}

function IntegrationTab({ pkg }: { pkg: PackageId }) {
  const { p } = useT();
  const steps: L[] = [
    { mm: "လက်ရှိ POS ကို ဆက်သုံးမယ်", en: "Keep your current POS" },
    { mm: "QR / Kitchen / Report ကို ချိတ်ဆက်မယ်", en: "Connect QR, kitchen and reports to it" },
    { mm: "ဆိုင်ခွဲအားလုံးကို တစ်နေရာတည်းက ကြည့်မယ်", en: "See all branches from one place" },
  ];
  return (
    <Frame tab="integration" pkg={pkg} hint={{ mm: "POS အသစ်ထပ်မဝယ်ဘဲ လက်ရှိ System ကို ချိတ်ဆက်ပေးမယ်။", en: "Connect the POS you already use instead of buying another one." }}>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>{p(s)}
          </li>
        ))}
      </ol>
    </Frame>
  );
}

export function DigitalSetupPreview({
  systems, name, tagline, color, template, packageId, basedOn, branches, onChoose, onCustomize,
}: {
  systems: SystemRec[];
  name: string;
  tagline: string;
  color: string;
  template: Template;
  packageId: PackageId;
  basedOn: string[];
  branches: boolean;
  onChoose: () => void;
  onCustomize: () => void;
}) {
  const { p, lang } = useT();
  const setup = useSetupOptional();
  const tabs = useMemo(() => tabsFor(systems), [systems]);
  const [active, setActive] = useState<TabId>("overview");
  const current = tabs.includes(active) ? active : "overview";
  const [orders, setOrders] = useState<Order[]>(SEED);
  const [seq, setSeq] = useState(104);
  const pkg = PACKAGES.find((x) => x.id === packageId)!;
  const pkgName = p(pkg.name);
  const included = systems.filter((s) => systemInclusion(packageId, s.id) === "included");

  const placeOrder = (items: Record<string, number>) => {
    const id = `A${seq}`;
    setSeq((n) => n + 1);
    setOrders((os) => [{ id, table: "07", items, status: "new", minAgo: 0 }, ...os.filter((o) => !(o.table === "07" && o.status !== "paid"))]);
    return id;
  };

  return (
    <div>
      <header className="ms-page mx-auto px-4 pt-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{p({ mm: "သင့်ဆိုင် Digital Setup ကို ကြည့်မယ်", en: "Preview Your Digital Setup" })}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {p({ mm: `${pkgName} Package ထဲပါတဲ့ System တွေကို ကြည့်နေပါတယ်`, en: `You are viewing systems included in ${pkgName}` })}
        </p>
      </header>
      <nav className="sticky top-[61px] z-30 mt-4 border-b border-border bg-background/95 backdrop-blur">
        <div className="ms-page mx-auto flex gap-2 overflow-x-auto px-4 py-2.5">
          {tabs.map((id) => (
            <button key={id} onClick={() => setActive(id)} className={cn("min-h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-colors", current === id ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground")}>
              {p(TAB_LABEL[id])}
              {id === "pos" && orders.some((o) => o.status === "new") && <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-destructive" />}
            </button>
          ))}
        </div>
      </nav>

      <div key={current} className="page-enter">
        {current === "overview" && (
          <section className="mx-auto max-w-4xl px-4 py-6">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
              <p className="text-xs tracking-[0.3em] text-muted-foreground">{name}</p>
              <h2 className="mt-1 text-lg font-semibold">{p({ mm: "သင့်ဆိုင်အတွက် အကြံပြု Digital Setup", en: "Your Recommended Digital Setup" })}</h2>
              <p className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-widest text-primary">{pkgName.toUpperCase()} PACKAGE</p>
              {basedOn.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "အခြေခံထားတာ", en: "BASED ON" })}</p>
                  <ul className="mt-1 flex flex-wrap gap-1.5">{basedOn.map((b) => <li key={b} className="rounded-full bg-muted px-3 py-1 text-xs">{b}</li>)}</ul>
                </div>
              )}
              <ul className="mt-5 divide-y divide-border">
                {systems.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
                    <div className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div><p className="text-sm font-medium">{p(s.label)}</p><p className="text-xs text-muted-foreground">{p(s.why)}</p></div>
                    </div>
                    <InclusionBadge pkg={packageId} systemId={s.id} />
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-muted/60 p-4">
                <div><p className="text-[11px] text-muted-foreground">{p({ mm: "လစဉ်", en: "Monthly" })}</p><p className="font-semibold">{monthlyLabel(packageId, lang)}</p></div>
                <div><p className="text-[11px] text-muted-foreground">Setup</p><p className="font-semibold">{setupLabel(packageId, lang)}</p></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => setActive(tabs[1] ?? "overview")} className="min-h-11 rounded-full border border-border px-5 text-sm font-medium">{p({ mm: "System တွေ စမ်းကြည့်မယ်", en: "Explore Systems" })}</button>
                <button onClick={onCustomize} className="min-h-11 rounded-full border border-border px-5 text-sm font-medium">{p({ mm: "စိတ်ကြိုက်ပြင်မယ်", en: "Customize Setup" })}</button>
                <button onClick={onChoose} className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">{p({ mm: `${pkgName} ကို ရွေးမယ်`, en: `Choose ${pkgName}` })}</button>
              </div>
              {included.length < systems.length && (
                <p className="mt-3 text-[11px] text-muted-foreground">{p({ mm: "Optional Add-on တွေကို Setup မှာ ထပ်ထည့်နိုင်ပါတယ် — Package ထဲ အလိုအလျောက် မပါပါ။", en: "Optional add-ons can be added during setup — they are not part of the package price." })}</p>
              )}
            </div>
          </section>
        )}
        {current === "qr" && (
          <>
            <div className="mx-auto max-w-4xl px-4 pt-5">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-semibold">{p({ mm: "စားပွဲ QR ပုံစံ ရွေးပါ", en: "Choose your table QR style" })}</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {(["simple", "traditional", "premium"] as const).map((q) => (
                    <button key={q} onClick={() => setup?.update({ qrStyle: q })} className={cn("rounded-2xl border p-2 transition-all", setup?.state.qrStyle === q ? "border-primary ring-2 ring-primary" : "border-border")}>
                      <QRPreview style={q} restaurantName={name} small />
                      <p className="py-1.5 text-xs font-medium capitalize">{q}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <QRTab name={name} pkg={packageId} onPlace={placeOrder} />
          </>
        )}
        {current === "pos" && <POSTab orders={orders} setOrders={setOrders} pkg={packageId} />}
        {current === "kitchen" && <KitchenTab orders={orders} setOrders={setOrders} pkg={packageId} />}
        {current === "training" && <TrainingTab pkg={packageId} />}
        {current === "health" && <HealthTab onImprove={() => setActive("coach")} />}
        {current === "feedback" && <FeedbackTab go={(t) => setActive(t as TabId)} />}
        {current === "coach" && <CoachTab go={(t) => setActive(t as TabId)} available={tabs} />}
        {current === "owner" && <OwnerTab pkg={packageId} branches={branches} />}
        {current === "integration" && <IntegrationTab pkg={packageId} />}
        {current === "website" && (
          <section className="py-4">
            {setup && (
              <div className="mx-auto mb-4 max-w-4xl px-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="mb-3 text-sm font-semibold">{p({ mm: "Website ပုံစံ ရွေးပါ", en: "Choose your website style" })}</p>
                  <WebsiteStyleSelector value={setup.state.websiteStyle} onChange={(s) => setup.update({ websiteStyle: s })} />
                </div>
              </div>
            )}
            <div className="mx-auto mb-3 flex max-w-6xl flex-wrap items-center gap-2 px-4">
              <h2 className="text-base font-semibold">Website</h2>
              <InclusionBadge pkg={packageId} systemId="restaurant_website" />
              <SampleTag />
            </div>
            <RestaurantPreview template={template} name={name} tagline={tagline} color={color} heroImage={IMAGES.heroInterior} />

          </section>
        )}
      </div>
    </div>
  );
}
