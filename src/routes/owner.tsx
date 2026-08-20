import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, UtensilsCrossed, ReceiptText, Globe } from "lucide-react";
import { IMAGES } from "@/data/images";
import { useSetup } from "@/state/setupStore";

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
  const { state, resetDemo } = useSetup();

  return (
    <div className="min-h-screen bg-background pb-16">
      <section className="relative h-56 w-full overflow-hidden sm:h-64">
        <img src={IMAGES.table} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,12,10,0.9)] to-[rgba(20,12,10,0.25)]" />
        <div className="absolute bottom-6 left-6 sm:left-10">
          <p className="text-sm text-white/75">Good afternoon, Daw Mya</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">{state.restaurantName}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[820px] px-5">
        <p className="mt-8 text-[11px] tracking-[0.3em] text-muted-foreground">TODAY</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            { v: "4", l: "Active Orders" },
            { v: "320,000", l: "MMK Sales" },
            { v: "2", l: "Sold Out" },
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

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link to="/r/shwe-hotpot/table/$table" params={{ table: "7" }} className={tileClass}>
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            Menu
          </Link>
          <Link to="/r/shwe-hotpot/table/$table" params={{ table: "7" }} className={tileClass}>
            <ReceiptText className="h-5 w-5 text-primary" />
            Orders
          </Link>
          <Link to="/preview/shwe-hotpot" className={tileClass}>
            <Globe className="h-5 w-5 text-primary" />
            Website
          </Link>
          <Link to="/setup" className={tileClass}>
            <QrCode className="h-5 w-5 text-primary" />
            QR
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <Link to="/setup" className="underline underline-offset-4">
            Setup ပြန်ကြည့်မယ်
          </Link>
          <Link to="/" className="underline underline-offset-4">
            Home
          </Link>
          <button onClick={resetDemo} className="underline underline-offset-4">
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}

const tileClass =
  "flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[15px] font-medium transition-colors hover:bg-muted";