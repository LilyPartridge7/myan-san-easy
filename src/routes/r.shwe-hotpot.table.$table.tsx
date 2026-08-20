import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES, MENU, formatMMK } from "@/data/menu";
import { IMAGES } from "@/data/images";
import { useSetup } from "@/state/setupStore";
import { useT } from "@/i18n";

export const Route = createFileRoute("/r/shwe-hotpot/table/$table")({
  head: () => ({
    meta: [
      { title: "Shwe Hotpot — Scan & Order at your table" },
      {
        name: "description",
        content:
          "Order hotpot, sides and drinks straight from your table at Shwe Hotpot. No app, no signup — just scan and order.",
      },
      { property: "og:title", content: "Order at Shwe Hotpot" },
      {
        property: "og:description",
        content: "Scan the table QR and order in seconds.",
      },
      { property: "og:image", content: IMAGES.hotpot },
      { name: "twitter:image", content: IMAGES.hotpot },
    ],
  }),
  component: CustomerOrdering,
});

function CustomerOrdering() {
  const { table } = Route.useParams();
  const { state, addToCart, setQty, cartCount, cartTotal, update } = useSetup();
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("Popular");
  const [notes, setNotes] = useState("");

  const items =
    category === "Popular" ? MENU.slice(0, 4) : MENU.filter((m) => m.category === category);

  const placeOrder = () => {
    update({ orderPlaced: "A104" });
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <section className="relative h-56 w-full overflow-hidden">
        <img src={IMAGES.hotpot} alt="Shwe Hotpot" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,12,10,0.92)] to-transparent" />
        <div className="absolute bottom-5 left-5">
          <h1 className="text-2xl font-semibold text-white">{state.restaurantName}</h1>
          <p className="mt-1 text-sm tracking-[0.2em] text-white/75">
            {t("customer.table", { table: table.padStart(2, "0") })}
          </p>
        </div>
      </section>

      <nav className="sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`min-h-11 shrink-0 rounded-full border px-5 text-[15px] font-medium transition-colors ${
              category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
            }`}
          >
            {c}
          </button>
        ))}
      </nav>

      <ul className="mx-auto max-w-[620px] divide-y divide-border px-4">
        {items.map((m) => {
          const line = state.cart.find((l) => l.item.id === m.id);
          return (
            <li key={m.id} className="flex items-center gap-4 py-4">
              <img
                src={m.image}
                alt={m.name}
                loading="lazy"
                className={`h-20 w-20 shrink-0 rounded-xl object-cover ${m.soldOut ? "opacity-40" : ""}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-medium">{m.name}</p>
                <p className="truncate text-sm text-muted-foreground">{m.nameMm}</p>
                <p className="mt-1 text-[15px] font-semibold text-primary">{formatMMK(m.price)}</p>
              </div>
              {m.soldOut ? (
                <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  {t("customer.soldOut")}
                </span>
              ) : line ? (
                <div className="flex items-center gap-2">
                  <button
                    aria-label={t("customer.decrease")}
                    onClick={() => setQty(m.id, line.qty - 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-5 text-center text-[16px] font-semibold">{line.qty}</span>
                  <button
                    aria-label={t("customer.increase")}
                    onClick={() => setQty(m.id, line.qty + 1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(m)}
                  className="min-h-11 rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground"
                >
                  {t("customer.add")}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {cartCount > 0 && !state.orderPlaced ? (
        <button
          onClick={() => setOpen(true)}
          className="fixed inset-x-4 bottom-5 z-30 mx-auto flex max-w-[560px] min-h-14 items-center justify-between rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-lg"
        >
          <span>
            {t("customer.itemsAndTotal", { count: cartCount, total: formatMMK(cartTotal) })}
          </span>
          <span>{t("customer.viewOrder")}</span>
        </button>
      ) : null}

      {state.orderPlaced ? (
        <div className="fixed inset-x-4 bottom-5 z-30 mx-auto max-w-[560px] rounded-2xl border border-border bg-card p-5 shadow-lg">
          <p className="text-[15px] font-semibold">{t("customer.orderNumber", { id: state.orderPlaced })}</p>
          <ul className="mt-3 space-y-1.5 text-[15px]">
            <li className="text-primary">{t("customer.received")}</li>
            <li className="text-accent-foreground">{t("customer.preparing")}</li>
            <li className="text-muted-foreground">{t("customer.ready")}</li>
          </ul>
          <div className="mt-4 flex gap-3 text-sm">
            <button
              onClick={() => update({ orderPlaced: null, cart: [] })}
              className="underline underline-offset-4"
            >
              {t("customer.newOrder")}
            </button>
            <Link to="/owner" className="underline underline-offset-4">
              {t("customer.ownerView")}
            </Link>
          </div>
        </div>
      ) : null}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>{t("customer.yourOrderAtTable", { table: table.padStart(2, "0") })}</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-4">
            {state.cart.map((l) => (
              <div key={l.item.id} className="flex items-center gap-3">
                <span className="flex-1 text-[15px]">{l.item.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={t("customer.decrease")}
                    onClick={() => setQty(l.item.id, l.qty - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-4 text-center">{l.qty}</span>
                  <button
                    aria-label={t("customer.increase")}
                    onClick={() => setQty(l.item.id, l.qty + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="w-24 text-right text-sm text-muted-foreground">
                  {formatMMK(l.item.price * l.qty)}
                </span>
              </div>
            ))}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("customer.notesPlaceholder")}
              className="min-h-20 w-full rounded-xl border border-border bg-background p-3 text-[15px] outline-none focus:border-primary"
            />
            <div className="flex items-center justify-between text-[16px] font-semibold">
              <span>{t("customer.total")}</span>
              <span>{formatMMK(cartTotal)}</span>
            </div>
            <button
              onClick={() => {
                placeOrder();
                setOpen(false);
              }}
              className="min-h-14 w-full rounded-full bg-primary text-[16px] font-semibold text-primary-foreground"
            >
              {t("customer.placeOrder")}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}