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
    mm: "မင်္ဂလာပါ 👋\n\nမြန်ဆန်က သင့်ဆိုင်အတွက် လိုအပ်တဲ့ Digital System တွေကို ရွေးပေးပြီး စတင်အသုံးပြုနိုင်အောင် ကူညီပေးပါတယ်။\n\nဥပမာ —\n• ဆိုင် Website & Digital Menu\n• QR Ordering\n• POS / Order Management\n• Kitchen Order Screen\n• Menu Management\n• Staff Training & Support\n\nဘာ System လိုမလဲ မသိလည်းရပါတယ်။ မေးခွန်းနည်းနည်း ဖြေလိုက်ရင် သင့်ဆိုင်အတွက် လိုအပ်တာကို အကြံပြုပေးပါမယ်။",
    en: "Welcome 👋\n\nမြန်ဆန် helps restaurants choose and set up the digital tools they actually need.\n\nWe can help with:\n• Restaurant Website & Digital Menu\n• QR Ordering\n• POS / Order Management\n• Kitchen Order Screen\n• Menu Management\n• Staff Training & Support\n\nYou don't need to know which system to choose. Answer a few simple questions and we'll recommend a setup for your restaurant.",
  },
  "consult.viewPackages": { mm: "Package တွေကြည့်မယ်", en: "View Packages" },
  "consult.hidePackages": { mm: "မြန်ဆန်က အကြံပြုပေးမယ်", en: "Let မြန်ဆန် Recommend" },
  "consult.recommendSystems": { mm: "ဒါကြောင့် အကြံပြုတာတွေ —", en: "So we recommend:" },
  "consult.recPackage": { mm: "သင့်ဆိုင်အတွက် {name} ကို အကြံပြုပါတယ်။", en: "{name} is recommended for your restaurant." },
  "consult.thinking": {
    mm: "မြန်ဆန် is thinking...",
    en: "မြန်ဆန် is thinking...",
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
    en: "Noted! The မြန်ဆန် team will follow up on this.",
  },
} satisfies Record<string, L>;
