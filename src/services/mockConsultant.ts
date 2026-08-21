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

/* ------------------------------------------------------------------ */
/* Free-text understanding                                             */
/* ------------------------------------------------------------------ */

const MM_DIGITS = "၀၁၂၃၄၅၆၇၈၉";

/** Lowercase, strip punctuation, convert Myanmar digits to ASCII. */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[၀-၉]/g, (d) => String(MM_DIGITS.indexOf(d)))
    .replace(/[.,!?;:"'`~()\[\]{}/\\|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Rule = { value: string; keys: string[] };

const RULES: Record<Question["id"], Rule[]> = {
  restaurantType: [
    { value: "hotpot", keys: ["hotpot", "hot pot", "bbq", "b b q", "barbecue", "grill", "ဟော့ပေါ့", "ဘာဘီကျူး", "အကင်"] },
    { value: "cafe", keys: ["cafe", "café", "coffee", "tea shop", "bakery", "ကော်ဖီ", "လက်ဖက်ရည်", "ကိတ်"] },
    { value: "myanmar", keys: ["myanmar", "burmese", "traditional", "rice shop", "rice", "curry", "မြန်မာ", "ထမင်း", "ဟင်း", "ရိုးရာ"] },
    { value: "casual", keys: ["casual", "family restaurant", "restaurant", "dining", "စားသောက်ဆိုင်", "မိသားစု"] },
    { value: "other", keys: ["other", "အခြား", "တခြား"] },
  ],
  tableCount: [
    { value: "1-10", keys: ["small", "နည်းနည်း", "သေးသေး"] },
    { value: "40+", keys: ["many", "big", "large", "အများကြီး", "ကြီး"] },
  ],
  orderingMethod: [
    { value: "waiter", keys: ["waiter", "waitress", "staff", "server", "call", "ဝန်ထမ်း", "စားပွဲထိုး", "ခေါ်"] },
    { value: "paper", keys: ["paper", "ticket", "note", "pen", "write", "စာရွက်", "ရေး", "ဘောပင်"] },
    { value: "pos", keys: ["pos", "tablet", "phone", "app", "digital", "system", "machine", "ဖုန်း", "တက်ဘလက်", "စက်"] },
    { value: "other", keys: ["other", "အခြား", "တခြား"] },
  ],
  mainProblem: [
    { value: "waiting", keys: ["wait", "waiting", "slow service", "queue", "စောင့်", "ကြာ"] },
    { value: "wrongOrder", keys: ["wrong", "mistake", "mixed", "mix up", "error", "မှား", "လွဲ"] },
    { value: "menuChange", keys: ["menu", "price", "update", "change", "print", "မီနူး", "ဈေးနှုန်း", "ပြောင်း", "ပုံနှိပ်"] },
    { value: "kitchenSlow", keys: ["kitchen", "chef", "cook", "late", "delay", "မီးဖိုချောင်", "နောက်ကျ", "နှေး"] },
  ],
  mainGoal: [
    { value: "fastOrder", keys: ["fast", "faster", "quick", "speed", "မြန်"] },
    { value: "staffEase", keys: ["staff", "worker", "easier for staff", "ဝန်ထမ်း", "အလုပ်လွယ်"] },
    { value: "website", keys: ["website", "web site", "online", "page", "ဝဘ်ဆိုက်", "website"] },
    { value: "menuUpdate", keys: ["menu", "update", "မီနူး", "ပြောင်း"] },
    { value: "letMyansan", keys: ["recommend", "you decide", "မသိ", "အကြံပြု", "မြန်ဆန်"] },
  ],
};

const bucketForTables = (n: number): string =>
  n <= 10 ? "1-10" : n <= 20 ? "11-20" : n <= 40 ? "21-40" : "40+";

export type Interpretation =
  | { kind: "match"; value: string; label: L; raw: string }
  | { kind: "unclear"; message: L };

/* ---------------- Free-text restaurant types (open list) ---------------- */

type Cuisine = { keys: string[]; en: string; mm: string };

/** Cuisines the owner may type. These are NOT reduced to the quick-reply buttons. */
const CUISINES: Cuisine[] = [
  { keys: ["chinese", "china", "တရုတ်"], en: "Chinese", mm: "တရုတ်" },
  { keys: ["korean", "korea", "ကိုရီးယား"], en: "Korean", mm: "ကိုရီးယား" },
  { keys: ["japanese", "japan", "ဂျပန်"], en: "Japanese", mm: "ဂျပန်" },
  { keys: ["thai", "thailand", "ထိုင်း"], en: "Thai", mm: "ထိုင်း" },
  { keys: ["indian", "india", "အိန္ဒိယ"], en: "Indian", mm: "အိန္ဒိယ" },
  { keys: ["italian", "pizza", "pasta", "အီတလီ"], en: "Italian", mm: "အီတလီ" },
  { keys: ["vietnamese", "vietnam", "ဗီယက်နမ်"], en: "Vietnamese", mm: "ဗီယက်နမ်" },
  { keys: ["malay", "malaysian", "မလေး"], en: "Malaysian", mm: "မလေးရှား" },
  { keys: ["shan", "ရှမ်း"], en: "Shan", mm: "ရှမ်း" },
  { keys: ["rakhine", "ရခိုင်"], en: "Rakhine", mm: "ရခိုင်" },
  { keys: ["western", "american", "burger", "steak", "အနောက်တိုင်း"], en: "Western", mm: "အနောက်တိုင်း" },
  { keys: ["halal", "muslim", "ဟာလာ"], en: "Halal", mm: "ဟာလာ" },
  { keys: ["seafood", "ပင်လယ်စာ"], en: "Seafood", mm: "ပင်လယ်စာ" },
  { keys: ["vegetarian", "vegan", "သက်သတ်လွတ်"], en: "Vegetarian", mm: "သက်သတ်လွတ်" },
];

type Modifier = { keys: string[]; en: (c: string) => string; mm: (c: string) => string };

const MODIFIERS: Modifier[] = [
  { keys: ["hotpot", "hot pot", "ဟော့ပေါ့"], en: (c) => `${c} Hotpot`, mm: (c) => `${c} ဟော့ပေါ့ဆိုင်` },
  { keys: ["bbq", "barbecue", "grill", "အကင်"], en: (c) => `${c} BBQ`, mm: (c) => `${c} BBQ ဆိုင်` },
  { keys: ["ramen", "ရာမန်"], en: (c) => `${c} Ramen Restaurant`, mm: (c) => `${c} ရာမန်ဆိုင်` },
  { keys: ["sushi", "ဆူရှီ"], en: (c) => `${c} / Sushi Restaurant`, mm: (c) => `${c} ဆူရှီဆိုင်` },
  { keys: ["noodle", "ခေါက်ဆွဲ"], en: (c) => `${c} Noodle Shop`, mm: (c) => `${c} ခေါက်ဆွဲဆိုင်` },
  { keys: ["curry", "ဟင်း"], en: (c) => `${c} Restaurant`, mm: (c) => `${c} စားသောက်ဆိုင်` },
  { keys: ["buffet", "ဘူဖေး"], en: (c) => `${c} Buffet Restaurant`, mm: (c) => `${c} ဘူဖေးဆိုင်` },
  { keys: ["bakery", "cake", "မုန့်", "ကိတ်"], en: (c) => `${c} Bakery`, mm: (c) => `${c} မုန့်ဆိုင်` },
];

/** Standalone shop types that are their own answer, not a cafe/casual bucket. */
const STANDALONE: { keys: string[]; en: string; mm: string }[] = [
  { keys: ["bakery", "cake shop", "မုန့်ဆိုင်", "ကိတ်မုန့်"], en: "Bakery", mm: "မုန့်/ကိတ်ဆိုင်" },
  { keys: ["tea shop", "teashop", "လက်ဖက်ရည်ဆိုင်"], en: "Tea Shop", mm: "လက်ဖက်ရည်ဆိုင်" },
  { keys: ["juice", "smoothie", "ဖျော်ရည်"], en: "Juice Bar", mm: "ဖျော်ရည်ဆိုင်" },
  { keys: ["bar", "pub", "beer station", "ဘီယာ"], en: "Bar / Beer Station", mm: "ဘီယာဆိုင်" },
  { keys: ["street food", "လမ်းဘေးဆိုင်"], en: "Street Food Shop", mm: "လမ်းဘေးအစားအစာဆိုင်" },
  { keys: ["food court", "canteen", "စားသောက်ဆောင်"], en: "Food Court / Canteen", mm: "စားသောက်ဆောင်" },
  { keys: ["fine dining"], en: "Fine Dining Restaurant", mm: "Fine Dining စားသောက်ဆိုင်" },
];

const AMBIGUOUS_RESTAURANT: L = {
  mm: "ရပါတယ်။ ဘယ်လိုအစားအစာမျိုး အဓိကရောင်းပါသလဲ?",
  en: "Sure — what kind of food do you mainly serve?",
};

const GENERIC_ONLY = /^(food|food shop|shop|restaurant|eatery|စားသောက်ဆိုင်|အစားအစာဆိုင်|ဆိုင်)$/;

/** Value prefix marking an open-ended restaurant type kept in the owner's own words. */
export const CUSTOM_TYPE_PREFIX = "custom:";

/** Display label for any restaurant-type value, including free-text ones. */
export function restaurantTypeLabel(value: string, lang: Lang, fallback?: L): string {
  if (value.startsWith(CUSTOM_TYPE_PREFIX)) return value.slice(CUSTOM_TYPE_PREFIX.length);
  return fallback ? pick(lang, fallback) : value;
}

/**
 * Understand a typed restaurant type without forcing it into a quick-reply bucket.
 * Returns null when nothing specific was recognised (rules can then try).
 */
function interpretRestaurantType(
  text: string,
): { kind: "match"; value: string; label: L } | { kind: "unclear"; message: L } | null {
  const has = (keys: string[]) => keys.some((k) => text.includes(normalizeText(k)));

  // Myanmar cuisine stays mapped to the existing quick choice.
  if (has(["myanmar", "burmese", "မြန်မာ", "ထမင်းဆိုင်"])) {
    return {
      kind: "match",
      value: "myanmar",
      label: { mm: "မြန်မာစားသောက်ဆိုင်", en: "Myanmar Restaurant" },
    };
  }

  const traditional = has(["traditional", "ရိုးရာ"]);
  const cuisine = CUISINES.find((c) => has(c.keys));

  if (cuisine) {
    const mod = MODIFIERS.find((m) => has(m.keys));
    const en = mod ? mod.en(cuisine.en) : `${cuisine.en} Restaurant`;
    const mm = mod ? mod.mm(cuisine.mm) : `${cuisine.mm}စားသောက်ဆိုင်`;
    return {
      kind: "match",
      value: `${CUSTOM_TYPE_PREFIX}${traditional ? `Traditional ${en}` : en}`,
      label: {
        mm: traditional ? `${cuisine.mm}ရိုးရာအစားအစာဆိုင်` : mm,
        en: traditional ? `Traditional ${en}` : en,
      },
    };
  }

  const standalone = STANDALONE.find((s) => has(s.keys));
  if (standalone) {
    return {
      kind: "match",
      value: `${CUSTOM_TYPE_PREFIX}${standalone.en}`,
      label: { mm: standalone.mm, en: standalone.en },
    };
  }

  if (GENERIC_ONLY.test(text)) return { kind: "unclear", message: AMBIGUOUS_RESTAURANT };

  return null;
}


const CLARIFY: Record<Question["id"], L> = {
  restaurantType: {
    mm: "နည်းနည်းမသေချာလို့ပါ။ Hotpot / BBQ ဆိုင်လား၊ Cafe လား၊ မြန်မာစားသောက်ဆိုင်လား? အောက်ကထဲက ရွေးလိုက်လည်း ရပါတယ်။",
    en: "I'm not quite sure yet — is it a Hotpot / BBQ place, a Cafe, or a Myanmar restaurant? You can also tap one of the choices below.",
  },
  tableCount: {
    mm: "Table အရေအတွက်လေး ဂဏန်းနဲ့ပြောပေးပါ (ဥပမာ ၁၈)။ ဒါမှမဟုတ် အောက်ကထဲက ရွေးပေးပါ။",
    en: "Could you tell me the number of tables (e.g. 18)? Or just tap one of the ranges below.",
  },
  orderingMethod: {
    mm: "အခု order တင်ပုံလေး နည်းနည်းရှင်းပြပေးပါ — waiter ခေါ်တာလား၊ စာရွက်နဲ့လား၊ POS သုံးတာလား?",
    en: "Could you tell me a bit more — do customers call a waiter, use paper, or do you use a phone/POS?",
  },
  mainProblem: {
    mm: "ဘယ်အပိုင်းက အခက်ဆုံးလဲ ပြောပြပေးပါ — စောင့်ရတာလား၊ order မှားတာလား၊ menu ပြောင်းရတာလား၊ kitchen နှေးတာလား?",
    en: "Which part is hardest — waiting, wrong orders, updating the menu, or slow kitchen orders?",
  },
  mainGoal: {
    mm: "ဘာကို အရင်လိုချင်လဲ ပြောပြပေးပါ — order မြန်တာလား၊ staff အလုပ်လွယ်တာလား၊ website လား?",
    en: "What would you like first — faster ordering, easier work for staff, or a website?",
  },
};

const WRONG_STAGE: L = {
  mm: "Table အရေအတွက်ကို ပြောတာလား? ဆိုင်အမျိုးအစားကို အရင်သိချင်ပါတယ် 😊",
  en: "Did you mean the number of tables? I'd like to know your restaurant type first 😊",
};

/**
 * Interpret a typed answer in the context of the CURRENT question only.
 * Returns a normalized choice value identical to the quick-reply value,
 * or a friendly clarification message when confidence is too low.
 */
export function interpretAnswer(question: Question, raw: string): Interpretation {
  const text = normalizeText(raw);
  if (!text) return { kind: "unclear", message: CLARIFY[question.id] };

  const labelFor = (value: string): L => {
    const c = question.choices.find((ch) => ch.value === value);
    return (c?.label as L) ?? { mm: value, en: value };
  };

  // Exact choice label / value match (covers quick replies routed through here).
  for (const c of question.choices) {
    const l = c.label as L;
    if (
      text === normalizeText(c.value) ||
      text === normalizeText(l.mm) ||
      text === normalizeText(l.en)
    ) {
      return { kind: "match", value: c.value, label: l, raw };
    }
  }

  // Restaurant type is an OPEN list — the owner's own words win over the buttons.
  if (question.id === "restaurantType") {
    const free = interpretRestaurantType(text);
    if (free?.kind === "match") return { ...free, raw };
    if (free?.kind === "unclear") return free;
  }

  // Numbers: only meaningful for the table-count question.

  const num = text.match(/\d+/);
  if (question.id === "tableCount") {
    if (num) {
      const value = bucketForTables(parseInt(num[0], 10));
      return { kind: "match", value, label: labelFor(value), raw };
    }
  } else if (num && text.replace(/[^a-z\u1000-\u109f]/g, "").length === 0) {
    // Bare number on a non-numeric question — ask kindly instead of storing it.
    return { kind: "unclear", message: question.id === "restaurantType" ? WRONG_STAGE : CLARIFY[question.id] };
  }

  // Keyword rules, longest keyword wins.
  let best: { value: string; len: number } | null = null;
  for (const rule of RULES[question.id]) {
    for (const k of rule.keys) {
      const key = normalizeText(k);
      if (key && text.includes(key) && (!best || key.length > best.len)) {
        best = { value: rule.value, len: key.length };
      }
    }
  }
  if (best) return { kind: "match", value: best.value, label: labelFor(best.value), raw };

  return { kind: "unclear", message: CLARIFY[question.id] };
}

/** Warm, human acknowledgement of a understood typed answer. */
export function typedAck(question: Question, value: string, lang: Lang): string {
  const label = pick(lang, (question.choices.find((c) => c.value === value)?.label ?? value) as L | string);
  const line: L =
    question.id === "restaurantType"
      ? {
          mm: `ဟုတ်ကဲ့၊ ${label} ဆိုင်ပါနော်။ မှတ်ထားလိုက်ပါပြီ။`,
          en: `Got it — you run a ${label} restaurant.`,
        }
      : question.id === "tableCount"
        ? { mm: `ဟုတ်ကဲ့၊ Table ${label} လောက်ပါနော်။`, en: `Got it — about ${label} tables.` }
        : question.id === "orderingMethod"
          ? { mm: `ဟုတ်ကဲ့၊ ${label} နဲ့ပါနော်။ နားလည်ပါပြီ။`, en: `Understood — ${label}.` }
          : question.id === "mainProblem"
            ? {
                mm: `ဟုတ်ကဲ့၊ ${label} ကို အဓိကအခက်အခဲအဖြစ် မှတ်ထားပါပြီ။ ဖြေရှင်းလို့ရပါတယ်။`,
                en: `Noted — ${label}. That's fixable.`,
              }
            : { mm: `ဟုတ်ကဲ့၊ ${label} ကို ဦးစားပေးပါမယ်။`, en: `Noted — ${label} first.` };
  return pick(lang, line);
}
