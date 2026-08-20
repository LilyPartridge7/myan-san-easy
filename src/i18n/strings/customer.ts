import type { L } from "../types";

/** Strings for the customer screens. Keys are prefixed with "customer.". */
export const customer = {
  "customer.table": {
    mm: "TABLE {table}",
    en: "TABLE {table}",
  },
  "customer.add": { mm: "ထည့်မယ်", en: "Add" },
  "customer.soldOut": { mm: "SOLD OUT", en: "SOLD OUT" },
  "customer.decrease": { mm: "လျှော့မယ်", en: "Decrease" },
  "customer.increase": { mm: "တိုးမယ်", en: "Increase" },
  "customer.itemsAndTotal": {
    mm: "{count} ခု · {total}",
    en: "{count} Items · {total}",
  },
  "customer.viewOrder": { mm: "အော်ဒါကြည့်မယ်", en: "View Order" },
  "customer.orderNumber": { mm: "Order #{id}", en: "Order #{id}" },
  "customer.received": { mm: "✓ လက်ခံရရှိပါပြီ", en: "✓ Received" },
  "customer.preparing": { mm: "● ပြင်ဆင်နေပါသည်", en: "● Preparing" },
  "customer.ready": { mm: "○ အသင့်ဖြစ်ပါပြီ", en: "○ Ready" },
  "customer.newOrder": { mm: "အသစ် order တင်မယ်", en: "Place new order" },
  "customer.ownerView": { mm: "Owner view", en: "Owner view" },
  "customer.yourOrderAtTable": {
    mm: "သင့်အော်ဒါ · စားပွဲ {table}",
    en: "Your Order · Table {table}",
  },
  "customer.notesPlaceholder": {
    mm: "မှာကြားချက် (ဥပမာ — အစပ် နည်းနည်း)",
    en: "Notes (e.g. — a little less spicy)",
  },
  "customer.total": { mm: "စုစုပေါင်း", en: "Total" },
  "customer.placeOrder": { mm: "အော်ဒါတင်မည်", en: "Place Order" },
} satisfies Record<string, L>;
