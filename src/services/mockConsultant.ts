import type { PackageId } from "@/data/packages";
import type { QRStyle, Template, WebsiteStyle } from "@/state/setupStore";
import type { L, Lang } from "@/i18n/types";
import { pick } from "@/i18n/types";

export type Choice = { value: string; label: L };

export type Question = {
  id: "restaurantType" | "tableCount" | "orderingMethod" | "mainProblem" | "mainGoal";
  text: L;
  choices: Choice[];
};

export const QUESTIONS: Question[] = [
  {
    id: "restaurantType",
    text: { mm: "ဘယ်လိုဆိုင်မျိုး ဖွင့်ထားပါသလဲ?", en: "What type of restaurant do you run?" },
    choices: [
      { value: "hotpot", label: { mm: "Hotpot / BBQ", en: "Hotpot / BBQ" } },
      { value: "cafe", label: { mm: "Cafe", en: "Cafe" } },
      { value: "myanmar", label: { mm: "မြန်မာစားသောက်ဆိုင်", en: "Myanmar Restaurant" } },
      { value: "casual", label: { mm: "Casual Dining", en: "Casual Dining" } },
      { value: "other", label: { mm: "အခြား", en: "Other" } },
    ],
  },
  {
    id: "tableCount",
    text: { mm: "ဆိုင်မှာ Table ဘယ်လောက်လောက်ရှိပါသလဲ?", en: "About how many tables does your restaurant have?" },
    choices: [
      { value: "1-10", label: { mm: "1–10", en: "1–10" } },
      { value: "11-20", label: { mm: "11–20", en: "11–20" } },
      { value: "21-40", label: { mm: "21–40", en: "21–40" } },
      { value: "40+", label: { mm: "40+", en: "40+" } },
    ],
  },
  {
    id: "orderingMethod",
    text: { mm: "Customer တွေ အခု order ဘယ်လိုတင်ကြပါသလဲ?", en: "How do customers currently place orders?" },
    choices: [
      { value: "waiter", label: { mm: "Waiter ကိုခေါ်တယ်", en: "They call a waiter" } },
      { value: "paper", label: { mm: "စာရွက်နဲ့ order ရေးတယ်", en: "They write orders on paper" } },
      { value: "pos", label: { mm: "ဖုန်း/POS သုံးထားတယ်", en: "They use a phone/POS" } },
      { value: "other", label: { mm: "အခြား", en: "Other" } },
    ],
  },
  {
    id: "mainProblem",
    text: { mm: "ဆိုင်မှာ အခက်ဆုံးက ဘာဖြစ်နေပါသလဲ?", en: "What's the biggest challenge at your restaurant?" },
    choices: [
      { value: "waiting", label: { mm: "Customer က waiter စောင့်ရတာ", en: "Customers waiting for a waiter" } },
      { value: "wrongOrder", label: { mm: "Order မှားတာ", en: "Orders getting mixed up" } },
      { value: "menuChange", label: { mm: "Menu ပြောင်းရတာခက်တာ", en: "Hard to update the menu" } },
      { value: "kitchenSlow", label: { mm: "Kitchen ဆီ order ရောက်တာနှေးတာ", en: "Orders reaching the kitchen slowly" } },
    ],
  },
  {
    id: "mainGoal",
    text: { mm: "တစ်ခုခုပိုလွယ်သွားမယ်ဆိုရင် ဘာကိုအရင်လိုချင်ပါသလဲ?", en: "If one thing could get easier, what would you want first?" },
    choices: [
      { value: "fastOrder", label: { mm: "Customer order မြန်စေချင်တယ်", en: "Faster customer ordering" } },
      { value: "staffEase", label: { mm: "Staff အလုပ်လွယ်စေချင်တယ်", en: "Easier work for staff" } },
      { value: "website", label: { mm: "ဆိုင် website လိုချင်တယ်", en: "A website for the restaurant" } },
      { value: "menuUpdate", label: { mm: "Menu update ပိုလွယ်ချင်တယ်", en: "Easier menu updates" } },
      { value: "letMyansan", label: { mm: "မြန်ဆန်က အကြံပြုပေးပါ", en: "Let မြန်ဆန် recommend" } },
    ],
  },
];

export type Answers = {
  restaurantType: string | null;
  tableCount: string | null;
  orderingMethod: string | null;
  mainProblem: string | null;
  mainGoal: string | null;
};

export type Recommendation = {
  packageId: PackageId;
  headline: L;
  reason: L;
  why: L;
  benefits: L[];
  websiteStyle: WebsiteStyle;
  qrStyle: QRStyle;
};

const tableLabel = (t: string | null) => (t ? t.replace("-", "–") : "");

export function recommend(a: Answers): Recommendation {
  const big = a.tableCount === "21-40" || a.tableCount === "40+";
  const medium = a.tableCount === "11-20";
  const wantsManagedHelp = a.mainGoal === "staffEase" || a.orderingMethod === "paper";

  let packageId: PackageId = "start";
  if (big && wantsManagedHelp) packageId = "partner";
  else if (big || medium || a.mainProblem === "waiting" || a.mainProblem === "kitchenSlow")
    packageId = "growth";

  const websiteStyle: WebsiteStyle =
    a.restaurantType === "cafe"
      ? "modern"
      : a.restaurantType === "myanmar"
        ? "traditional"
        : a.restaurantType === "hotpot"
          ? "luxury"
          : "warm";

  const qrStyle: QRStyle =
    websiteStyle === "luxury" ? "premium" : websiteStyle === "traditional" ? "traditional" : "simple";

  const problemTextMm: Record<string, string> = {
    waiting: "customer တွေ waiter စောင့်နေရတာ",
    wrongOrder: "order တွေ မှားတတ်တာ",
    menuChange: "menu ပြောင်းရတာ ခက်နေတာ",
    kitchenSlow: "kitchen ဆီ order ရောက်တာ နှေးနေတာ",
  };
  const problemTextEn: Record<string, string> = {
    waiting: "customers waiting for a waiter",
    wrongOrder: "orders getting mixed up",
    menuChange: "the menu being hard to change",
    kitchenSlow: "orders reaching the kitchen slowly",
  };

  const reason: L = {
    mm: `${tableLabel(a.tableCount)} Table ရှိပြီး ${
      problemTextMm[a.mainProblem ?? "waiting"] ?? "အခက်အခဲရှိနေတာ"
    }ဆိုတော့ ဒီ setup နဲ့ အရင်စတာ အဆင်ပြေမယ်လို့ အကြံပြုပါတယ်။`,
    en: `With ${tableLabel(a.tableCount)} tables and ${
      problemTextEn[a.mainProblem ?? "waiting"] ?? "some challenges"
    }, I'd recommend starting with this setup.`,
  };

  return {
    packageId,
    headline: { mm: "Recommended for Your Restaurant", en: "Recommended for Your Restaurant" },
    reason,
    why: {
      mm: "သင်ပြောပြတဲ့ ဆိုင်အရွယ်အစား၊ အခု order တင်ပုံနဲ့ အခက်အခဲကို ကြည့်ပြီး မလိုအပ်တာတွေ ဖယ်ထားပါတယ်။ လိုအပ်တာလေးတွေကိုပဲ ရွေးပေးထားတာပါ။",
      en: "Based on your restaurant's size, how customers currently order, and the challenges you shared, I've left out anything unnecessary and picked only what you actually need.",
    },
    benefits: [
      {
        mm: "Customer က QR scan ပြီး ကိုယ်တိုင် order တင်နိုင်မယ်",
        en: "Customers can scan a QR code and order themselves",
      },
      {
        mm: "Menu ကို ပြန်မပုံနှိပ်ဘဲ update လုပ်နိုင်မယ်",
        en: "You can update the menu without reprinting it",
      },
      {
        mm: "Kitchen က order အသစ်တွေကို ရှင်းရှင်းလင်းလင်း မြင်နိုင်မယ်",
        en: "The kitchen can see new orders clearly",
      },
      {
        mm: "ဆိုင်အတွက် professional website ရမယ်",
        en: "You'll get a professional website for your restaurant",
      },
    ],
    websiteStyle,
    qrStyle,
  };
}

export const templateFor = (style: WebsiteStyle): Template =>
  style === "modern" ? "modern" : style === "luxury" ? "luxury" : "traditional";

export function ackFor(questionId: Question["id"], lang: Lang = "mm"): string {
  const ack: L = (() => {
    switch (questionId) {
      case "restaurantType":
        return { mm: "ကောင်းပါပြီ၊ မှတ်ထားလိုက်ပါပြီ။", en: "Great, noted!" };
      case "tableCount":
        return { mm: "ဟုတ်ကဲ့၊ နားလည်ပါပြီ။", en: "Got it, understood." };
      case "orderingMethod":
        return {
          mm: "ကျေးဇူးတင်ပါတယ်။ ဒါဆိုရင် ဘာလုပ်ရင် ပိုလွယ်မလဲ တွေးကြည့်ရအောင်။",
          en: "Thanks! Let's think about what could make this easier.",
        };
      case "mainProblem":
        return {
          mm: "အဲဒါက ဆိုင်အများစုမှာ ဖြစ်တတ်ပါတယ်။ ဖြေရှင်းလို့ရပါတယ်။",
          en: "That's common for many restaurants. It's fixable.",
        };
      default:
        return { mm: "ကျေးဇူးတင်ပါတယ်။", en: "Thank you." };
    }
  })();
  return pick(lang, ack);
}
