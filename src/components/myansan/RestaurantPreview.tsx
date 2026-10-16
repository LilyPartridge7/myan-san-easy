import { useState } from "react";
import { IMAGES } from "@/data/images";
import { MENU, CATEGORIES, formatMMK } from "@/data/menu";
import type { Template } from "@/state/setupStore";
import { useT } from "@/i18n";

type Theme = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  heading: string;
  overlay: string;
  line: string;
};

function themeFor(template: Template, color: string): Theme {
  if (template === "luxury")
    return {
      bg: "#14100F",
      surface: "#1E1816",
      text: "#F5EFE4",
      muted: "rgba(245,239,228,0.62)",
      accent: "#C9A227",
      onAccent: "#14100F",
      heading: "var(--font-serif-display)",
      overlay: "linear-gradient(180deg, rgba(10,8,8,0.25) 0%, rgba(10,8,8,0.85) 100%)",
      line: "rgba(245,239,228,0.14)",
    };
  if (template === "traditional")
    return {
      bg: "#FBF4E8",
      surface: "#F3E8D6",
      text: "#3B2A1E",
      muted: "rgba(59,42,30,0.65)",
      accent: color,
      onAccent: "#fff",
      heading: "var(--font-serif-display)",
      overlay: "linear-gradient(180deg, rgba(60,40,25,0.2) 0%, rgba(60,40,25,0.72) 100%)",
      line: "rgba(59,42,30,0.15)",
    };
  return {
    bg: "#FFFFFF",
    surface: "#F6F6F7",
    text: "#17171A",
    muted: "rgba(23,23,26,0.6)",
    accent: color,
    onAccent: "#fff",
    heading: "inherit",
    overlay: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.62) 100%)",
    line: "rgba(23,23,26,0.1)",
  };
}

const REVIEWS = [
  { name: "Thiri", text: "The seafood broth is the best in Yangon. Perfect for family dinners.", stars: 5 },
  { name: "Ko Aung", text: "Fast service, ordered from the table QR and food came in minutes.", stars: 5 },
  { name: "May", text: "Cozy place, fresh ingredients and very friendly staff.", stars: 4 },
];

export function RestaurantPreview({
  template,
  name,
  tagline,
  color,
  heroImage,
}: {
  template: Template;
  name: string;
  tagline: string;
  color: string;
  heroImage: string;
}) {
  const th = themeFor(template, color);
  const { t, p } = useT();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number] | "All">("All");
  const [booked, setBooked] = useState(false);
  const items = cat === "All" ? MENU : MENU.filter((m) => m.category === cat);
  const dishes = MENU.filter((m) => !m.soldOut).slice(0, 3);
  const scrollTo = (id: string) =>
    document.getElementById(`rp-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const pill = "inline-flex min-h-11 items-center rounded-full px-6 text-sm font-semibold transition-transform active:scale-95";

  return (
    <div style={{ background: th.bg, color: th.text }} className="relative">
      {/* Nav */}
      <nav
        className="sticky top-[57px] z-30 flex items-center gap-4 px-5 py-3 backdrop-blur sm:px-12 lg:px-20"
        style={{ background: th.bg + "E6", borderBottom: `1px solid ${th.line}` }}
      >
        <span className="text-lg tracking-[0.15em]" style={{ fontFamily: th.heading }}>
          {name.toUpperCase()}
        </span>
        <div className="ml-auto hidden gap-6 text-sm sm:flex" style={{ color: th.muted }}>
          {["menu", "about", "reviews", "visit"].map((s) => (
            <button key={s} onClick={() => scrollTo(s)} className="capitalize hover:opacity-100">
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollTo("book")}
          className={`${pill} ml-auto sm:ml-0`}
          style={{ background: th.accent, color: th.onAccent }}
        >
          Book a Table
        </button>
      </nav>

      {/* Hero */}
      <section className="relative h-[72vh] min-h-[440px] w-full overflow-hidden">
        <img src={heroImage} alt={name} className="slow-zoom h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: th.overlay }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-14 sm:px-12 lg:px-20">
          <p className="text-[11px] tracking-[0.4em]" style={{ color: th.accent }}>
            OPEN TODAY · 11:00 – 22:30
          </p>
          <h1
            className="mt-4 max-w-3xl text-5xl leading-[0.95] font-light text-white sm:text-6xl lg:text-7xl"
            style={{ fontFamily: th.heading }}
          >
            Gather. Share. Enjoy.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/80">{tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => scrollTo("menu")} className={pill} style={{ background: th.accent, color: th.onAccent }}>
              View Menu
            </button>
            <button onClick={() => scrollTo("book")} className={`${pill} border border-white/50 text-white`}>
              Reserve
            </button>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="grid grid-cols-3 text-center" style={{ background: th.surface }}>
        {[
          ["4.8 ★", "Google rating"],
          ["20", "Tables"],
          ["QR", "Order at table"],
        ].map(([a, b]) => (
          <div key={b} className="py-6">
            <p className="text-2xl font-semibold" style={{ color: th.accent }}>{a}</p>
            <p className="text-xs" style={{ color: th.muted }}>{b}</p>
          </div>
        ))}
      </section>

      {/* Signature */}
      <section className="px-6 py-16 sm:px-12 lg:px-20">
        <p className="text-[11px] tracking-[0.35em]" style={{ color: th.accent }}>SIGNATURE DISHES</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {dishes.map((d, i) => (
            <figure key={d.id} className={i === 1 ? "md:mt-10" : ""}>
              <div className="overflow-hidden rounded-xl">
                <img src={d.image} alt={d.name} loading="lazy" className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <figcaption className="mt-4">
                <h3 className="text-xl" style={{ fontFamily: th.heading }}>{d.name}</h3>
                <p className="text-sm" style={{ color: th.muted }}>{d.nameMm} · {formatMMK(d.price)}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Full menu */}
      <section id="rp-menu" className="scroll-mt-32 px-6 py-16 sm:px-12 lg:px-20" style={{ background: th.surface }}>
        <h2 className="text-4xl" style={{ fontFamily: th.heading }}>Our Menu</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="min-h-10 rounded-full px-4 text-sm transition-colors"
              style={
                cat === c
                  ? { background: th.accent, color: th.onAccent }
                  : { border: `1px solid ${th.line}`, color: th.muted }
              }
            >
              {c}
            </button>
          ))}
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((m) => (
            <li key={m.id} className="flex items-center gap-4 rounded-xl p-3" style={{ background: th.bg, opacity: m.soldOut ? 0.55 : 1 }}>
              <img src={m.image} alt={m.name} loading="lazy" className="h-20 w-20 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{m.name}</p>
                <p className="text-xs" style={{ color: th.muted }}>{m.nameMm}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: th.accent }}>{formatMMK(m.price)}</p>
                {m.soldOut && <p className="text-[11px]" style={{ color: th.muted }}>Sold out today</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* About */}
      <section id="rp-about" className="grid scroll-mt-32 items-center gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2 lg:px-20">
        <img src={IMAGES.diningWarm} alt="Our story" loading="lazy" className="h-[400px] w-full rounded-xl object-cover" />
        <div className="max-w-md">
          <p className="text-[11px] tracking-[0.35em]" style={{ color: th.accent }}>OUR STORY</p>
          <h2 className="mt-3 text-4xl leading-tight" style={{ fontFamily: th.heading }}>A table made for sharing</h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: th.muted }}>
            Since 2015, {name} has served slow-simmered broths, fresh cuts and market vegetables to
            families in Yangon. Every pot is prepared to be shared slowly, the way a good evening should be.
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section id="rp-reviews" className="scroll-mt-32 px-6 py-16 sm:px-12 lg:px-20" style={{ background: th.surface }}>
        <h2 className="text-3xl" style={{ fontFamily: th.heading }}>What guests say</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <blockquote key={r.name} className="rounded-xl p-5" style={{ background: th.bg }}>
              <p style={{ color: th.accent }}>{"★".repeat(r.stars)}</p>
              <p className="mt-3 text-sm leading-relaxed">“{r.text}”</p>
              <footer className="mt-3 text-xs" style={{ color: th.muted }}>— {r.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="rp-book" className="grid scroll-mt-32 gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2 lg:px-20">
        <div>
          <h2 className="text-4xl" style={{ fontFamily: th.heading }}>Reserve a table</h2>
          <p className="mt-3 text-sm" style={{ color: th.muted }}>
            Book online or call 09 45 000 1234. Groups of 10+ please call ahead.
          </p>
          <img src={IMAGES.hotpot} alt="" loading="lazy" className="mt-6 hidden h-56 w-full rounded-xl object-cover lg:block" />
        </div>
        {booked ? (
          <div className="flex flex-col items-center justify-center rounded-xl p-8 text-center" style={{ background: th.surface }}>
            <p className="text-3xl" style={{ color: th.accent }}>✓</p>
            <p className="mt-2 text-lg font-medium">Table request sent</p>
            <p className="mt-1 text-sm" style={{ color: th.muted }}>We'll confirm by phone shortly.</p>
            <button onClick={() => setBooked(false)} className="mt-5 text-sm underline" style={{ color: th.muted }}>
              Make another booking
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setBooked(true); }}
            className="grid gap-3 rounded-xl p-6 sm:grid-cols-2"
            style={{ background: th.surface }}
          >
            {[
              ["Name", "text", "Your name"],
              ["Phone", "tel", "09 ..."],
              ["Date", "date", ""],
              ["Time", "time", ""],
            ].map(([l, type, ph]) => (
              <label key={l} className="text-xs" style={{ color: th.muted }}>
                {l}
                <input
                  required
                  type={type}
                  placeholder={ph}
                  className="mt-1 h-11 w-full rounded-lg px-3 text-sm outline-none"
                  style={{ background: th.bg, color: th.text, border: `1px solid ${th.line}` }}
                />
              </label>
            ))}
            <label className="text-xs sm:col-span-2" style={{ color: th.muted }}>
              Guests
              <select className="mt-1 h-11 w-full rounded-lg px-3 text-sm" style={{ background: th.bg, color: th.text, border: `1px solid ${th.line}` }}>
                {[2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n}>{n} people</option>)}
              </select>
            </label>
            <button type="submit" className={`${pill} justify-center sm:col-span-2`} style={{ background: th.accent, color: th.onAccent }}>
              Request Booking
            </button>
          </form>
        )}
      </section>

      {/* Gallery */}
      <section className="grid grid-cols-3 gap-1">
        {[IMAGES.gallery1, IMAGES.gallery2, IMAGES.gallery3].map((g) => (
          <img key={g} src={g} alt="" loading="lazy" className="h-40 w-full object-cover sm:h-56" />
        ))}
      </section>

      {/* Visit */}
      <section id="rp-visit" className="grid scroll-mt-32 gap-8 px-6 py-16 sm:px-12 lg:grid-cols-4 lg:px-20">
        {[
          ["HOURS", "Mon – Sun · 11:00 – 22:30"],
          ["LOCATION", "No. 42, Bogyoke Road, Yangon"],
          ["PHONE", "09 45 000 1234"],
          ["DELIVERY", "Foodpanda · Grab · Call us"],
        ].map(([h, v]) => (
          <div key={h}>
            <p className="text-[11px] tracking-[0.3em]" style={{ color: th.accent }}>{h}</p>
            <p className="mt-3 text-base" style={{ color: th.muted }}>{v}</p>
          </div>
        ))}
      </section>

      <footer className="px-6 py-10 text-center sm:px-12 lg:px-20" style={{ borderTop: `1px solid ${th.line}` }}>
        <p className="text-lg tracking-[0.2em]" style={{ fontFamily: th.heading }}>{name.toUpperCase()}</p>
        <p className="mt-2 text-xs" style={{ color: th.muted }}>
          {p({ mm: "နမူနာ ဆိုင်ဝက်ဘ်ဆိုက်", en: "Example restaurant website" })} · Powered by {t("brand")}
        </p>
      </footer>
    </div>
  );
}
