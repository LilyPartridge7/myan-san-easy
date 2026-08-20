import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { IMAGES } from "@/data/images";
import { PackageCard } from "@/components/myansan/PackageCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "မြန်ဆန် — Restaurant digitalization for Myanmar restaurants" },
      {
        name: "description",
        content:
          "Tell မြန်ဆန် what your restaurant needs. QR ordering, a beautiful website and kitchen order screens — without learning complicated technology.",
      },
      { property: "og:title", content: "မြန်ဆန် — သင့်ဆိုင်အတွက် နည်းပညာ အကူအညီ" },
      {
        property: "og:description",
        content: "A simpler way to bring your restaurant online — no technical knowledge needed.",
      },
      { property: "og:image", content: IMAGES.heroInterior },
      { name: "twitter:image", content: IMAGES.heroInterior },
    ],
  }),
  component: Landing,
});

const HELP_ITEMS = [
  "Customer order တင်တာ ပိုလွယ်အောင်",
  "Menu update လုပ်တာ ပိုလွယ်အောင်",
  "ဆိုင်အတွက် professional website ရအောင်",
  "Table QR ပြင်ဆင်ပေးတာ",
  "Kitchen မှာ order တွေ မြင်ရလွယ်အောင်",
  "Staff အသုံးပြုရလွယ်အောင်",
];

const STEPS = [
  { n: "01", t: "Tell Us About Your Restaurant", d: "ဆိုင်အခြေအနေကို ရိုးရိုးလေး ပြောပြပါ။" },
  { n: "02", t: "We Recommend What You Need", d: "မြန်ဆန်က သင့်ဆိုင်နဲ့ကိုက်တာ ရွေးပေးပါမယ်။" },
  { n: "03", t: "Choose Your Setup", d: "ကြိုက်သလို နည်းနည်းပြင်ပြီး စလို့ရပါပြီ။" },
];

function Landing() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const startConsult = () => {
    setLeaving(true);
    setTimeout(() => navigate({ to: "/consult" }), 340);
  };

  return (
    <main className={leaving ? "fade-out-up" : "fade-in"}>
      {/* HERO */}
      <section className="relative h-[100dvh] min-h-[580px] w-full overflow-hidden">
        <img
          src={IMAGES.heroInterior}
          alt="Warm restaurant interior with wooden tables and ambient lighting"
          className="fixed inset-0 h-[100dvh] w-full object-cover slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,42,95,0.94)] via-[rgba(15,42,95,0.55)] to-[rgba(8,17,31,0.35)]" />
        <div className="absolute inset-0 flex flex-col px-6 pt-6 sm:px-10 lg:px-16">
          <span className="text-lg font-semibold tracking-tight text-white">မြန်ဆန်</span>
          <div className="mt-auto max-w-2xl pb-12">
            <h1 className="text-[clamp(1.5rem,5.2vw,2.25rem)] leading-[1.25] font-semibold text-white sm:text-4xl lg:text-[44px]">
              သင့်ဆိုင်အတွက် လိုအပ်တာကို ပြောပါ။
              <br />
              ကျန်တာကို မြန်ဆန်က ကူညီပေးပါမယ်။
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              A simpler way to bring your restaurant online — without learning complicated
              technology.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={startConsult}
                className="min-h-12 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:min-h-13 sm:px-7 sm:text-[15px]"
              >
                အခမဲ့ အကြံပေးမှု စတင်မယ်
              </button>
              <Link
                to="/r/shwe-hotpot/table/$table"
                params={{ table: "7" }}
                className="min-h-12 rounded-full border border-white/50 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:min-h-13 sm:px-7 sm:text-[15px]"
              >
                Customer Experience ကြည့်မယ်
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/70">
              ✓ Easy to understand&nbsp;&nbsp; ✓ Burmese + English&nbsp;&nbsp; ✓ No technical
              knowledge needed
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <p className="text-[11px] tracking-[0.35em] text-muted-foreground">HOW IT WORKS</p>
        <div className="mt-10">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-2 border-t border-border py-8 sm:flex-row sm:gap-10"
            >
              <span className="text-4xl font-light text-primary/40 sm:w-24">{s.n}</span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-1.5 text-[15px] text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE HELP WITH */}
      <section className="grid items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:px-16">
        <img
          src={IMAGES.diningWarm}
          alt="Guests sharing a meal"
          loading="lazy"
          className="h-[420px] w-full rounded-3xl object-cover"
        />
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight">
            မြန်ဆန်က ဘာတွေ ကူညီပေးနိုင်လဲ
          </h2>
          <ul className="mt-6 space-y-3">
            {HELP_ITEMS.map((h) => (
              <li key={h} className="border-b border-border pb-3 text-[15px] leading-relaxed">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WEBSITE PREVIEW */}
      <section className="relative mt-16 h-[60vh] min-h-[380px] overflow-hidden">
        <img
          src={IMAGES.hotpot}
          alt="Restaurant website preview"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,42,95,0.9)] to-transparent" />
        <div className="absolute bottom-10 left-6 max-w-lg sm:left-12 lg:left-16">
          <p className="text-[11px] tracking-[0.35em] text-white/70">YOUR RESTAURANT WEBSITE</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            ဆိုင်အတွက် လှပတဲ့ website တစ်ခု ရပါမယ်
          </h2>
          <Link
            to="/preview/shwe-hotpot"
            className="mt-6 inline-flex min-h-12 items-center rounded-full border border-white/60 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
          >
            နမူနာ website ကြည့်မယ်
          </Link>
        </div>
      </section>

      {/* PACKAGE PREVIEW */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <p className="text-[11px] tracking-[0.35em] text-muted-foreground">PACKAGES</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">ရိုးရှင်းတဲ့ ရွေးချယ်မှု ၃ မျိုး</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <PackageCard id="start" compact />
          <PackageCard id="growth" compact />
          <PackageCard id="partner" compact />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-[1100px] px-6 pb-24">
        <div className="rounded-3xl bg-card p-10 text-center ring-1 ring-border">
          <h2 className="text-2xl font-semibold tracking-tight">
            သင့်ဆိုင်အတွက် ဘာလိုအပ်လဲ ပြောပါ။
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            နည်းပညာပိုင်းကို မြန်ဆန်က ကူညီပေးပါမယ်။
          </p>
          <button
            onClick={startConsult}
            className="mt-7 min-h-13 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            အခမဲ့ အကြံပေးမှု စတင်မယ်
          </button>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © မြန်ဆန် ·{" "}
          <Link to="/owner" className="underline underline-offset-4">
            Owner Home
          </Link>
        </p>
      </section>
    </main>
  );
}
