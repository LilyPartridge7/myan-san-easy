import { IMAGES } from "@/data/images";
import { MENU, formatMMK } from "@/data/menu";
import type { Template } from "@/state/setupStore";
import { useT } from "@/i18n";

type Theme = {
  bg: string;
  text: string;
  muted: string;
  accent: string;
  heading: string;
  overlay: string;
};

function themeFor(template: Template, color: string): Theme {
  if (template === "luxury")
    return {
      bg: "#14100F",
      text: "#F5EFE4",
      muted: "rgba(245,239,228,0.62)",
      accent: "#C9A227",
      heading: "var(--font-serif-display)",
      overlay: "linear-gradient(180deg, rgba(10,8,8,0.25) 0%, rgba(10,8,8,0.85) 100%)",
    };
  if (template === "traditional")
    return {
      bg: "#FBF4E8",
      text: "#3B2A1E",
      muted: "rgba(59,42,30,0.65)",
      accent: color,
      heading: "var(--font-serif-display)",
      overlay: "linear-gradient(180deg, rgba(60,40,25,0.2) 0%, rgba(60,40,25,0.72) 100%)",
    };
  return {
    bg: "#FFFFFF",
    text: "#17171A",
    muted: "rgba(23,23,26,0.6)",
    accent: color,
    heading: "inherit",
    overlay: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.62) 100%)",
  };
}

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
  const dishes = MENU.filter((m) => !m.soldOut).slice(0, 3);
  const { t } = useT();

  return (
    <div style={{ background: th.bg, color: th.text }}>
      {/* Hero */}
      <section className="relative h-[78vh] min-h-[460px] w-full overflow-hidden">
        <img src={heroImage} alt={name} className="slow-zoom h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: th.overlay }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-14 sm:px-12 lg:px-20">
          <p
            className="text-[11px] tracking-[0.4em]"
            style={{ color: th.accent }}
          >
            {name.toUpperCase()}
          </p>
          <h1
            className="mt-4 max-w-3xl text-[13vw] leading-[0.95] font-light text-white sm:text-6xl lg:text-7xl"
            style={{ fontFamily: th.heading }}
          >
            Gather. Share. Enjoy.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/80">{tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span
              className="inline-flex min-h-12 items-center rounded-full px-7 text-sm font-semibold"
              style={{ background: th.accent, color: template === "luxury" ? "#14100F" : "#fff" }}
            >
              Order Now
            </span>
            <span className="inline-flex min-h-12 items-center rounded-full border border-white/50 px-7 text-sm font-medium text-white">
              Explore Menu
            </span>
          </div>
        </div>
      </section>

      {/* Signature dishes */}
      <section className="px-6 py-16 sm:px-12 lg:px-20">
        <p className="text-[11px] tracking-[0.35em]" style={{ color: th.accent }}>
          SIGNATURE
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {dishes.map((d, i) => (
            <figure key={d.id} className={i === 1 ? "md:mt-10" : ""}>
              <div className="overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <figcaption className="mt-4">
                <h3 className="text-xl" style={{ fontFamily: th.heading }}>
                  {d.name}
                </h3>
                <p className="mt-1 text-sm" style={{ color: th.muted }}>
                  {formatMMK(d.price)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Story — asymmetric */}
      <section className="grid items-center gap-10 px-6 py-10 sm:px-12 lg:grid-cols-2 lg:px-20">
        <img
          src={IMAGES.diningWarm}
          alt="Our story"
          loading="lazy"
          className="h-[420px] w-full object-cover"
        />
        <div className="max-w-md">
          <h2 className="text-4xl leading-tight" style={{ fontFamily: th.heading }}>
            A table made for sharing
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: th.muted }}>
            Simmering broth, fresh cuts and the people you love. Every pot at {name} is prepared to
            be shared slowly, the way a good evening should be.
          </p>
        </div>
      </section>

      {/* Menu preview */}
      <section className="px-6 py-16 sm:px-12 lg:px-20">
        <h2 className="text-3xl" style={{ fontFamily: th.heading }}>
          Menu
        </h2>
        <ul className="mt-8 max-w-2xl">
          {MENU.slice(0, 5).map((m) => (
            <li
              key={m.id}
              className="flex items-baseline justify-between gap-4 border-b py-4"
              style={{ borderColor: "rgba(128,128,128,0.25)" }}
            >
              <span className="text-lg">{m.name}</span>
              <span className="text-sm" style={{ color: th.muted }}>
                {formatMMK(m.price)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Atmosphere */}
      <section className="relative h-[52vh] min-h-[320px] overflow-hidden">
        <img src={IMAGES.hotpot} alt="Atmosphere" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: th.overlay }} />
        <p
          className="absolute bottom-10 left-6 max-w-lg text-3xl text-white sm:left-12 lg:left-20"
          style={{ fontFamily: th.heading }}
        >
          Warm light, slow evenings.
        </p>
      </section>

      {/* Hours + location */}
      <section className="grid gap-8 px-6 py-16 sm:px-12 lg:grid-cols-3 lg:px-20">
        <div>
          <p className="text-[11px] tracking-[0.3em]" style={{ color: th.accent }}>
            HOURS
          </p>
          <p className="mt-3 text-base" style={{ color: th.muted }}>
            Mon – Sun · 11:00 – 22:30
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.3em]" style={{ color: th.accent }}>
            LOCATION
          </p>
          <p className="mt-3 text-base" style={{ color: th.muted }}>
            No. 42, Bogyoke Road, Yangon
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.3em]" style={{ color: th.accent }}>
            RESERVATIONS
          </p>
          <p className="mt-3 text-base" style={{ color: th.muted }}>
            09 45 000 1234
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="grid grid-cols-3 gap-1">
        {[IMAGES.gallery1, IMAGES.gallery2, IMAGES.gallery3].map((g) => (
          <img key={g} src={g} alt="" loading="lazy" className="h-40 w-full object-cover sm:h-56" />
        ))}
      </section>

      <footer className="px-6 py-10 text-center sm:px-12 lg:px-20">
        <p className="text-lg tracking-[0.2em]" style={{ fontFamily: th.heading }}>
          {name.toUpperCase()}
        </p>
        <p className="mt-3 text-xs" style={{ color: th.muted }}>
          Powered by မြန်ဆန်
        </p>
      </footer>
    </div>
  );
}