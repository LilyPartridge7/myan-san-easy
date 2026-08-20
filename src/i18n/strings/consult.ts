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
    mm: "မင်္ဂလာပါ။ မြန်ဆန်ပါ။ သင့်ဆိုင်အတွက် ဘာလိုအပ်လဲ သိရအောင် မေးခွန်းလေး ၅ ခုလောက် မေးပါရစေ။ မသေချာသေးလည်း ရပါတယ်။",
    en: "Hello 👋 I'm မြန်ဆန်. I'll ask a few simple questions so I can understand what would work best for your restaurant.",
  },
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
