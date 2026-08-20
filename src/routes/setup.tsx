import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { BrandHeader } from "@/components/myansan/BrandHeader";
import { AIMessage } from "@/components/myansan/Chat";
import { PackageCard, ComparePackages } from "@/components/myansan/PackageCard";
import { QRPreview } from "@/components/myansan/QRPreview";
import { SetupNavigation, StageRail } from "@/components/myansan/SetupNavigation";
import { WebsiteStyleSelector } from "@/components/myansan/WebsiteStyleSelector";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SERVICE_LABELS, getPackage, type ServiceKey } from "@/data/packages";
import { recommend } from "@/services/mockConsultant";
import { useSetup, type HelpService, type QRStyle } from "@/state/setupStore";
import { useState } from "react";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Your Setup — မြန်ဆန်" },
      {
        name: "description",
        content:
          "Choose and customize your မြန်ဆန် setup: package, restaurant website style, table QR design and the help you want from our team.",
      },
      { property: "og:title", content: "Your မြန်ဆန် Setup" },
      {
        property: "og:description",
        content: "Confirm a setup recommended for your restaurant in a few simple steps.",
      },
    ],
  }),
  component: SetupPage,
});

const HELP_OPTIONS: { id: HelpService; label: string }[] = [
  { id: "menuDigital", label: "Menu ကို digital ပြောင်းပေးပါ" },
  { id: "qrStand", label: "QR stand ပြင်ဆင်ပေးပါ" },
  { id: "staffTraining", label: "Staff ကို အသုံးပြုနည်း သင်ပေးပါ" },
  { id: "websiteHelp", label: "Website setup ကူညီပေးပါ" },
  { id: "selfServe", label: "ကိုယ်တိုင်လုပ်မယ်" },
];

const QR_STYLES: { id: QRStyle; label: string }[] = [
  { id: "simple", label: "Simple" },
  { id: "traditional", label: "Traditional" },
  { id: "premium", label: "Premium" },
];

function SetupPage() {
  const navigate = useNavigate();
  const {
    state,
    update,
    goToStage,
    goBack,
    canGoBack,
    toggleService,
    toggleHelp,
    applyPackage,
  } = useSetup();
  const [compareOpen, setCompareOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const rec = recommend(state);
  const recommendedId = state.recommendedPackage ?? rec.packageId;

  useEffect(() => {
    if (!state.recommendedPackage) {
      update({ recommendedPackage: rec.packageId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stage = state.currentStage;
  const rail = stage === "recommendation" ? "Consultation" : stage === "summary" || stage === "success" ? "Review" : "Your Setup";

  const back = () => (canGoBack ? goBack() : navigate({ to: "/consult" }));

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader subtitle="Your Setup" />
      <div className="mx-auto max-w-[820px] px-4 py-6 pb-24">
        <StageRail active={rail as "Consultation" | "Your Setup" | "Review"} />

        {stage === "recommendation" ? (
          <div key="recommendation" className="fade-up mt-6 space-y-5">
            <AIMessage>
              အခု သင့်ဆိုင်အခြေအနေကို နားလည်ပါပြီ။ {rec.reason}
            </AIMessage>
            <PackageCard id={recommendedId} recommendedFor={state.restaurantName} />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  applyPackage(recommendedId);
                  goToStage("website");
                }}
                className="min-h-12 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                ဒီ Setup ကိုယူမယ်
              </button>
              <button
                onClick={() => {
                  applyPackage(recommendedId);
                  goToStage("package");
                }}
                className="min-h-12 rounded-full border border-border bg-card px-6 text-[15px] font-medium transition-colors hover:bg-muted"
              >
                ကိုယ်တိုင်ပြင်မယ်
              </button>
              <button
                onClick={() => setCompareOpen(true)}
                className="min-h-12 rounded-full px-4 text-sm text-muted-foreground underline underline-offset-4"
              >
                Compare Plans
              </button>
            </div>
            <button
              onClick={() => setWhyOpen(true)}
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              ဘာကြောင့် ဒီလိုအကြံပြုတာလဲ?
            </button>
            <div className="pt-2">
              <Link to="/consult" className="text-sm text-muted-foreground underline underline-offset-4">
                ← Consultation ဆီ ပြန်သွားမယ်
              </Link>
            </div>
          </div>
        ) : null}

        {stage === "package" ? (
          <div key="package" className="fade-up mt-6 space-y-5">
            <AIMessage>ဒီထဲက မလိုတာရှိရင် ဖြုတ်လို့ရပါတယ်။ လိုတာရှိရင်လည်း ထည့်လို့ရပါတယ်။</AIMessage>
            <h2 className="text-xl font-semibold tracking-tight">
              Your Setup · {getPackage(state.selectedPackage ?? recommendedId).name}
            </h2>
            {(["CUSTOMER", "YOUR RESTAURANT", "HELP FROM မြန်ဆန်"] as const).map((group) => (
              <div key={group}>
                <p className="mt-4 text-[11px] tracking-[0.25em] text-muted-foreground">{group}</p>
                <div className="mt-2 space-y-2">
                  {(Object.keys(SERVICE_LABELS) as ServiceKey[])
                    .filter((k) => SERVICE_LABELS[k].group === group)
                    .map((k) => {
                      const on = state.selectedServices.includes(k);
                      return (
                        <button
                          key={k}
                          onClick={() => toggleService(k)}
                          className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 text-left text-[15px] transition-colors ${
                            on ? "border-primary bg-primary/5" : "border-border bg-card"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                              on ? "border-primary bg-primary text-primary-foreground" : "border-border"
                            }`}
                          >
                            {on ? <Check className="h-4 w-4" /> : null}
                          </span>
                          {SERVICE_LABELS[k].label}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
            <SetupNavigation
              onBack={back}
              onContinue={() => goToStage("website")}
              continueLabel="Save & Continue"
            />
          </div>
        ) : null}

        {stage === "website" ? (
          <div key="website" className="fade-up mt-6 space-y-5">
            <AIMessage>
              Customer တွေ သင့်ဆိုင် website ကို ဝင်တဲ့အခါ ဘယ်လိုခံစားစေချင်ပါသလဲ?
            </AIMessage>
            <WebsiteStyleSelector
              value={state.websiteStyle}
              onChange={(s) => update({ websiteStyle: s })}
            />
            <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
              <label className="block text-sm font-medium">
                ဆိုင်နာမည်
                <input
                  value={state.restaurantName}
                  onChange={(e) => update({ restaurantName: e.target.value })}
                  className="mt-1 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium">
                Tagline
                <input
                  value={state.tagline}
                  onChange={(e) => update({ tagline: e.target.value })}
                  className="mt-1 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-center justify-between text-sm font-medium">
                အဓိက အရောင်
                <input
                  type="color"
                  value={state.restaurantColor}
                  onChange={(e) => update({ restaurantColor: e.target.value })}
                  className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-background"
                />
              </label>
              <div className="flex items-center justify-between text-sm font-medium">
                ဘာသာစကား
                <div className="flex gap-2">
                  {(["mm", "en"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => update({ language: l })}
                      className={`min-h-11 rounded-full border px-4 text-sm ${
                        state.language === l ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      {l === "mm" ? "မြန်မာ" : "English"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <AIMessage>
              Website preview အဆင်သင့်ဖြစ်ပါပြီ။ အခုကြည့်မလား၊ setup ကိုဆက်လုပ်မလား?
            </AIMessage>
            <SetupNavigation
              onBack={back}
              onContinue={() => goToStage("qr")}
              continueLabel="Continue Setup"
              disabled={!state.websiteStyle}
              extra={
                <Link
                  to="/preview/shwe-hotpot"
                  className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-6 text-[15px] font-medium transition-colors hover:bg-muted"
                >
                  Preview Website
                </Link>
              }
            />
          </div>
        ) : null}

        {stage === "qr" ? (
          <div key="qr" className="fade-up mt-6 space-y-5">
            <AIMessage>Table မှာ customer scan လုပ်ဖို့ QR ပုံစံရွေးရအောင်။</AIMessage>
            <div className="grid grid-cols-3 gap-3">
              {QR_STYLES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => update({ qrStyle: q.id })}
                  className={`rounded-2xl border p-2 transition-all ${
                    state.qrStyle === q.id ? "border-primary ring-2 ring-primary" : "border-border"
                  }`}
                >
                  <QRPreview style={q.id} restaurantName={state.restaurantName} small />
                  <p className="py-2 text-sm font-medium">{q.label}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => update({ qrStyle: rec.qrStyle })}
              className="min-h-11 rounded-full border border-border bg-card px-5 text-sm font-medium"
            >
              မြန်ဆန်က ရွေးပေးပါ
            </button>
            <SetupNavigation
              onBack={back}
              onContinue={() => goToStage("services")}
              continueLabel="Continue"
              disabled={!state.qrStyle}
            />
          </div>
        ) : null}

        {stage === "services" ? (
          <div key="services" className="fade-up mt-6 space-y-5">
            <AIMessage>
              နောက်ဆုံးအနေနဲ့ ဘယ်အပိုင်းတွေကို မြန်ဆန် team က ကူညီပေးရမလဲ?
            </AIMessage>
            <div className="space-y-3">
              {HELP_OPTIONS.map((h) => {
                const on = state.helpServices.includes(h.id);
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleHelp(h.id)}
                    className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border px-5 text-left text-[16px] transition-colors ${
                      on ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                        on ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                    >
                      {on ? <Check className="h-4 w-4" /> : null}
                    </span>
                    {h.label}
                  </button>
                );
              })}
            </div>
            <SetupNavigation
              onBack={back}
              onContinue={() => goToStage("summary")}
              continueLabel="Continue"
            />
          </div>
        ) : null}

        {stage === "summary" ? (
          <div key="summary" className="fade-up mt-6 space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">{state.restaurantName}</h2>
            <p className="text-[15px] text-muted-foreground">Your မြန်ဆန် Setup</p>
            <dl className="divide-y divide-border rounded-2xl border border-border bg-card">
              <Row label="PACKAGE" value={getPackage(state.selectedPackage ?? recommendedId).name} />
              <Row
                label="CUSTOMER ORDERING"
                value={state.selectedServices.includes("qrOrdering") ? "QR Ordering" : "Menu only"}
              />
              <Row label="WEBSITE" value={styleLabel(state.websiteStyle)} />
              <Row
                label="TABLE QR"
                value={`${state.tableCount ?? "—"} Tables · ${qrLabel(state.qrStyle)}`}
              />
              <Row
                label="HELP REQUESTED"
                value={
                  state.helpServices.length
                    ? state.helpServices
                        .map((h) => HELP_OPTIONS.find((o) => o.id === h)?.label ?? h)
                        .join(" · ")
                    : "မလိုပါ"
                }
              />
            </dl>
            <SetupNavigation
              onBack={back}
              backLabel="Edit Setup"
              onContinue={() => {
                update({ confirmed: true });
                goToStage("success");
              }}
              continueLabel="Confirm My Setup"
              extra={
                <Link
                  to="/owner"
                  className="inline-flex min-h-12 items-center rounded-full px-4 text-sm text-muted-foreground underline underline-offset-4"
                >
                  Save for Later
                </Link>
              }
            />
          </div>
        ) : null}

        {stage === "success" ? (
          <div key="success" className="fade-up mt-10 space-y-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">အဆင်သင့်ဖြစ်ပါပြီ 🎉</h2>
            <p className="text-[15px] text-muted-foreground">
              {state.restaurantName} အတွက် setup ကို သိမ်းထားပါတယ်။
            </p>
            <div className="flex flex-col items-center gap-3">
              <Link
                to="/owner"
                className="inline-flex min-h-13 w-full max-w-xs items-center justify-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground"
              >
                Go to My Restaurant
              </Link>
              <Link
                to="/r/shwe-hotpot/table/$table"
                params={{ table: "7" }}
                className="inline-flex min-h-13 w-full max-w-xs items-center justify-center rounded-full border border-border bg-card px-6 text-[15px] font-medium"
              >
                Preview Customer Experience
              </Link>
              <button
                onClick={() => goToStage("summary")}
                className="min-h-11 text-sm text-muted-foreground underline underline-offset-4"
              >
                Edit Setup
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Plans</DialogTitle>
          </DialogHeader>
          <ComparePackages
            onChoose={(id) => {
              applyPackage(id);
              setCompareOpen(false);
              goToStage("package");
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={whyOpen} onOpenChange={setWhyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ဘာကြောင့် ဒီလိုအကြံပြုတာလဲ?</DialogTitle>
          </DialogHeader>
          <p className="text-[15px] leading-relaxed text-muted-foreground">{rec.why}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-[11px] tracking-[0.25em] text-muted-foreground">{label}</dt>
      <dd className="text-[15px] font-medium">{value}</dd>
    </div>
  );
}

const styleLabel = (s: string | null) =>
  s === "luxury"
    ? "Luxury"
    : s === "modern"
      ? "Modern & Clean"
      : s === "traditional"
        ? "Traditional"
        : s === "warm"
          ? "Warm & Friendly"
          : "—";

const qrLabel = (s: string | null) =>
  s ? `${s.charAt(0).toUpperCase()}${s.slice(1)} Style` : "—";