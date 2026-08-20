import { createFileRoute, Link } from "@tanstack/react-router";
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
});

function PreviewPage() {
  const { state, goToStage } = useSetup();
  const template = templateFor(state.websiteStyle ?? "luxury");

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          to="/setup"
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