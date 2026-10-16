import type { L } from "../types";

/** Strings for the consult screens. Keys are prefixed with "consult.". */
export const consult = {
  "consult.headerSubtitle": {
    mm: "Free Restaurant Consultation",
    en: "Free Restaurant Consultation",
  },
  "consult.headerStatus": {
    mm: "သင့်ဆိုင်အကြောင်း သိအောင် မေးနေပါတယ်",
    en: "Asking a few questions about your restaurant",
  },
  "consult.restoring": {
    mm: "သင့် consultation ကို ပြန်ဖွင့်နေပါတယ်...",
    en: "Restoring your consultation...",
  },
  "consult.welcome": {
    mm: "မင်္ဂလာပါ 👋\n\nPOS, Kitchen, Website ကနေ Restaurant Health, Growth Coaching နဲ့ Customer Feedback အထိ မြန်ဆန်က ကူညီပေးနိုင်ပါတယ်။\n\nမေးခွန်း 4 ခုလောက်ဖြေပြီး သင့်ဆိုင်အတွက် သင့်တော်တာကို ရွေးပေးပါမယ်။",
    en: "Welcome 👋\n\nMyanSan can help with everything from POS, Kitchen and Website setup to Restaurant Health, Growth Coaching and Customer Feedback.\n\nAnswer 4 quick questions and we'll recommend the right setup.",
  },
  "consult.viewPackages": { mm: "Package တွေကြည့်မယ်", en: "View Packages" },
  "consult.hidePackages": { mm: "မြန်ဆန်က အကြံပြုပေးမယ်", en: "Let MyanSan Recommend" },
  "consult.recommendSystems": { mm: "ဒါကြောင့် အကြံပြုတာတွေ —", en: "So we recommend:" },
  "consult.recPackage": { mm: "သင့်ဆိုင်အတွက် {name} ကို အကြံပြုပါတယ်။", en: "{name} is recommended for your restaurant." },
  "consult.thinking": {
    mm: "မြန်ဆန် is thinking...",
    en: "MyanSan is thinking...",
  },
  "consult.recIntro": {
    mm: "အခု သင့်ဆိုင်အခြေအနေကို နားလည်ပါပြီ။",
    en: "I now understand your restaurant's situation.",
  },
  "consult.takeSetup": {
    mm: "ဒီ Setup ကိုယူမယ်",
    en: "Take this setup",
  },
  "consult.customize": {
    mm: "Customize",
    en: "Customize",
  },
  "consult.comparePlans": {
    mm: "Compare Plans",
    en: "Compare Plans",
  },
  "consult.doneSelecting": { mm: "ရွေးပြီးပါပြီ", en: "Done" },
  "consult.editPrevious": {
    mm: "အရင်မေးခွန်းကို ပြင်မယ်",
    en: "Edit previous question",
  },
  "consult.fallbackWithQuestion": {
    mm: "ကျေးဇူးတင်ပါတယ်။ ပိုမြန်အောင် အပေါ်က ရွေးချယ်စရာလေးတွေထဲက တစ်ခုကို နှိပ်ပေးပါ။",
    en: "Thanks! To keep things quick, please tap one of the choices above.",
  },
  "consult.fallbackNoQuestion": {
    mm: "မှတ်ထားပါတယ်။ မြန်ဆန် team က ဒီအချက်ကို ဆက်ကြည့်ပေးပါမယ်။",
    en: "Noted! The MyanSan team will follow up on this.",
  },
} satisfies Record<string, L>;
