import type { PackageId } from "@/data/packages";
import type { QRStyle, Template, WebsiteStyle } from "@/state/setupStore";

export type Choice = { value: string; label: string };

export type Question = {
  id: "restaurantType" | "tableCount" | "orderingMethod" | "mainProblem" | "mainGoal";
  text: string;
  choices: Choice[];
};

export const QUESTIONS: Question[] = [
  {
    id: "restaurantType",
    text: "ဘယ်လိုဆိုင်မျိုး ဖွင့်ထားပါသလဲ?",
    choices: [
      { value: "hotpot", label: "Hotpot / BBQ" },
      { value: "cafe", label: "Cafe" },
      { value: "myanmar", label: "မြန်မာစားသောက်ဆိုင်" },
      { value: "casual", label: "Casual Dining" },
      { value: "other", label: "အခြား" },
    ],
  },
  {
    id: "tableCount",
    text: "ဆိုင်မှာ Table ဘယ်လောက်လောက်ရှိပါသလဲ?",
    choices: [
      { value: "1-10", label: "1–10" },
      { value: "11-20", label: "11–20" },
      { value: "21-40", label: "21–40" },
      { value: "40+", label: "40+" },
    ],
  },
  {
    id: "orderingMethod",
    text: "Customer တွေ အခု order ဘယ်လိုတင်ကြပါသလဲ?",
    choices: [
      { value: "waiter", label: "Waiter ကိုခေါ်တယ်" },
      { value: "paper", label: "စာရွက်နဲ့ order ရေးတယ်" },
      { value: "pos", label: "ဖုန်း/POS သုံးထားတယ်" },
      { value: "other", label: "အခြား" },
    ],
  },
  {
    id: "mainProblem",
    text: "ဆိုင်မှာ အခက်ဆုံးက ဘာဖြစ်နေပါသလဲ?",
    choices: [
      { value: "waiting", label: "Customer က waiter စောင့်ရတာ" },
      { value: "wrongOrder", label: "Order မှားတာ" },
      { value: "menuChange", label: "Menu ပြောင်းရတာခက်တာ" },
      { value: "kitchenSlow", label: "Kitchen ဆီ order ရောက်တာနှေးတာ" },
    ],
  },
  {
    id: "mainGoal",
    text: "တစ်ခုခုပိုလွယ်သွားမယ်ဆိုရင် ဘာကိုအရင်လိုချင်ပါသလဲ?",
    choices: [
      { value: "fastOrder", label: "Customer order မြန်စေချင်တယ်" },
      { value: "staffEase", label: "Staff အလုပ်လွယ်စေချင်တယ်" },
      { value: "website", label: "ဆိုင် website လိုချင်တယ်" },
      { value: "menuUpdate", label: "Menu update ပိုလွယ်ချင်တယ်" },
      { value: "letMyansan", label: "မြန်ဆန်က အကြံပြုပေးပါ" },
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
  headline: string;
  reason: string;
  why: string;
  benefits: string[];
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

  const problemText: Record<string, string> = {
    waiting: "customer တွေ waiter စောင့်နေရတာ",
    wrongOrder: "order တွေ မှားတတ်တာ",
    menuChange: "menu ပြောင်းရတာ ခက်နေတာ",
    kitchenSlow: "kitchen ဆီ order ရောက်တာ နှေးနေတာ",
  };

  const reason = `${tableLabel(a.tableCount)} Table ရှိပြီး ${
    problemText[a.mainProblem ?? "waiting"] ?? "အခက်အခဲရှိနေတာ"
  }ဆိုတော့ ဒီ setup နဲ့ အရင်စတာ အဆင်ပြေမယ်လို့ အကြံပြုပါတယ်။`;

  return {
    packageId,
    headline: "Recommended for Your Restaurant",
    reason,
    why: "သင်ပြောပြတဲ့ ဆိုင်အရွယ်အစား၊ အခု order တင်ပုံနဲ့ အခက်အခဲကို ကြည့်ပြီး မလိုအပ်တာတွေ ဖယ်ထားပါတယ်။ လိုအပ်တာလေးတွေကိုပဲ ရွေးပေးထားတာပါ။",
    benefits: [
      "Customer က QR scan ပြီး ကိုယ်တိုင် order တင်နိုင်မယ်",
      "Menu ကို ပြန်မပုံနှိပ်ဘဲ update လုပ်နိုင်မယ်",
      "Kitchen က order အသစ်တွေကို ရှင်းရှင်းလင်းလင်း မြင်နိုင်မယ်",
      "ဆိုင်အတွက် professional website ရမယ်",
    ],
    websiteStyle,
    qrStyle,
  };
}

export const templateFor = (style: WebsiteStyle): Template =>
  style === "modern" ? "modern" : style === "luxury" ? "luxury" : "traditional";

export function ackFor(questionId: Question["id"]): string {
  switch (questionId) {
    case "restaurantType":
      return "ကောင်းပါပြီ၊ မှတ်ထားလိုက်ပါပြီ။";
    case "tableCount":
      return "ဟုတ်ကဲ့၊ နားလည်ပါပြီ။";
    case "orderingMethod":
      return "ကျေးဇူးတင်ပါတယ်။ ဒါဆိုရင် ဘာလုပ်ရင် ပိုလွယ်မလဲ တွေးကြည့်ရအောင်။";
    case "mainProblem":
      return "အဲဒါက ဆိုင်အများစုမှာ ဖြစ်တတ်ပါတယ်။ ဖြေရှင်းလို့ရပါတယ်။";
    default:
      return "ကျေးဇူးတင်ပါတယ်။";
  }
}