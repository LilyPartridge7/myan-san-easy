import { ContactButton } from "@/components/myansan/ContactDialog";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { DigitalSetupPreview } from "@/components/myansan/DigitalSetupPreview";
import { IMAGES } from "@/data/images";
import { answerLabel, questionsFor, recommend, templateFor } from "@/services/mockConsultant";
import { useSetup } from "@/state/setupStore";
import { useT } from "@/i18n";

export const Route = createFileRoute("/preview/shwe-hotpot")({
  validateSearch: (search: { from?: string }) => ({
    from: search.from,
  }),
  head: () => ({
    meta: [
      { title: "Shwe Hotpot — Website Preview by မြန်ဆန်" },
      {
        name: "description",
        content:
          "Preview the Shwe Hotpot restaurant website: signature hotpot dishes, opening hours and QR ordering, built with မြန်ဆန်.",
      },
      { property: "og:title", content: "Shwe Hotpot — Gather. Share. Enjoy." },
      {
        property: "og:description",
        content: "A warm hotpot experience made for sharing, in the heart of Yangon.",
      },
      { property: "og:image", content: IMAGES.hotpot },
      { name: "twitter:image", content: IMAGES.hotpot },
    ],
  }),
  component: PreviewPage,
  pendingComponent: PreviewLoading,
  errorComponent: PreviewError,
  notFoundComponent: PreviewError,
});

/** Elegant, theme-aware loading composition — never the home page. */
function PreviewLoading() {
  const { t } = useT();
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-[900px] space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          မြန်
        </div>
        <div>
          <p className="text-[16px] font-medium">{t("preview.loadingTitleMm")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("preview.loadingSubtitle")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("preview.loadingHint")}</p>
        </div>
        <div className="space-y-4 text-left">
          <div className="h-56 w-full animate-pulse rounded-3xl bg-muted" />
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Recoverable error — retry or go back to setup. Never redirects Home. */
function PreviewError() {
  const router = useRouter();
  const { t } = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          {t("preview.errorTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("preview.errorBody")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => router.invalidate()}
            className="min-h-12 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground"
          >
            {t("preview.tryAgain")}
          </button>
          <Link
            to="/setup"
            className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-6 text-[15px] font-medium"
          >
            {t("preview.backToSetup")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function PreviewPage() {
  const { from } = Route.useSearch();
  const { state, hydrated, goToStage, applyPackage } = useSetup();
  const { t, p, lang } = useT();
  const navigate = useNavigate();
  const template = templateFor(state.websiteStyle ?? "luxury");
  const returnStage = state.previewReturnStage ?? "website";
  const rec = useMemo(() => {
    const v = (s: string) => state.consultTurns.find((x) => x.stage === s)?.value ?? null;
    if (state.consultTurns.length === 0) return null;
    return recommend({
      restaurantType: v("restaurantType"),
      tableCount: v("tableCount"),
      currentTools: v("currentTools"),
      mainProblem: v("mainProblem"),
      followUp: v("followUp"),
      mainGoal: v("mainGoal"),
    });
  }, [state.consultTurns]);
  const systems = rec?.systems ?? [];
  const packageId = state.selectedPackage ?? state.recommendedPackage ?? rec?.packageId ?? "growth";
  const basedOn = useMemo(() => {
    const qs = questionsFor(state.consultTurns);
    return state.consultTurns
      .filter((tn) => tn.stage !== "restaurantType")
      .map((tn) => {
        const q = qs.find((x) => x.id === tn.stage);
        return q ? answerLabel(q, tn.value, lang) : tn.label;
      })
      .filter(Boolean);
  }, [state.consultTurns, lang]);
  const branches = state.consultTurns.some((x) => x.value === "multiBranch");

  if (!hydrated) return <PreviewLoading />;

  const btn = "inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium";
  return (
    <div className="page-enter min-h-screen">
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        {from === "owner" ? (
          <Link to="/owner" className={btn}>
            <ChevronLeft className="h-4 w-4" /> {t("preview.backToOwner")}
          </Link>
        ) : (
          <Link to="/setup" onClick={() => goToStage(returnStage)} className={btn}>
            <ChevronLeft className="h-4 w-4" /> {t("preview.backToSetup")}
          </Link>
        )}
        <Link to="/setup" onClick={() => goToStage("qr")} className="ml-auto inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
          {t("preview.continueSetup")}
        </Link>
      </div>
      <DigitalSetupPreview
        systems={systems}
        template={template}
        name={state.restaurantName}
        tagline={state.tagline}
        color={state.restaurantColor}
        packageId={packageId}
        basedOn={basedOn}
        branches={branches}
        onChoose={() => { applyPackage(packageId); goToStage("website"); navigate({ to: "/setup" }); }}
        onCustomize={() => { goToStage("package"); navigate({ to: "/setup" }); }}
      />
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3 px-4 py-10">
        <Link to="/consult" className={btn}>
          {p({ mm: "အကြံပြုချက်သို့ ပြန်မယ်", en: "Back to Recommendation" })}
        </Link>
        <Link to="/setup" onClick={() => goToStage("package")} className={btn}>
          {p({ mm: "Setup ကို စိတ်ကြိုက်ပြင်မယ်", en: "Customize Setup" })}
        </Link>
        <ContactButton variant="outline" />
        <Link to="/setup" onClick={() => goToStage("qr")} className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
          {t("preview.continueSetup")}
        </Link>
      </div>
    </div>
  );
}