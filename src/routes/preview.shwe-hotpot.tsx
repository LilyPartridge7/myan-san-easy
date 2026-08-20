import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { RestaurantPreview } from "@/components/myansan/RestaurantPreview";
import { IMAGES } from "@/data/images";
import { templateFor } from "@/services/mockConsultant";
import { useSetup } from "@/state/setupStore";

export const Route = createFileRoute("/preview/shwe-hotpot")({
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
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-[900px] space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          မြန်
        </div>
        <div>
          <p className="text-[16px] font-medium">သင့်ဆိုင် Website Preview ကို ပြင်ဆင်နေပါတယ်...</p>
          <p className="mt-1 text-sm text-muted-foreground">Preparing your restaurant preview...</p>
          <p className="mt-1 text-xs text-muted-foreground">This should only take a moment.</p>
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Website preview ကို ဖွင့်ရာမှာ အခက်အခဲရှိပါတယ်။
        </h1>
        <p className="text-sm text-muted-foreground">
          သင့် setup အချက်အလက်တွေ အားလုံး သိမ်းထားပြီးပါပြီ။ ထပ်ကြိုးစားကြည့်လို့ရပါတယ်။
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => router.invalidate()}
            className="min-h-12 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground"
          >
            Try Again
          </button>
          <Link
            to="/setup"
            className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-6 text-[15px] font-medium"
          >
            Back to Setup
          </Link>
        </div>
      </div>
    </div>
  );
}

function PreviewPage() {
  const { state, hydrated, goToStage } = useSetup();
  const template = templateFor(state.websiteStyle ?? "luxury");
  const returnStage = state.previewReturnStage ?? "website";

  if (!hydrated) return <PreviewLoading />;

  return (
    <div className="page-enter min-h-screen">
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          to="/setup"
          onClick={() => goToStage(returnStage)}
          className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-medium"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Setup
        </Link>
        <Link
          to="/setup"
          onClick={() => goToStage("website")}
          className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium"
        >
          Edit
        </Link>
        <Link
          to="/setup"
          onClick={() => goToStage("qr")}
          className="ml-auto inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Continue Setup →
        </Link>
      </div>
      <RestaurantPreview
        template={template}
        name={state.restaurantName}
        tagline={state.tagline}
        color={state.restaurantColor}
        heroImage={IMAGES.heroInterior}
      />
    </div>
  );
}