import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { BrandHeader } from "@/components/myansan/BrandHeader";
import { AIMessage, ChatComposer, QuickChoices, UserMessage } from "@/components/myansan/Chat";
import { ContactButton } from "@/components/myansan/ContactDialog";
import { PackageCard } from "@/components/myansan/PackageCard";
import { ackFor, answerLabel, computeHealth, interpretAnswer, questionsFor, recommend, STEP_OF, tablesFromText, typedAck } from "@/services/mockConsultant";
import { HealthScore } from "@/components/myansan/HealthScore";
import { ChatBackdrop } from "@/components/myansan/ChatBackdrop";
import { useSetup, type ConsultTurn } from "@/state/setupStore";
import { useT } from "@/i18n";
import { pick, type Lang } from "@/i18n/types";

export const Route = createFileRoute("/consult")({
  head: () => ({
    meta: [
      { title: "Free Consultation — မြန်ဆန်" },
      {
        name: "description",
        content:
          "Free restaurant consultation with မြန်ဆန်. Answer five easy questions and get a setup recommendation for your restaurant.",
      },
      { property: "og:title", content: "Free Restaurant Consultation — မြန်ဆန်" },
      {
        property: "og:description",
        content: "Five easy questions, one clear recommendation for your restaurant.",
      },
    ],
  }),
  component: Consult,
});

type Msg = { role: "ai" | "user"; text: string };

/** Rebuild the whole conversation from the saved answer history, in the current language. */
function buildTranscript(turns: ConsultTurn[], lang: Lang, welcome: string): Msg[] {
  const msgs: Msg[] = [{ role: "ai", text: welcome }];
  const qs = questionsFor(turns);
  turns.forEach((t, i) => {
    const q = qs[i];
    const questionText = q ? pick(lang, q.text) : t.question;
    const labelText = q ? answerLabel(q, t.value, lang) : t.label;
    msgs.push({ role: "ai", text: questionText });
    // Typed answers keep the owner's own words in the bubble.
    msgs.push({ role: "user", text: t.raw?.trim() || labelText });
    const ack = q && t.raw ? typedAck(q, t.value, lang, labelText) : ackFor(t.stage as never, lang);
    if (ack && i < qs.length - 1) msgs.push({ role: "ai", text: ack });
  });
  const next = qs[turns.length];
  if (next) msgs.push({ role: "ai", text: pick(lang, next.text) });
  return msgs;
}

function Consult() {
  const navigate = useNavigate();
  const { state, hydrated, update, answerConsult, undoConsult, goToStage, applyPackage } =
    useSetup();
  const { t, lang, p } = useT();
  const [typing, setTyping] = useState(false);
  const [extraMsgs, setExtraMsgs] = useState<Msg[]>([]);
  const [showPkgs, setShowPkgs] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const turns = state.consultTurns;
  const step = turns.length;
  const qs = useMemo(() => questionsFor(turns), [turns]);
  const question = qs[step];
  const finished = step >= qs.length;

  const answers = useMemo(
    () => ({
      restaurantType: turns.find((t) => t.stage === "restaurantType")?.value ?? null,
      tableCount: turns.find((t) => t.stage === "tableCount")?.value ?? null,
      currentTools: turns.find((t) => t.stage === "currentTools")?.value ?? null,
      followUp: turns.find((t) => t.stage === "followUp")?.value ?? null,
      mainProblem: turns.find((t) => t.stage === "mainProblem")?.value ?? null,
      mainGoal: turns.find((t) => t.stage === "mainGoal")?.value ?? null,
    }),
    [turns],
  );
  const rec = useMemo(() => recommend(answers), [answers]);
  const health = useMemo(() => computeHealth(answers), [answers]);
  const [revealed, setRevealed] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  useEffect(() => {
    if (!finished) { setRevealed(false); return; }
    const id = window.setTimeout(() => setRevealed(true), 900);
    return () => window.clearTimeout(id);
  }, [finished]);

  const messages = useMemo(
    () => [...buildTranscript(turns, lang, t("consult.welcome")), ...extraMsgs],
    [turns, extraMsgs, lang, t],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  // Once the last question is answered, save the recommendation (in place, no redirect).
  useEffect(() => {
    if (!hydrated || !finished || state.recommendedPackage === rec.packageId) return;
    update({
      recommendedPackage: rec.packageId,
      websiteStyle: state.websiteStyle ?? rec.websiteStyle,
      qrStyle: state.qrStyle ?? rec.qrStyle,
      currentStage: "recommendation",
      stageHistory: [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, finished, rec.packageId]);

  /** The single pipeline every answer goes through — tapped or typed. */
  const processAnswer = (value: string, label: string, raw?: string) => {
    const q = qs[step];
    if (!q || typing) return;
    setExtraMsgs([]);
    answerConsult({
      stage: q.id,
      question: pick(lang, q.text),
      value,
      label,
      ...(raw ? { raw } : null),
    });
    // Details form shows the owner-facing wording, not the internal value.
    update({ [q.id]: q.id === "restaurantType" ? label : value } as never);
    // "Chinese restaurant, 18 tables" answers step 1 in one go.
    const tb = q.id === "restaurantType" && raw ? tablesFromText(raw) : null;
    if (tb) {
      answerConsult({ stage: "tableCount", question: pick(lang, qs[1]!.text), value: tb.value, label: pick(lang, tb.label) });
      update({ tableCount: tb.value } as never);
    }
    setTyping(true);
    window.setTimeout(() => setTyping(false), 220);
  };

  const answer = (value: string, label: string) => processAnswer(value, label);

  /** Free text is normalized against the CURRENT question, then reuses the same pipeline. */
  const handleTyped = (text: string) => {
    if (typing) return;
    const q = qs[step];
    if (!q) {
      setExtraMsgs((m) => [
        ...m,
        { role: "user", text },
        { role: "ai", text: t("consult.fallbackNoQuestion") },
      ]);
      return;
    }
    const result = interpretAnswer(q, text);
    if (result.kind === "match") {
      processAnswer(result.value, pick(lang, result.label), text);
      return;
    }
    setExtraMsgs((m) => [...m, { role: "user", text }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setExtraMsgs((m) => [...m, { role: "ai", text: pick(lang, result.message) }]);
    }, 450);
  };

  const back = () => {
    if (turns.length === 0) {
      navigate({ to: "/" });
      return;
    }
    setExtraMsgs([]);
    setTyping(false);
    undoConsult();
  };

  if (!hydrated) {
    return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <ChatBackdrop />
      <BrandHeader subtitle={t("consult.headerSubtitle")} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            မြန်
          </span>
          <p className="text-[15px] text-muted-foreground">{t("consult.restoring")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <ChatBackdrop />
      <BrandHeader
        subtitle={t("consult.headerSubtitle")}
        status={t("consult.headerStatus")}
        onBack={back}
      />
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 pb-4">
        <div className="mx-auto flex max-w-[820px] flex-col gap-4">
          {messages.map((m, i) =>
            m.role === "ai" ? (
              <AIMessage key={i}>{m.text}</AIMessage>
            ) : (
              <UserMessage key={i}>{m.text}</UserMessage>
            ),
          )}
          {typing ? (
            <div className="fade-up flex items-center gap-2 pl-11 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              <span className="ml-1">{t("consult.thinking")}</span>
            </div>
          ) : null}

          {!typing && question ? (
            <p className="pl-0 text-[11px] font-semibold tracking-widest text-primary sm:pl-11">{STEP_OF[question.id]} {lang === "mm" ? "/ 4" : "of 4"}</p>
          ) : null}
          {!typing && question ? (
            <QuickChoices
              key={`${step}-${question.id}`}
              multi={!!question.multi}
              doneLabel={t("consult.doneSelecting")}
              choices={question.choices.map((c) => ({ value: c.value, label: p(c.label) }))}
              onSelect={answer}
            />
          ) : null}
          {!typing && question ? (
            <div className="pl-0 sm:pl-11">
              <button
                onClick={() => { const c = question.choices[0]; if (c) answer(c.value, p(c.label)); }}
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {p({ en: "Skip this question →", mm: "ဒီမေးခွန်း ကျော်မယ် →" })}
              </button>
            </div>
          ) : null}

          {step === 0 && !typing ? (
            <div className="pl-0 sm:pl-11">
              <button
                onClick={() => setShowPkgs((v) => !v)}
                className="min-h-11 rounded-full border border-primary px-5 text-[15px] font-medium text-primary transition-colors hover:bg-primary/5"
              >
                {showPkgs ? t("consult.hidePackages") : t("consult.viewPackages")}
              </button>
              {showPkgs ? (
                <div className="fade-up mt-4 grid gap-4 md:grid-cols-3">
                  {(["start", "growth", "partner"] as const).map((id) => (
                    <PackageCard key={id} id={id} />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {!typing && finished && !revealed ? (
            <div className="fade-up pl-11 text-sm text-muted-foreground">
              {p({ mm: "သင့်ဆိုင်ကို နားလည်နေပါတယ်... သင့်တော်တဲ့ Solution တွေ ရွေးနေပါတယ်...", en: "Understanding your restaurant... Matching the right solutions... Preparing your setup..." })}
            </div>
          ) : null}
          {!typing && finished && revealed ? (
            <div className="fade-up space-y-4">
              <div className="grid items-stretch gap-4 sm:grid-cols-2">
                <AIMessage hideAvatar bubbleClassName="h-full w-full max-w-none px-4 py-3 text-sm">
                  <p className="font-semibold">
                    {t("consult.recPackage", { name: rec.packageId.charAt(0).toUpperCase() + rec.packageId.slice(1) })}
                  </p>
                  <p className="mt-1">{p(rec.reason).split(". ")[0]}.</p>
                  {showWhy ? <p className="mt-2 text-[13px]">{p(rec.why)} {p(rec.reason)} {rec.note ? p(rec.note) : ""}</p> : null}
                  <p className="mt-2">{t("consult.recommendSystems")}</p>
                  <ul className="mt-1 space-y-1">
                    {rec.systems.map((s) => (
                      <li key={s.id}>
                        ✓ <span className="font-medium">{p(s.label)}</span> — {p(s.why)}
                      </li>
                    ))}
                  </ul>
                </AIMessage>
                <HealthScore health={health} compact className="flex h-full flex-col" onImprove={() => navigate({ to: "/preview/shwe-hotpot", search: { from: undefined } })} />
              </div>
              <div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => { update({ previewReturnStage: "recommendation" } as never); navigate({ to: "/preview/shwe-hotpot", search: { from: undefined } }); }}
                    className="min-h-12 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                  >
                    {p({ mm: "ကျွန်တော့် Setup ကို Preview ကြည့်မယ်", en: "Preview My Setup" })}
                  </button>
                  <ContactButton variant="outline" />
                  <button onClick={() => setShowWhy((v) => !v)} className="min-h-12 rounded-full border border-border bg-card px-6 text-[15px] font-medium hover:bg-muted">
                    {p({ mm: "ဘာကြောင့် ဒါကို အကြံပြုတာလဲ?", en: "Why this recommendation?" })}
                  </button>
                </div>
                <div className="mt-4"><PackageCard id={rec.packageId} recommendedFor={state.restaurantName} /></div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      applyPackage(rec.packageId);
                      goToStage("website");
                      navigate({ to: "/setup" });
                    }}
                    className="min-h-12 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                  >
                    {t("consult.takeSetup")}
                  </button>
                  <button
                    onClick={() => {
                      applyPackage(rec.packageId);
                      goToStage("package");
                      navigate({ to: "/setup" });
                    }}
                    className="min-h-12 rounded-full border border-border bg-card px-6 text-[15px] font-medium transition-colors hover:bg-muted"
                  >
                    {t("consult.customize")}
                  </button>
                  <Link
                    to="/setup"
                    onClick={() => goToStage("recommendation")}
                    className="inline-flex min-h-12 items-center rounded-full px-4 text-sm text-muted-foreground underline underline-offset-4"
                  >
                    {t("consult.comparePlans")}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {turns.length > 0 ? (
            <button
              onClick={back}
              className="mr-auto inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" /> {t("consult.editPrevious")}
            </button>
          ) : null}
          <div ref={endRef} />
        </div>
      </div>
      <ChatComposer onSend={handleTyped} disabled={typing} />
    </div>
  );
}
