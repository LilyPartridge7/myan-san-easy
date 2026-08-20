import type { L } from "../types";

/** Strings used by the header, navigation and shared UI chrome. */
export const shared = {
  brand: { mm: "မြန်ဆန်", en: "မြန်ဆန်" },
  back: { mm: "နောက်သို့", en: "Back" },
  home: { mm: "ပင်မစာမျက်နှာ", en: "Home" },
  exit: { mm: "ထွက်မယ်", en: "Exit" },
  resetDemo: { mm: "Demo ပြန်စမယ်", en: "Reset Demo" },
  continue: { mm: "ဆက်လုပ်မယ်", en: "Continue" },
  loading: { mm: "ခဏစောင့်ပါ...", en: "Loading..." },
  starting: { mm: "စတင်နေပါတယ်...", en: "Starting..." },
  preparing: { mm: "ပြင်ဆင်နေပါတယ်...", en: "Preparing..." },
  language: { mm: "ဘာသာစကား", en: "Language" },
  ownerHome: { mm: "Owner Home", en: "Owner Home" },
} satisfies Record<string, L>;
