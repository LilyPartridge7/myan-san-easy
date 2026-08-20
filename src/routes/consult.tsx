import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { BrandHeader } from "@/components/myansan/BrandHeader";
import { AIMessage, ChatComposer, QuickChoices, UserMessage } from "@/components/myansan/Chat";
import { PackageCard } from "@/components/myansan/PackageCard";
import { QUESTIONS, ackFor, interpretAnswer, recommend, typedAck } from "@/services/mockConsultant";
import { useSetup, type ConsultTurn } from "@/state/setupStore";
import { useT } from "@/i18n";
import { pick, type Lang } from "@/i18n/types";

export const Route = createFileRoute("/consult")({
  head: () => ({
    meta: [
      { title: "အခမဲ့ အကြံပေးမှု — မြန်ဆန်" },
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
  turns.forEach((t, i) => {
    const q = QUESTIONS.find((qq) => qq.id === t.stage);
    const questionText = q ? pick(lang, q.text) : t.question;
    const choice = q?.choices.find((c) => c.value === t.value);
    const labelText = choice ? pick(lang, choice.label) : t.label;
    msgs.push({ role: "ai", text: questionText });
    // Typed answers keep the owner's own words in the bubble.
    msgs.push({ role: "user", text: t.raw?.trim() || labelText });
    const ack = q && t.raw ? typedAck(q, t.value, lang) : ackFor(t.stage as never, lang);
    if (ack && i < QUESTIONS.length - 1) msgs.push({ role: "ai", text: ack });
  });
  const next = QUESTIONS[turns.length];
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
  const endRef = useRef<HTMLDivElement>(null);

  const turns = state.consultTurns;
  const step = turns.length;
  const question = QUESTIONS[step];
  const finished = step >= QUESTIONS.length;

  const answers = useMemo(
    () => ({
      restaurantType: turns.find((t) => t.stage === "restaurantType")?.value ?? null,
      tableCount: turns.find((t) => t.stage === "tableCount")?.value ?? null,
      orderingMethod: turns.find((t) => t.stage === "orderingMethod")?.value ?? null,
      mainProblem: turns.find((t) => t.stage === "mainProblem")?.value ?? null,
      mainGoal: turns.find((t) => t.stage === "mainGoal")?.value ?? null,
    }),
    [turns],
  );
  const rec = useMemo(() => recommend(answers), [answers]);

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
    const q = QUESTIONS[step];
    if (!q || typing) return;
    setExtraMsgs([]);
    answerConsult({
      stage: q.id,
      question: pick(lang, q.text),
      value,
      label,
      ...(raw ? { raw } : null),
    });
    update({ [q.id]: value } as never);
    setTyping(true);
    window.setTimeout(() => setTyping(false), 550);
  };

  const answer = (value: string, label: string) => processAnswer(value, label);

  /** Free text is normalized against the CURRENT question, then reuses the same pipeline. */
  const handleTyped = (text: string) => {
    if (typing) return;
    const q = QUESTIONS[step];
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
      <div className="flex min-h-screen flex-col bg-background">
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
    <div className="flex min-h-screen flex-col bg-background">
      <BrandHeader
        subtitle={t("consult.headerSubtitle")}
        status={t("consult.headerStatus")}
        onBack={back}
      />
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-4">
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
            <QuickChoices
              choices={question.choices.map((c) => ({ value: c.value, label: p(c.label) }))}
              onSelect={answer}
            />
          ) : null}

          {!typing && finished ? (
            <div className="fade-up space-y-4">
              <AIMessage>
                {t("consult.recIntro")} {p(rec.reason)}
              </AIMessage>
              <div className="pl-0 sm:pl-11">
                <PackageCard id={rec.packageId} recommendedFor={state.restaurantName} />
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
