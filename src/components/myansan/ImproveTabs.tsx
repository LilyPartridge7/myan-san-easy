import type { Health } from "@/services/mockConsultant";
import type { L } from "@/i18n/types";
import { useT } from "@/i18n";
import { HealthScore } from "@/components/myansan/HealthScore";

/** Sample health score used in the preview center (clearly labelled Sample Data). */
export const SAMPLE_HEALTH: Health = {
  total: 62,
  status: { mm: "ဂရုစိုက်ရန်လို", en: "Needs Attention" },
  dims: [
    { key: "digital", label: { mm: "Digital Presence", en: "Digital Presence" }, score: 14 },
    { key: "ops", label: { mm: "Operations", en: "Operations" }, score: 10 },
    { key: "visibility", label: { mm: "Management Visibility", en: "Management Visibility" }, score: 9 },
    { key: "staff", label: { mm: "Staff Readiness", en: "Staff Readiness" }, score: 13 },
    { key: "cx", label: { mm: "Customer Experience", en: "Customer Experience" }, score: 16 },
  ],
  insights: [
    { kind: "strong", text: { mm: "Digital Payment ကို သုံးနေပြီးသားပါ။", en: "Your restaurant already uses digital payments." } },
    { kind: "attention", text: { mm: "Customer Feedback မှာ “စောင့်ရတာကြာ” ဆိုတာ ထပ်ခါထပ်ခါပါနေတယ် — Operations ကို ဂရုစိုက်ရန်။", en: "Feedback repeatedly mentions waiting time — Operations needs attention." } },
    { kind: "opportunity", text: { mm: "ဆိုင်မှာမရှိချိန် အခြေအနေကို မြင်ရတာ နည်းနေသေးတယ်။", en: "You currently have limited visibility when you're away." } },
  ],
};

const Tag = () => {
  const { p } = useT();
  return null;
};

export function HealthTab({ onImprove }: { onImprove: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <HealthScore health={SAMPLE_HEALTH} sample onImprove={onImprove} />
    </section>
  );
}

type Action = { title: L; why?: L; action: L; cta: L; go: string };
const ACTIONS: Action[] = [
  {
    title: { mm: "Order နောက်ကျတာ လျှော့မယ်", en: "Reduce busy-hour order delays" },
    why: { mm: "အလုပ်ရှုပ်ချိန်မှာ Order လက်ခံတာ နောက်ကျနေပါတယ်။", en: "Most order pressure happens during your peak period." },
    action: { mm: "QR Ordering ကို Table Order အတွက် စသုံးပါ။", en: "Let customers use QR ordering for table orders." },
    cta: { mm: "QR Setup ကြည့်မယ်", en: "See QR Setup" },
    go: "qr",
  },
  {
    title: { mm: "Kitchen တုံ့ပြန်မှု မြန်အောင်", en: "Improve kitchen response" },
    why: { mm: "Order တွေ New အခြေအနေမှာ ကြာနေပါတယ်။", en: "Orders are spending too long in New status." },
    action: { mm: "Kitchen Screen Status ကို ပုံမှန်ပြောင်းပေးပါ။", en: "Use Kitchen Screen status updates consistently." },
    cta: { mm: "Kitchen ဖွင့်မယ်", en: "Open Kitchen" },
    go: "kitchen",
  },
  {
    title: { mm: "Staff ကို လုပ်ငန်းစဉ်အသစ် သင်ပေးမယ်", en: "Train staff on the new workflow" },
    action: { mm: "၄ မိနစ် Kitchen Order သင်ခန်းစာကို ပြီးအောင်လုပ်ပါ။", en: "Complete the 4-minute Kitchen Order lesson." },
    cta: { mm: "Training စမယ်", en: "Start Training" },
    go: "training",
  },
];

export function CoachTab({ go, available }: { go: (tab: string) => void; available: string[] }) {
  const { p } = useT();
  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">{p({ mm: "သင့် Growth Coach", en: "Your Growth Coach" })}</h2>
        <Tag />
      </div>
      <p className="text-sm text-muted-foreground">{p({ mm: "နောက်ဘာကို ပြင်ရမလဲ သိရအောင်။", en: "Know what to improve next." })}</p>
      <p className="mt-5 text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "ဒီအပတ် အရင်လုပ်သင့်တာ", en: "THIS WEEK" })}</p>
      <ol className="mt-2 space-y-3">
        {ACTIONS.map((a, i) => (
          <li key={i} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[11px] font-bold tracking-widest text-primary">{p({ mm: `ဦးစားပေး ${i + 1}`, en: `PRIORITY ${i + 1}` })}</p>
            <p className="mt-1 font-semibold">{p(a.title)}</p>
            {a.why && <p className="mt-2 text-sm"><span className="text-muted-foreground">{p({ mm: "ဘာကြောင့်လဲ — ", en: "Why — " })}</span>{p(a.why)}</p>}
            <p className="mt-1 text-sm"><span className="text-muted-foreground">{p({ mm: "လုပ်သင့်တာ — ", en: "Action — " })}</span>{p(a.action)}</p>
            {available.includes(a.go) && (
              <button onClick={() => go(a.go)} className="mt-3 min-h-10 rounded-full border border-primary px-4 text-sm font-medium text-primary hover:bg-primary/5">{p(a.cta)}</button>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FeedbackTab({ go }: { go: (tab: string) => void }) {
  const { p } = useT();
  const bars = [
    { l: { mm: "ကောင်း", en: "Positive" }, v: 72, cls: "bg-primary" },
    { l: { mm: "သာမန်", en: "Neutral" }, v: 16, cls: "bg-muted-foreground/50" },
    { l: { mm: "ဂရုစိုက်ရန်", en: "Needs Attention" }, v: 12, cls: "bg-destructive/70" },
  ];
  const comments: L[] = [
    { mm: "“Hotpot ကောင်းတယ်၊ ဒါပေမဲ့ Order မှာဖို့ ကြာကြာစောင့်ရတယ်။”", en: "“The hotpot was good but we waited quite long to order.”" },
    { mm: "“Staff တွေ ဖော်ရွေတယ်။”", en: "“Staff were friendly.”" },
    { mm: "“အစားအသောက်ကောင်းတယ်၊ ဒါပေမဲ့ သောက်စရာတစ်ခု ကျန်ခဲ့တယ်။”", en: "“Food was good, but one drink was missing.”" },
  ];
  return (
    <section className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "CUSTOMER FEEDBACK", en: "CUSTOMER FEEDBACK" })} · {p({ mm: "၃၂ ခု", en: "32 responses" })}</p>
          <Tag />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">{p({ mm: "ဆိုင်ရဲ့ QR / Order ပြီးနောက် Feedback Form မှ စုဆောင်းထားသည်", en: "Collected through the restaurant's own QR / post-order feedback form" })}</p>
        <div className="mt-4 space-y-2">
          {bars.map((b) => (
            <div key={b.v}>
              <div className="flex justify-between text-xs"><span>{p(b.l)}</span><span className="font-medium">{b.v}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${b.cls}`} style={{ width: `${b.v}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-muted/60 p-3"><p className="text-[10px] font-bold tracking-widest text-primary">{p({ mm: "အကြိုက်ဆုံး", en: "TOP POSITIVE" })}</p><p className="mt-1 text-sm font-medium">{p({ mm: "အစားအသောက် အရသာ", en: "Food quality" })}</p><p className="text-xs text-muted-foreground">{p({ mm: "၁၈ ကြိမ်", en: "18 mentions" })}</p></div>
          <div className="rounded-2xl bg-muted/60 p-3"><p className="text-[10px] font-bold tracking-widest text-destructive">{p({ mm: "အဓိကပြဿနာ", en: "TOP ISSUE" })}</p><p className="mt-1 text-sm font-medium">{p({ mm: "စောင့်ရချိန်", en: "Waiting time" })}</p><p className="text-xs text-muted-foreground">{p({ mm: "၈ ကြိမ်", en: "8 mentions" })}</p></div>
          <div className="rounded-2xl bg-muted/60 p-3"><p className="text-[10px] font-bold tracking-widest text-muted-foreground">{p({ mm: "ထပ်ခါထပ်ခါ", en: "REPEATED" })}</p><p className="mt-1 text-sm font-medium">{p({ mm: "ညစာချိန် Order ကြာတယ်", en: "Orders take longer during dinner hours" })}</p></div>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "AI အကျဉ်းချုပ်", en: "AI SUMMARY" })}</p>
        <p className="mt-1 text-sm">{p({ mm: "Customer တွေ အစားအသောက်ကို ကြိုက်ကြပေမဲ့ အလုပ်ရှုပ်ချိန်မှာ စောင့်ရတာကြာတယ်လို့ ထပ်ခါထပ်ခါ ပြောကြပါတယ်။", en: "Customers generally like the food, but waiting time appears repeatedly during busy periods." })}</p>
        <p className="mt-3 text-[11px] font-semibold tracking-widest text-muted-foreground">{p({ mm: "လုပ်သင့်တာ", en: "RECOMMENDED ACTION" })}</p>
        <p className="mt-1 text-sm font-medium">{p({ mm: "ညစာချိန်မှာ Order လက်ခံရတဲ့ ဖိအားကို လျှော့ပါ။", en: "Reduce order-taking pressure during dinner hours." })}</p>
        <button onClick={() => go("coach")} className="mt-3 min-h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">{p({ mm: "Growth Action ကြည့်မယ်", en: "View Growth Action" })}</button>
      </div>
      <ul className="space-y-2">
        {comments.map((c, i) => <li key={i} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">{p(c)}</li>)}
      </ul>
    </section>
  );
}
