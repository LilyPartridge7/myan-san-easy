import type { L } from "@/i18n/types";

export type PackageId = "start" | "growth" | "partner";

export type ServiceKey =
  | "qrOrdering"
  | "phoneMenu"
  | "website"
  | "kitchenScreen"
  | "customQr"
  | "staffTraining"
  | "qrStand"
  | "menuSetup"
  | "priorityHelp";

export const SERVICE_LABELS: Record<ServiceKey, { group: L; label: L }> = {
  qrOrdering: {
    group: { mm: "CUSTOMER", en: "CUSTOMER" },
    label: { mm: "Customer က QR scan ပြီး order တင်နိုင်မယ်", en: "Customers can scan a QR code to place orders" },
  },
  phoneMenu: {
    group: { mm: "CUSTOMER", en: "CUSTOMER" },
    label: { mm: "ဖုန်းထဲမှာ menu ကြည့်နိုင်မယ်", en: "Customers can view the menu on their phone" },
  },
  website: {
    group: { mm: "YOUR RESTAURANT", en: "YOUR RESTAURANT" },
    label: { mm: "ဆိုင်အတွက် professional website", en: "A professional website for your restaurant" },
  },
  kitchenScreen: {
    group: { mm: "YOUR RESTAURANT", en: "YOUR RESTAURANT" },
    label: { mm: "Kitchen မှာ order မြင်ရမယ့် screen", en: "A screen for the kitchen to see orders" },
  },
  customQr: {
    group: { mm: "YOUR RESTAURANT", en: "YOUR RESTAURANT" },
    label: { mm: "ဆိုင်နဲ့လိုက်တဲ့ QR ဒီဇိုင်း", en: "QR design matching your restaurant" },
  },
  staffTraining: {
    group: { mm: "HELP FROM မြန်ဆန်", en: "HELP FROM မြန်ဆန်" },
    label: { mm: "Staff ကို အသုံးပြုနည်း သင်ပေးမယ်", en: "We train your staff on how to use it" },
  },
  qrStand: {
    group: { mm: "HELP FROM မြန်ဆန်", en: "HELP FROM မြန်ဆန်" },
    label: { mm: "QR stand ပြင်ဆင်ပေးမယ်", en: "We prepare your QR stands" },
  },
  menuSetup: {
    group: { mm: "HELP FROM မြန်ဆန်", en: "HELP FROM မြန်ဆန်" },
    label: { mm: "Menu ကို digital ပြောင်းပေးမယ်", en: "We digitalize your menu" },
  },
  priorityHelp: {
    group: { mm: "HELP FROM မြန်ဆန်", en: "HELP FROM မြန်ဆန်" },
    label: { mm: "အမြန်ဆုံး အကူအညီ (Priority)", en: "Fastest priority support" },
  },
};

export const PACKAGES: {
  id: PackageId;
  name: L;
  tagline: L;
  benefits: L[];
  services: ServiceKey[];
}[] = [
  {
    id: "start",
    name: { mm: "မြန်ဆန် START", en: "မြန်ဆန် START" },
    tagline: { mm: "လွယ်လွယ်ကူကူ စတင်ချင်တဲ့ ဆိုင်တွေအတွက်", en: "For restaurants that want a simple start" },
    benefits: [
      { mm: "Customer က ဖုန်းနဲ့ menu ကြည့်နိုင်မယ်", en: "Customers can view the menu on their phone" },
      { mm: "Table QR နဲ့ order တင်နိုင်မယ်", en: "Order via table QR code" },
      { mm: "ရိုးရှင်းတဲ့ ဆိုင် website", en: "A simple restaurant website" },
      { mm: "Table QR ပြင်ဆင်ပေးမယ်", en: "We prepare your table QR codes" },
    ],
    services: ["qrOrdering", "phoneMenu", "website"],
  },
  {
    id: "growth",
    name: { mm: "မြန်ဆန် GROWTH", en: "မြန်ဆန် GROWTH" },
    tagline: { mm: "customer များတဲ့ ဆိုင်တွေအတွက်", en: "For restaurants with more customers" },
    benefits: [
      { mm: "START ထဲက အားလုံး ပါဝင်တယ်", en: "Everything in START" },
      { mm: "ဆိုင်နဲ့လိုက်အောင် ပြင်ဆင်ထားတဲ့ website", en: "A website customized for your restaurant" },
      { mm: "Kitchen order screen", en: "Kitchen order screen" },
      { mm: "ဆိုင်နဲ့လိုက်တဲ့ QR ဒီဇိုင်း", en: "QR design matching your restaurant" },
      { mm: "Staff ကို အခြေခံ သင်တန်း", en: "Basic staff training" },
    ],
    services: ["qrOrdering", "phoneMenu", "website", "kitchenScreen", "customQr", "staffTraining"],
  },
  {
    id: "partner",
    name: { mm: "မြန်ဆန် PARTNER", en: "မြန်ဆန် PARTNER" },
    tagline: {
      mm: "မြန်ဆန် team ရဲ့ အကူအညီ ပိုလိုချင်တဲ့ ဆိုင်ရှင်တွေအတွက်",
      en: "For owners who want more help from the မြန်ဆန် team",
    },
    benefits: [
      { mm: "GROWTH ထဲက အားလုံး ပါဝင်တယ်", en: "Everything in GROWTH" },
      { mm: "Menu setup ကူညီပေးမယ်", en: "We help set up your menu" },
      { mm: "QR stand ပြင်ဆင်ပေးမယ်", en: "We prepare your QR stands" },
      { mm: "Priority အကူအညီ", en: "Priority support" },
      { mm: "နောင်တစ်ချိန် POS အတွက် အကြံပေးမယ်", en: "Future advice on POS systems" },
    ],
    services: [
      "qrOrdering",
      "phoneMenu",
      "website",
      "kitchenScreen",
      "customQr",
      "staffTraining",
      "qrStand",
      "menuSetup",
      "priorityHelp",
    ],
  },
];

export const getPackage = (id: PackageId) => PACKAGES.find((p) => p.id === id)!;
