import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { IMAGES } from "@/data/images";
import { PackageCard } from "@/components/myansan/PackageCard";
import { LanguageToggle } from "@/components/myansan/LanguageToggle";
import { useT } from "@/i18n";
import type { StringKey } from "@/i18n";

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

const HELP_ITEM_KEYS: StringKey[] = [
  "landing.help1",
  "landing.help2",
  "landing.help3",
  "landing.help4",
  "landing.help5",
  "landing.help6",
];

const STEPS: { n: string; tKey: StringKey; dKey: StringKey }[] = [
  { n: "01", tKey: "landing.step1Title", dKey: "landing.step1Desc" },
  { n: "02", tKey: "landing.step2Title", dKey: "landing.step2Desc" },
  { n: "03", tKey: "landing.step3Title", dKey: "landing.step3Desc" },
];

const SERVICES: { id: string; titleKey: StringKey; summaryKey: StringKey; detailsKey: StringKey }[] = [
  {
    id: "qr",
    titleKey: "landing.svcQrTitle",
    summaryKey: "landing.svcQrSummary",
    detailsKey: "landing.svcQrDetails",
  },
  {
    id: "menu",
    titleKey: "landing.svcMenuTitle",
    summaryKey: "landing.svcMenuSummary",
    detailsKey: "landing.svcMenuDetails",
  },
  {
    id: "website",
    titleKey: "landing.svcWebsiteTitle",
    summaryKey: "landing.svcWebsiteSummary",
    detailsKey: "landing.svcWebsiteDetails",
  },
  {
    id: "training",
    titleKey: "landing.svcTrainingTitle",
    summaryKey: "landing.svcTrainingSummary",
    detailsKey: "landing.svcTrainingDetails",
  },
  {
    id: "support",
    titleKey: "landing.svcSupportTitle",
    summaryKey: "landing.svcSupportSummary",
    detailsKey: "landing.svcSupportDetails",
  },
];

function Landing() {
  const navigate = useNavigate();
  const { t } = useT();
  const [leaving, setLeaving] = useState(false);
  const [openService, setOpenService] = useState<string | null>(null);

  const startConsult = () => {
    if (leaving) return;
    setLeaving(true);
    void navigate({ to: "/consult" });
  };

  return (
    <main className="fade-in">
      {/* HERO */}
      <section className="relative h-[100dvh] min-h-[580px] w-full overflow-hidden">
        <img
          src={IMAGES.heroInterior}
          alt="Warm restaurant interior with wooden tables and ambient lighting"
          className="fixed inset-0 z-[-1] h-[100dvh] w-full object-cover slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,42,95,0.94)] via-[rgba(15,42,95,0.55)] to-[rgba(8,17,31,0.35)]" />
        <div className="absolute inset-0 flex flex-col px-5 pt-5 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg font-semibold tracking-tight text-white">မြန်ဆန်</span>
            <LanguageToggle tone="dark" />
          </div>
          <div className="mt-auto max-w-2xl pb-12 2xl:max-w-3xl">
            <h1 className="text-[clamp(1.5rem,5.2vw,2.25rem)] leading-[1.25] font-semibold text-white sm:text-4xl lg:text-[44px]">
              {t("landing.heroTitleLine1")}
              <br />
              {t("landing.heroTitleLine2")}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              {t("landing.heroDescription")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={startConsult}
                disabled={leaving}
                className="min-h-12 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:min-h-13 sm:px-7 sm:text-[15px]"
              >
                {leaving ? t("landing.starting") : t("landing.startConsult")}
              </button>
              <Link
                to="/r/shwe-hotpot/table/$table"
                params={{ table: "7" }}
                className="min-h-12 rounded-full border border-white/50 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:min-h-13 sm:px-7 sm:text-[15px]"
              >
                {t("landing.exploreExperience")}
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/70">{t("landing.trustLine")}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-[1100px] bg-background px-5 py-16 sm:px-6 sm:py-20 2xl:max-w-[1400px]">
        <p className="text-[11px] tracking-[0.35em] text-muted-foreground">{t("landing.howItWorks")}</p>
        <div className="mt-10">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-2 border-t border-border py-8 sm:flex-row sm:gap-10"
            >
              <span className="text-3xl font-light text-primary/40 sm:text-4xl sm:w-24">{s.n}</span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{t(s.tKey)}</h3>
                <p className="mt-1.5 text-[15px] text-muted-foreground">{t(s.dKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE HELP WITH */}
      <section className="relative grid items-center gap-10 bg-background px-5 py-10 sm:px-6 lg:grid-cols-2 lg:px-16">
        <img
          src={IMAGES.diningWarm}
          alt="Guests sharing a meal"
          loading="lazy"
          className="h-[320px] w-full rounded-3xl object-cover sm:h-[420px]"
        />
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("landing.helpTitle")}</h2>
          <ul className="mt-6 space-y-3">
            {HELP_ITEM_KEYS.map((h) => (
              <li key={h} className="border-b border-border pb-3 text-[15px] leading-relaxed">
                {t(h)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OUR SERVICES — tap a service to reveal details */}
      <section className="relative mx-auto max-w-[1100px] bg-background px-5 py-16 sm:px-6 sm:py-20 2xl:max-w-[1400px]">
        <p className="text-[11px] tracking-[0.35em] text-muted-foreground">{t("landing.ourServices")}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("landing.servicesHeading")}
        </h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {SERVICES.map((s) => {
            const open = openService === s.id;
            return (
              <div key={s.id}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`service-${s.id}`}
                  onClick={() => setOpenService(open ? null : s.id)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 text-left transition-colors hover:bg-muted/40"
                >
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold tracking-tight">{t(s.titleKey)}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{t(s.summaryKey)}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  id={`service-${s.id}`}
                  hidden={!open}
                  className="fade-up pb-6 text-[15px] leading-relaxed text-muted-foreground sm:max-w-2xl"
                >
                  {t(s.detailsKey)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WEBSITE PREVIEW */}
      <section className="relative h-[55vh] min-h-[320px] overflow-hidden sm:h-[60vh] sm:min-h-[380px]">
        <img
          src={IMAGES.hotpot}
          alt="Restaurant website preview"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,42,95,0.9)] to-transparent" />
        <div className="absolute bottom-10 left-6 max-w-lg sm:left-12 lg:left-16">
          <p className="text-[11px] tracking-[0.35em] text-white/70">{t("landing.yourWebsite")}</p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            {t("landing.websiteHeading")}
          </h2>
          <Link
            to="/preview/shwe-hotpot"
            className="mt-6 inline-flex min-h-12 items-center rounded-full border border-white/60 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:text-[15px]"
          >
            {t("landing.viewSampleWebsite")}
          </Link>
        </div>
      </section>

      {/* PACKAGE PREVIEW */}
      <section className="relative mx-auto max-w-[1100px] bg-background px-5 py-16 sm:px-6 sm:py-20 2xl:max-w-[1400px]">
        <p className="text-[11px] tracking-[0.35em] text-muted-foreground">{t("landing.packages")}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{t("landing.packagesHeading")}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <PackageCard id="start" compact />
          <PackageCard id="growth" compact />
          <PackageCard id="partner" compact />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative mx-auto max-w-[1100px] bg-background px-5 pb-24 sm:px-6 2xl:max-w-[1400px]">
        <div className="rounded-3xl bg-card p-8 text-center ring-1 ring-border sm:p-10">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t("landing.finalCtaHeading")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-[15px]">
            {t("landing.finalCtaSubheading")}
          </p>
          <button
            onClick={startConsult}
            disabled={leaving}
            className="mt-7 min-h-12 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:min-h-13 sm:text-[15px]"
          >
            {leaving ? t("landing.starting") : t("landing.startConsult")}
          </button>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © မြန်ဆန် ·{" "}
          <Link to="/owner" className="underline underline-offset-4">
            {t("landing.footerOwnerHome")}
          </Link>
        </p>
      </section>
    </main>
  );
}
