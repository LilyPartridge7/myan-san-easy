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

export const SERVICE_LABELS: Record<ServiceKey, { group: string; label: string }> = {
  qrOrdering: { group: "CUSTOMER", label: "Customer က QR scan ပြီး order တင်နိုင်မယ်" },
  phoneMenu: { group: "CUSTOMER", label: "ဖုန်းထဲမှာ menu ကြည့်နိုင်မယ်" },
  website: { group: "YOUR RESTAURANT", label: "ဆိုင်အတွက် professional website" },
  kitchenScreen: { group: "YOUR RESTAURANT", label: "Kitchen မှာ order မြင်ရမယ့် screen" },
  customQr: { group: "YOUR RESTAURANT", label: "ဆိုင်နဲ့လိုက်တဲ့ QR ဒီဇိုင်း" },
  staffTraining: { group: "HELP FROM မြန်ဆန်", label: "Staff ကို အသုံးပြုနည်း သင်ပေးမယ်" },
  qrStand: { group: "HELP FROM မြန်ဆန်", label: "QR stand ပြင်ဆင်ပေးမယ်" },
  menuSetup: { group: "HELP FROM မြန်ဆန်", label: "Menu ကို digital ပြောင်းပေးမယ်" },
  priorityHelp: { group: "HELP FROM မြန်ဆန်", label: "အမြန်ဆုံး အကူအညီ (Priority)" },
};

export const PACKAGES: {
  id: PackageId;
  name: string;
  tagline: string;
  benefits: string[];
  services: ServiceKey[];
}[] = [
  {
    id: "start",
    name: "မြန်ဆန် START",
    tagline: "လွယ်လွယ်ကူကူ စတင်ချင်တဲ့ ဆိုင်တွေအတွက်",
    benefits: [
      "Customer က ဖုန်းနဲ့ menu ကြည့်နိုင်မယ်",
      "Table QR နဲ့ order တင်နိုင်မယ်",
      "ရိုးရှင်းတဲ့ ဆိုင် website",
      "Table QR ပြင်ဆင်ပေးမယ်",
    ],
    services: ["qrOrdering", "phoneMenu", "website"],
  },
  {
    id: "growth",
    name: "မြန်ဆန် GROWTH",
    tagline: "customer များတဲ့ ဆိုင်တွေအတွက်",
    benefits: [
      "START ထဲက အားလုံး ပါဝင်တယ်",
      "ဆိုင်နဲ့လိုက်အောင် ပြင်ဆင်ထားတဲ့ website",
      "Kitchen order screen",
      "ဆိုင်နဲ့လိုက်တဲ့ QR ဒီဇိုင်း",
      "Staff ကို အခြေခံ သင်တန်း",
    ],
    services: ["qrOrdering", "phoneMenu", "website", "kitchenScreen", "customQr", "staffTraining"],
  },
  {
    id: "partner",
    name: "မြန်ဆန် PARTNER",
    tagline: "မြန်ဆန် team ရဲ့ အကူအညီ ပိုလိုချင်တဲ့ ဆိုင်ရှင်တွေအတွက်",
    benefits: [
      "GROWTH ထဲက အားလုံး ပါဝင်တယ်",
      "Menu setup ကူညီပေးမယ်",
      "QR stand ပြင်ဆင်ပေးမယ်",
      "Priority အကူအညီ",
      "နောင်တစ်ချိန် POS အတွက် အကြံပေးမယ်",
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