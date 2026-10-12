import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MenuPreview, OrdersPreview, WebsitePreview, QRPreview } from "@/components/myansan/OwnerPreviews";
import { QrCode, UtensilsCrossed, ReceiptText, Globe } from "lucide-react";
import { IMAGES } from "@/data/images";
import { useSetup } from "@/state/setupStore";
import { useT } from "@/i18n";

export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "My Restaurant — မြန်ဆန်" },
      {
        name: "description",
        content:
          "A simple daily view for restaurant owners: today's orders, sales and quick access to menu, website and table QR.",
      },
      { property: "og:title", content: "My Restaurant — မြန်ဆန်" },
      {
        property: "og:description",
        content: "Today's orders, sales and quick actions for your restaurant.",
      },
    ],
  }),
  component: OwnerHome,
});

function OwnerHome() {
  const { state, resetDemo, goToStage } = useSetup();
  const { t, p } = useT();
  const [active, setActive] = useState<"overview" | "menu" | "orders" | "website" | "qr">("overview");
  const navigate = useNavigate();
  const openSetup = () => {
    if (state.confirmed) goToStage("saved");
    navigate({ to: "/setup" });
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <section className="relative h-56 w-full overflow-hidden sm:h-64">
        <img src={IMAGES.table} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,12,10,0.9)] to-[rgba(20,12,10,0.25)]" />
        <div className="absolute bottom-6 left-6 sm:left-10">
          <p className="text-sm text-white/75">{t("owner.greeting")}</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">{state.restaurantName}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[820px] px-5">
        <p className="mt-8 text-[11px] tracking-[0.3em] text-muted-foreground">{t("owner.today")}</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            { v: "4", l: t("owner.activeOrders") },
            { v: "320,000", l: t("owner.mmkSales") },
            { v: "2", l: t("owner.soldOut") },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xl font-semibold">{s.v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-4">
          <input
            readOnly
            placeholder="မြန်ဆန်ကို ဘာကူညီပေးခိုင်းချင်ပါသလဲ?"
            className="min-h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-muted-foreground"
          />
        </div>

        <p className="mt-8 text-sm font-medium">{p({ en: "Explore Your Digital Systems", mm: "သင့်ဆိုင် Digital System တွေကို ကြည့်မယ်" })}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            ["menu", UtensilsCrossed, t("owner.menu")],
            ["orders", ReceiptText, t("owner.orders")],
            ["website", Globe, t("owner.website")],
            ["qr", QrCode, t("owner.qr")],
          ] as const).map(([id, Icon, label]) => (
            <button key={id} aria-pressed={active === id}
              onClick={() => setActive(active === id ? "overview" : id)}
              className={`${tileClass} ${active === id ? "border-primary bg-primary/10 ring-1 ring-primary" : ""}`}>
              <Icon className="h-5 w-5 text-primary" />
              {label}
            </button>
          ))}
        </div>

        {active !== "overview" && (
          <div key={active} className="owner-fade mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
            {active === "menu" && <MenuPreview />}
            {active === "orders" && <OrdersPreview />}
            {active === "website" && <WebsitePreview />}
            {active === "qr" && <QRPreview />}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <button onClick={openSetup} className="underline underline-offset-4">
            {t("owner.reviewSetup")}
          </button>
          <Link to="/" className="underline underline-offset-4">
            {t("owner.home")}
          </Link>
          <button onClick={resetDemo} className="underline underline-offset-4">
            {t("owner.resetDemo")}
          </button>
        </div>
      </div>
    </div>
  );
}

const tileClass =
  "flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[15px] font-medium transition-colors hover:bg-muted";