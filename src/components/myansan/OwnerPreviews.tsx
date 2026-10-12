import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n";
import { useSetup } from "@/state/setupStore";
import { RestaurantPreview } from "@/components/myansan/RestaurantPreview";
import { templateFor } from "@/services/mockConsultant";
import { IMAGES } from "@/data/images";

const fmt = (n: number) => `${n.toLocaleString("en-US")} MMK`;

function Sample() {
  return (
    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
      Sample Data
    </span>
  );
}

function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 className="text-base font-semibold tracking-wide">{title}</h2>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <Sample />
    </div>
  );
}

const MENU_ITEMS = [
  { name: "Chicken Hotpot", price: 12000, cat: "Hotpot", out: false },
  { name: "Seafood Hotpot", price: 18000, cat: "Hotpot", out: true },
  { name: "Premium Beef", price: 22000, cat: "Meat", out: false },
  { name: "Vegetable Set", price: 6000, cat: "Hotpot", out: false },
  { name: "Milk Tea", price: 3000, cat: "Drinks", out: false },
  { name: "Soft Drink", price: 2000, cat: "Drinks", out: false },
];

export function MenuPreview() {
  const { p } = useT();
  const [items, setItems] = useState(MENU_ITEMS);
  const [cat, setCat] = useState("Hotpot");
  return (
    <div>
      <Head title="MENU MANAGEMENT" sub={p({ en: "Tap to mark items available or sold out.", mm: "ပစ္စည်းကုန်/ရနိုင် ကို နှိပ်ပြီး ပြောင်းနိုင်ပါတယ်။" })} />
      <div className="mb-3 flex gap-2 overflow-x-auto">
        {["Hotpot", "Meat", "Drinks"].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {items.filter((i) => i.cat === cat).map((i) => (
          <div key={i.name} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
            <div>
              <p className="font-medium">{i.name}</p>
              <p className="text-xs text-muted-foreground">{fmt(i.price)}</p>
            </div>
            <div className="flex gap-1">
              {[false, true].map((out) => (
                <button key={String(out)}
                  onClick={() => setItems((all) => all.map((x) => (x.name === i.name ? { ...x, out } : x)))}
                  className={`rounded-lg border px-2.5 py-1 text-xs ${i.out === out ? (out ? "border-destructive bg-destructive text-destructive-foreground" : "border-primary bg-primary text-primary-foreground") : "border-border text-muted-foreground"}`}>
                  {out ? "Sold Out" : "Available"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ORDERS = [
  { id: "A104", table: "07", total: 40000, status: "Preparing", items: ["Chicken Hotpot ×1", "Premium Beef ×1", "Milk Tea ×2"] },
  { id: "A103", table: "03", total: 18000, status: "New", items: ["Seafood Hotpot ×1"] },
  { id: "A102", table: "11", total: 26000, status: "Ready", items: ["Premium Beef ×1", "Soft Drink ×2"] },
];

export function OrdersPreview() {
  const { p } = useT();
  const [open, setOpen] = useState("A104");
  const tone = (s: string) =>
    s === "New" ? "bg-primary/15 text-primary" : s === "Ready" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  return (
    <div>
      <Head title="ORDERS" sub={p({ en: "Tap an order to see details.", mm: "Order တစ်ခုကို နှိပ်ပြီး အသေးစိတ်ကြည့်ပါ။" })} />
      <div className="space-y-2">
        {ORDERS.map((o) => (
          <button key={o.id} onClick={() => setOpen(open === o.id ? "" : o.id)}
            className={`block w-full rounded-xl border p-3 text-left ${open === o.id ? "border-primary" : "border-border"}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">#{o.id}</span>
              <span className="text-sm text-muted-foreground">Table {o.table}</span>
              <span className="text-sm">{fmt(o.total)}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone(o.status)}`}>{o.status}</span>
            </div>
            {open === o.id && (
              <div className="mt-3 border-t border-border pt-3 text-sm">
                <p className="font-medium">Order #{o.id}</p>
                {o.items.map((i) => <p key={i} className="text-muted-foreground">{i}</p>)}
                <p className="mt-2">Total: <b>{fmt(o.total)}</b></p>
                <p>Status: <b>{o.status}</b></p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function WebsitePreview() {
  const { p } = useT();
  const { state } = useSetup();
  return (
    <div>
      <Head title="WEBSITE" sub={p({ en: "Your restaurant website, in your own colors.", mm: "သင့်ဆိုင်အရောင်နဲ့ ဆိုင် Website" })} />
      <div className="max-h-[520px] overflow-y-auto rounded-xl border border-border">
        <RestaurantPreview template={templateFor(state.websiteStyle ?? "luxury")} name={state.restaurantName}
          tagline={state.tagline} color={state.restaurantColor} heroImage={IMAGES.heroInterior} />
      </div>
      <Link to="/preview/shwe-hotpot" search={{ from: "owner" }}
        className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
        {p({ en: "Open Full Preview", mm: "အပြည့်အစုံ ကြည့်မယ်" })}
      </Link>
    </div>
  );
}

const QR_ITEMS = [
  { name: "Chicken Hotpot", price: 12000 },
  { name: "Premium Beef", price: 22000 },
  { name: "Milk Tea", price: 3000 },
];

export function QRPreview() {
  const { p } = useT();
  const { state } = useSetup();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placed, setPlaced] = useState(false);
  const total = QR_ITEMS.reduce((s, i) => s + (cart[i.name] ?? 0) * i.price, 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <div>
      <Head title="QR ORDERING" sub={p({ en: "What your customer sees after scanning the table QR.", mm: "Table QR ကို scan ဖတ်ပြီး ဧည့်သည်မြင်ရမယ့်ပုံ" })} />
      <div className="mx-auto max-w-[340px] rounded-[28px] border-4 border-border bg-background p-4">
        <p className="text-center font-semibold">{state.restaurantName}</p>
        <p className="mb-3 text-center text-xs text-muted-foreground">Table 07</p>
        {placed ? (
          <div className="py-8 text-center">
            <p className="text-lg font-semibold">Order #A104</p>
            <p className="text-sm text-muted-foreground">Status: NEW</p>
            <button onClick={() => { setPlaced(false); setCart({}); }} className="mt-4 text-xs underline">
              {p({ en: "New order", mm: "Order အသစ်" })}
            </button>
          </div>
        ) : (
          <>
            {QR_ITEMS.map((i) => (
              <div key={i.name} className="flex items-center justify-between border-b border-border py-2.5">
                <div>
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{fmt(i.price)}</p>
                </div>
                <button onClick={() => setCart((c) => ({ ...c, [i.name]: (c[i.name] ?? 0) + 1 }))}
                  className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Add{cart[i.name] ? ` (${cart[i.name]})` : ""}
                </button>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between text-sm">
              <span>Cart · {count}</span>
              <b>{fmt(total)}</b>
            </div>
            <button disabled={!count} onClick={() => setPlaced(true)}
              className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40">
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
