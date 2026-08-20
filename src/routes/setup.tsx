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
import { formatMMK, quote } from "@/data/pricing";
import { recommend } from "@/services/mockConsultant";
import {
  useSetup,
  type HelpService,
  type PaymentMethod,
  type QRStyle,
} from "@/state/setupStore";
import { useState } from "react";
import { useT } from "@/i18n";

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

const HELP_OPTIONS: { id: HelpService; key: "setup.help.menuDigital" | "setup.help.qrStand" | "setup.help.staffTraining" | "setup.help.websiteHelp" | "setup.help.selfServe" }[] = [
  { id: "menuDigital", key: "setup.help.menuDigital" },
  { id: "qrStand", key: "setup.help.qrStand" },
  { id: "staffTraining", key: "setup.help.staffTraining" },
  { id: "websiteHelp", key: "setup.help.websiteHelp" },
  { id: "selfServe", key: "setup.help.selfServe" },
];

const QR_STYLES: { id: QRStyle; key: "setup.qr.style.simple" | "setup.qr.style.traditional" | "setup.qr.style.premium" }[] = [
  { id: "simple", key: "setup.qr.style.simple" },
  { id: "traditional", key: "setup.qr.style.traditional" },
  { id: "premium", key: "setup.qr.style.premium" },
];

const PAYMENT_METHODS: { id: PaymentMethod; labelKey: "setup.payment.kbzpay.label" | "setup.payment.wavepay.label" | "setup.payment.bank.label" | "setup.payment.contact.label"; noteKey: "setup.payment.kbzpay.note" | "setup.payment.wavepay.note" | "setup.payment.bank.note" | "setup.payment.contact.note" }[] = [
  { id: "kbzpay", labelKey: "setup.payment.kbzpay.label", noteKey: "setup.payment.kbzpay.note" },
  { id: "wavepay", labelKey: "setup.payment.wavepay.label", noteKey: "setup.payment.wavepay.note" },
  { id: "bank", labelKey: "setup.payment.bank.label", noteKey: "setup.payment.bank.note" },
  { id: "contact", labelKey: "setup.payment.contact.label", noteKey: "setup.payment.contact.note" },
];

function SetupPage() {
  const navigate = useNavigate();
  const {
    state,
    hydrated,
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const rec = recommend(state);
  const recommendedId = state.recommendedPackage ?? rec.packageId;
  const [openingPreview, setOpeningPreview] = useState(false);

  useEffect(() => {
    if (hydrated && !state.recommendedPackage) {
      update({ recommendedPackage: rec.packageId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <BrandHeader subtitle="Your Setup" />
        <div className="mx-auto flex max-w-[820px] flex-col items-center gap-3 px-4 py-24 text-center">
          <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            မြန်
          </span>
          <p className="text-[15px] text-muted-foreground">သင့် setup ကို ပြန်ဖွင့်နေပါတယ်...</p>
          <p className="text-sm text-muted-foreground">Restoring your setup…</p>
        </div>
      </div>
    );
  }

  const stage = state.currentStage;
  const rail =
    stage === "recommendation"
      ? "Consultation"
      : stage === "summary" || stage === "payment" || stage === "success" || stage === "saved"
        ? "Review"
        : "Your Setup";

  const activePackage = state.selectedPackage ?? recommendedId;
  const price = quote(activePackage, state.helpServices);

  const submitDetails = () => {
    const e: Record<string, string> = {};
    if (!state.restaurantName.trim()) e['restaurantName'] = "ဆိုင်နာမည် ထည့်ပေးပါ။";
    if (!state.address.trim()) e['address'] = "ဆိုင်လိပ်စာ ထည့်ပေးပါ။";
    if (!state.township.trim()) e['township'] = "မြို့နယ် ထည့်ပေးပါ။";
    if (!state.city.trim()) e['city'] = "မြို့ / တိုင်းဒေသကြီး ထည့်ပေးပါ။";
    if (!state.contactName.trim()) e['contactName'] = "ဆက်သွယ်ရမယ့် သူရဲ့ နာမည် ထည့်ပေးပါ။";
    if (!state.phone.trim()) e['phone'] = "ဆက်သွယ်နိုင်ဖို့ ဖုန်းနံပါတ်ထည့်ပေးပါ။";
    setErrors(e);
    if (Object.keys(e).length === 0) goToStage("summary");
  };

  const payNow = () => {
    setProcessing(true);
    // DEMO PAYMENT FLOW — replace with real payment provider later
    setTimeout(() => {
      setProcessing(false);
      update({
        confirmed: true,
        setupStatus: state.paymentMethod === "contact" ? "waitingForContact" : "paid",
        reference: state.reference ?? `MYN-${String(124 + Math.floor(Math.random() * 60))}`,
      });
      goToStage("success");
    }, 1400);
  };

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
                  preload="intent"
                  onClick={() => {
                    setOpeningPreview(true);
                    update({ previewReturnStage: "website" });
                  }}
                  className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-6 text-[15px] font-medium transition-colors hover:bg-muted"
                >
                  {openingPreview ? "Preparing..." : "Preview Website"}
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
              onContinue={() => goToStage("details")}
              continueLabel="Continue"
            />
          </div>
        ) : null}

        {stage === "details" ? (
          <div key="details" className="fade-up mt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Almost Done</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                မြန်ဆန် team က သင့်ဆိုင် setup ကို ဆက်လက်ကူညီပေးနိုင်ဖို့ အချက်အလက်အနည်းငယ်
                လိုပါတယ်။
              </p>
            </div>

            <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <h3 className="text-lg font-semibold">ဆိုင်ဘယ်မှာရှိပါသလဲ?</h3>
              <Field
                label="ဆိုင်နာမည် *"
                value={state.restaurantName}
                onChange={(v) => update({ restaurantName: v })}
                error={errors['restaurantName']}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="ဆိုင်အမျိုးအစား"
                  value={state.restaurantType ?? ""}
                  onChange={(v) => update({ restaurantType: v })}
                />
                <Field
                  label="Table အရေအတွက်"
                  value={state.tableCount ?? ""}
                  onChange={(v) => update({ tableCount: v })}
                />
              </div>
              <Field
                label="ဆိုင်လိပ်စာ *"
                placeholder="No. 25, Pyay Road"
                value={state.address}
                onChange={(v) => update({ address: v })}
                error={errors['address']}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="မြို့နယ် *"
                  placeholder="Kamayut"
                  value={state.township}
                  onChange={(v) => update({ township: v })}
                  error={errors['township']}
                />
                <Field
                  label="မြို့ / တိုင်းဒေသကြီး *"
                  placeholder="Yangon"
                  value={state.city}
                  onChange={(v) => update({ city: v })}
                  error={errors['city']}
                />
              </div>
              <Field
                label="Map location link (မထည့်လည်း ရပါတယ်)"
                placeholder="Google Maps link"
                value={state.mapLink}
                onChange={(v) => update({ mapLink: v })}
              />
            </section>

            <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <h3 className="text-lg font-semibold">ဘယ်လိုဆက်သွယ်ရမလဲ?</h3>
              <Field
                label="ဆက်သွယ်ရမယ့်သူ နာမည် *"
                value={state.contactName}
                onChange={(v) => update({ contactName: v })}
                error={errors['contactName']}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="ဖုန်းနံပါတ် *"
                  placeholder="09xxxxxxxxx"
                  value={state.phone}
                  onChange={(v) => update({ phone: v })}
                  error={errors['phone']}
                />
                <Field
                  label="Email (မထည့်လည်း ရပါတယ်)"
                  value={state.email}
                  onChange={(v) => update({ email: v })}
                />
              </div>
              <div>
                <p className="text-sm font-medium">ဘယ်လိုဆက်သွယ်တာ ကြိုက်ပါသလဲ?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["phone", "viber", "messenger", "email"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => update({ preferredContact: m })}
                      className={`min-h-12 rounded-full border px-5 text-[15px] capitalize transition-colors ${
                        state.preferredContact === m
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <SetupNavigation onBack={back} onContinue={submitDetails} continueLabel="Continue" />
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
              <Row
                label="LOCATION"
                value={[state.township, state.city].filter(Boolean).join(", ") || "—"}
              />
              <Row label="CONTACT" value={state.phone || "—"} />
            </dl>

            <div className="rounded-2xl border border-border bg-card">
              <p className="px-5 pt-4 text-[11px] tracking-[0.25em] text-muted-foreground">
                PRICE SUMMARY
              </p>
              <dl className="mt-2 divide-y divide-border">
                <Row
                  label="ONE-TIME SETUP"
                  value={`${price.isQuote ? "From " : ""}${formatMMK(price.setup)}`}
                />
                <Row
                  label="FIRST MONTH"
                  value={`${price.isQuote ? "From " : ""}${formatMMK(price.monthly)}`}
                />
                <Row label="MONTHLY SERVICE" value={`${formatMMK(price.monthly)} / month`} />
                <Row label="ADD-ONS" value={formatMMK(price.optional)} />
                <Row
                  label="AMOUNT DUE TODAY"
                  value={`${price.isQuote ? "From " : ""}${formatMMK(price.totalToday)}`}
                />
              </dl>
              {price.isQuote ? (
                <p className="px-5 pb-4 text-xs text-muted-foreground">
                  PARTNER setup ကို ဆိုင်အလိုက် ပြင်ဆင်ပေးတာဖြစ်လို့ နောက်ဆုံးစျေးနှုန်းကို မြန်ဆန်
                  team က quotation နဲ့ အတည်ပြုပေးပါမယ်။
                </p>
              ) : null}
            </div>

            <SetupNavigation
              onBack={back}
              backLabel="Edit"
              onContinue={() => goToStage("payment")}
              continueLabel="Continue to Payment"
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

        {stage === "payment" ? (
          <div key="payment" className="fade-up mt-6 space-y-6">
            <div>
              <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium tracking-wide text-secondary-foreground">
                Demo Checkout
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Complete Your Setup</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                Package ကိုအတည်ပြုပြီး မြန်ဆန် team နဲ့ setup စတင်နိုင်ပါတယ်။
              </p>
            </div>

            <dl className="divide-y divide-border rounded-2xl border border-border bg-card">
              <Row label="RESTAURANT" value={state.restaurantName} />
              <Row label="PACKAGE" value={getPackage(activePackage).name} />
              <Row label="ONE-TIME SETUP" value={formatMMK(price.setup)} />
              <Row label="FIRST MONTH" value={formatMMK(price.monthly)} />
              {price.optional ? <Row label="ADD-ONS" value={formatMMK(price.optional)} /> : null}
              <Row
                label="AMOUNT DUE TODAY"
                value={`${price.isQuote ? "From " : ""}${formatMMK(price.totalToday)}`}
              />
              <Row label="CONTACT" value={state.phone || "—"} />
            </dl>

            <div>
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <div className="mt-3 space-y-3">
                {PAYMENT_METHODS.map((m) => {
                  const on = state.paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => update({ paymentMethod: m.id })}
                      className={`flex min-h-16 w-full items-center gap-4 rounded-2xl border px-5 text-left transition-colors ${
                        on ? "border-primary bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          on ? "border-primary" : "border-border"
                        }`}
                      >
                        {on ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                      </span>
                      <span>
                        <span className="block text-[16px] font-medium">{m.label}</span>
                        <span className="block text-sm text-muted-foreground">{m.note}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {state.paymentMethod === "contact" ? (
              <AIMessage>
                ရပါတယ်။ မြန်ဆန် team က သင့်ကို ဆက်သွယ်ပြီး package နဲ့ payment အကြောင်း
                ရှင်းပြပေးပါမယ်။
              </AIMessage>
            ) : null}

            <p className="text-xs text-muted-foreground">
              🔒 Secure checkout · သင့်အချက်အလက်ကို မြန်ဆန် team အတွက်သာ သုံးပါမယ်။ (Demo — real
              transaction မလုပ်ပါ)
            </p>

            <SetupNavigation
              onBack={back}
              onContinue={payNow}
              disabled={!state.paymentMethod || processing}
              continueLabel={
                processing
                  ? "Processing..."
                  : state.paymentMethod === "contact"
                    ? "Request Setup"
                    : `Pay ${formatMMK(price.totalToday)}`
              }
            />
          </div>
        ) : null}

        {stage === "success" ? (
          <div key="success" className="fade-up mt-10 space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Setup Confirmed</h2>
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
              ကျေးဇူးတင်ပါတယ်။ {state.restaurantName} အတွက် မြန်ဆန် setup request ကို
              လက်ခံပြီးပါပြီ။
            </p>
            <dl className="mx-auto max-w-md divide-y divide-border rounded-2xl border border-border bg-card text-left">
              <Row label="PACKAGE" value={getPackage(activePackage).name} />
              <Row label="RESTAURANT" value={state.restaurantName} />
              <Row
                label="LOCATION"
                value={[state.township, state.city].filter(Boolean).join(", ") || "—"}
              />
              <Row label="REFERENCE" value={state.reference ?? "MYN-00124"} />
              <Row
                label="STATUS"
                value={state.setupStatus === "waitingForContact" ? "Waiting for Contact" : "Paid"}
              />
            </dl>
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
              မြန်ဆန် team က သင့်ကို ဆက်သွယ်ပြီး setup အဆင့်တွေကို ဆက်လက်ကူညီပေးပါမယ်။
            </p>
            <div className="flex flex-col items-center gap-3">
              <Link
                to="/owner"
                className="inline-flex min-h-13 w-full max-w-xs items-center justify-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground"
              >
                Go to My Restaurant
              </Link>
              <button
                onClick={() => goToStage("saved")}
                className="inline-flex min-h-13 w-full max-w-xs items-center justify-center rounded-full border border-border bg-card px-6 text-[15px] font-medium"
              >
                View My Setup
              </button>
              <a
                href="tel:+959000000000"
                className="min-h-11 text-sm text-muted-foreground underline underline-offset-4"
              >
                Contact မြန်ဆန်
              </a>
            </div>
          </div>
        ) : null}

        {stage === "saved" ? (
          <div key="saved" className="fade-up mt-6 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Check className="h-4 w-4" /> Setup Confirmed
              </span>
              <span className="text-sm text-muted-foreground">
                {state.setupStatus === "waitingForContact" ? "Waiting for Contact" : "Paid"}
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">{state.restaurantName}</h2>
            <p className="text-[15px] text-muted-foreground">
              သိမ်းဆည်းထားတဲ့ သင့် မြန်ဆန် setup အချက်အလက်များ
            </p>
            <dl className="divide-y divide-border rounded-2xl border border-border bg-card">
              <Row label="REFERENCE" value={state.reference ?? "MYN-00124"} />
              <Row label="PACKAGE" value={getPackage(activePackage).name} />
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
              <Row
                label="LOCATION"
                value={
                  [state.address, state.township, state.city].filter(Boolean).join(", ") || "—"
                }
              />
              <Row label="CONTACT" value={state.contactName || "—"} />
              <Row label="PHONE" value={state.phone || "—"} />
              <Row
                label="PAYMENT"
                value={
                  PAYMENT_METHODS.find((m) => m.id === state.paymentMethod)?.label ?? "—"
                }
              />
              <Row label="TOTAL PAID TODAY" value={formatMMK(price.totalToday)} />
              <Row label="MONTHLY SERVICE" value={`${formatMMK(price.monthly)} / month`} />
            </dl>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/owner"
                className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground"
              >
                Go to My Restaurant
              </Link>
              <button
                onClick={() => goToStage("success")}
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-6 text-[15px] font-medium"
              >
                Back
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  error?: string | undefined;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        maxLength={200}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 min-h-13 w-full rounded-xl border bg-background px-4 text-[16px] outline-none focus:border-primary ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error ? <span className="mt-1 block text-sm text-destructive">{error}</span> : null}
    </label>
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