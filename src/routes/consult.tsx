import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BrandHeader } from "@/components/myansan/BrandHeader";
import { AIMessage, ChatComposer, QuickChoices, UserMessage } from "@/components/myansan/Chat";
import { QUESTIONS, ackFor, recommend } from "@/services/mockConsultant";
import { useSetup } from "@/state/setupStore";

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

function Consult() {
  const navigate = useNavigate();
  const { state, update, goToStage } = useSetup();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "မင်္ဂလာပါ။ မြန်ဆန်ပါ။ သင့်ဆိုင်အတွက် ဘာလိုအပ်လဲ သိရအောင် မေးခွန်းလေး ၅ ခုလောက် မေးပါရစေ။ မသေချာသေးလည်း ရပါတယ်။",
    },
    { role: "ai", text: QUESTIONS[0]!.text },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, step]);

  const question = QUESTIONS[step];

  const answer = (value: string, label: string) => {
    const q = QUESTIONS[step]!;
    update({ [q.id]: value } as never);
    const next = step + 1;
    setMessages((m) => [...m, { role: "user", text: label }, { role: "ai", text: ackFor(q.id) }]);
    setStep(next);

    if (next < QUESTIONS.length) {
      setTimeout(
        () => setMessages((m) => [...m, { role: "ai", text: QUESTIONS[next]!.text }]),
        420,
      );
    } else {
      const answers = {
        restaurantType: q.id === "restaurantType" ? value : state.restaurantType,
        tableCount: q.id === "tableCount" ? value : state.tableCount,
        orderingMethod: q.id === "orderingMethod" ? value : state.orderingMethod,
        mainProblem: q.id === "mainProblem" ? value : state.mainProblem,
        mainGoal: q.id === "mainGoal" ? value : state.mainGoal,
      };
      const rec = recommend(answers);
      update({
        recommendedPackage: rec.packageId,
        websiteStyle: state.websiteStyle ?? rec.websiteStyle,
        qrStyle: state.qrStyle ?? rec.qrStyle,
        currentStage: "recommendation",
        stageHistory: [],
      });
      setTimeout(
        () =>
          setMessages((m) => [
            ...m,
            {
              role: "ai",
              text: `အခု သင့်ဆိုင်အခြေအနေကို နားလည်ပါပြီ။ ${rec.reason}`,
            },
          ]),
        420,
      );
      setTimeout(() => navigate({ to: "/setup" }), 1400);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <BrandHeader
        subtitle="Free Restaurant Consultation"
        status="သင့်ဆိုင်အကြောင်း သိအောင် မေးနေပါတယ်"
      />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-[820px] flex-col gap-4">
          {messages.map((m, i) =>
            m.role === "ai" ? (
              <AIMessage key={i}>{m.text}</AIMessage>
            ) : (
              <UserMessage key={i}>{m.text}</UserMessage>
            ),
          )}
          {question ? <QuickChoices choices={question.choices} onSelect={answer} /> : null}
          {!question ? (
            <button
              onClick={() => {
                goToStage("recommendation");
                navigate({ to: "/setup" });
              }}
              className="mx-auto mt-2 min-h-12 rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground"
            >
              အကြံပြုချက် ကြည့်မယ်
            </button>
          ) : null}
          <div ref={endRef} />
        </div>
      </div>
      <ChatComposer />
    </div>
  );
}