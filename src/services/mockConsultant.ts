import type { PackageId } from "@/data/packages";
import type { QRStyle, Template, WebsiteStyle } from "@/state/setupStore";
import type { L, Lang } from "@/i18n/types";
import { pick } from "@/i18n/types";

/** keys = words an owner might type for this choice (EN, MM, mixed). */
export type Choice = { value: string; label: L; keys?: string[] };

export type QuestionId =
  | "restaurantType"
  | "tableCount"
  | "currentTools"
  | "mainProblem"
  | "followUp"
  | "mainGoal";

export type Question = {
  id: QuestionId;
  text: L;
  choices: Choice[];
  multi?: boolean;
};

const c = (value: string, en: string, mm: string, keys: string[] = []): Choice => ({
  value,
  label: { en, mm },
  keys,
});

const Q_TYPE: Question = {
  id: "restaurantType",
  text: { mm: "ဘယ်လိုစားသောက်ဆိုင်မျိုး ဖွင့်ထားပါသလဲ?", en: "What kind of restaurant do you run?" },
  choices: [
    c("hotpot", "Hotpot / BBQ", "Hotpot / BBQ"),
    c("cafe", "Cafe", "Cafe"),
    c("myanmar", "Myanmar Restaurant", "မြန်မာစားသောက်ဆိုင်"),
    c("chinese", "Chinese Restaurant", "တရုတ်စားသောက်ဆိုင်"),
    c("casual", "Casual Dining", "Casual Dining"),
    c("other", "Other", "အခြား"),
  ],
};

const Q_TABLES: Question = {
  id: "tableCount",
  text: {
    mm: "ဆိုင်မှာ Table ဘယ်လောက်လောက်၊ Branch ဘယ်နှဆိုင်လောက် စီမံနေရပါသလဲ?",
    en: "About how many tables or branches do you manage?",
  },
  choices: [
    c("1-10", "1–10 tables", "Table 1–10"),
    c("11-20", "11–20 tables", "Table 11–20"),
    c("21-40", "21–40 tables", "Table 21–40"),
    c("40+", "40+ tables", "Table 40+"),
    c("multiBranch", "2+ branches", "Branch 2 ခုနှင့်အထက်", ["branches", "branch", "ဆိုင်ခွဲ", "ဘရန့်"]),
  ],
};

const Q_TOOLS: Question = {
  id: "currentTools",
  multi: true,
  text: {
    mm: "အခုဆိုင်မှာ အောက်ကအရာတွေထဲက ဘာတွေသုံးနေပါသလဲ? (တစ်ခုထက်ပိုရွေးလို့ရပါတယ်)",
    en: "Which of these do you already use in your restaurant? (Pick all that apply)",
  },
  choices: [
    c("paperMenu", "Paper menu", "Paper Menu", ["paper", "printed menu", "စာရွက်"]),
    c("facebook", "Facebook page", "Facebook Page", ["facebook", "fb", "ဖေ့ဘုတ်"]),
    c("website", "Restaurant website", "Restaurant Website", ["website", "web site", "ဝဘ်ဆိုက်"]),
    c("qr", "QR menu / QR ordering", "QR Menu / QR Ordering", ["qr"]),
    c("pos", "POS", "POS", ["pos", "cashier system", "casher"]),
    c("kds", "Kitchen order screen", "Kitchen Order Screen", ["kitchen screen", "kds", "kitchen display"]),
    c("payment", "Digital payment", "Digital Payment", ["kbz", "wave", "pay", "payment", "ငွေလွှဲ"]),
    c("reports", "Sales reports", "Sales Report", ["report", "sales", "ရောင်းအား"]),
    c("none", "Mostly manual / None", "အများစုကို လက်နဲ့လုပ်နေတယ် / မသုံးသေးဘူး", ["none", "nothing", "manual", "no", "မသုံး", "မရှိ", "လက်နဲ့"]),
  ],
};

const Q_PROBLEM: Question = {
  id: "mainProblem",
  text: {
    mm: "ဆိုင်ကို စီမံတဲ့အခါ ဘယ်အပိုင်းက အခက်ဆုံးဖြစ်ပါသလဲ?",
    en: "Which part of running your restaurant gives you the most trouble?",
  },
  choices: [
    c("orders", "Staff cannot handle orders fast enough", "Staff တွေ Order မီအောင် မယူနိုင်ဘူး", ["order", "waiter", "busy", "အော်ဒါ"]),
    c("kitchen", "Orders are delayed or mixed up before reaching the kitchen", "Kitchen ကို Order ရောက်တာ နောက်ကျတယ် / ရှုပ်တယ်", ["kitchen", "chef", "cook", "မီးဖို"]),
    c("menu", "Updating menu items or prices takes too much work", "Menu နဲ့ ဈေးနှုန်း ပြင်ရတာ အလုပ်များတယ်", ["menu", "price", "ဈေး", "မီနူး", "ပြန်ရိုက်", "reprint"]),
    c("staff", "Training and managing staff takes too much time", "Staff သင်ပေးရတာ / စီမံရတာ အချိန်ယူတယ်", ["staff", "train", "သင်", "ဝန်ထမ်း"]),
    c("visibility", "It is hard to know what is happening when I am away", "ဆိုင်မှာ မရှိတဲ့အချိန် ဘာဖြစ်နေလဲ သိရခက်တယ်", ["away", "not there", "မရှိရင်", "မရှိတဲ့", "မသိဘူး", "ရောင်းနေလဲ"]),
    c("online", "Our restaurant does not look professional online", "Online မှာ ဆိုင်ပုံစံ Professional မဖြစ်သေးဘူး", ["online", "website", "facebook", "professional"]),
    c("systems", "We use different tools and managing them is difficult", "System အမျိုးမျိုးခွဲသုံးနေရလို့ စီမံရခက်တယ်", ["systems", "tools", "မချိတ်", "integrat", "system အမျိုးမျိုး"]),
    c("growth", "Managing more tables or branches is becoming difficult", "ဆိုင်ကြီးလာတာ / Branch များလာတာနဲ့ စီမံရခက်လာတယ်", ["branch", "grow", "expand", "ဆိုင်ခွဲ", "ကြီးလာ"]),
    c("other", "Something else", "အခြား"),
  ],
};

/** One follow-up set per main problem — rendered by the same chat UI. */
export const FOLLOW_UPS: Record<string, Question> = {
  orders: {
    id: "followUp",
    text: { mm: "ဆိုင်အလုပ်ရှုပ်တဲ့အချိန်မှာ Order ပိုင်းမှာ ဘာက အခက်ဆုံးဖြစ်ပါသလဲ?", en: "What usually causes the most trouble during busy hours?" },
    choices: [
      c("order_capture_bottleneck", "Waiters cannot take orders fast enough", "Waiter တွေ Order မီအောင် မယူနိုင်ဘူး", ["waiter", "not enough", "မလောက်", "မမီ", "fast enough"]),
      c("missed_orders", "Orders are missed", "Order ကျန်တတ်တယ်", ["missed", "forgot", "ကျန်"]),
      c("order_accuracy", "Orders are entered incorrectly", "Order မှားတတ်တယ်", ["wrong", "incorrect", "mistake", "မှား"]),
      c("staff_call_pressure", "Customers keep calling staff", "Customer တွေ Staff ကို ခဏခဏခေါ်ရတယ်", ["call", "ခေါ်"]),
      c("manual_order_work", "Too much manual work", "လက်နဲ့လုပ်ရတာများတယ်", ["manual", "paper", "လက်နဲ့"]),
    ],
  },
  kitchen: {
    id: "followUp",
    text: { mm: "Service Team နဲ့ Kitchen ကြားမှာ ဘာက အခက်ဆုံးဖြစ်ပါသလဲ?", en: "What is hardest between the service team and kitchen?" },
    choices: [
      c("kitchen_delay", "Orders reach the kitchen too slowly", "Kitchen ကို Order ရောက်တာနောက်ကျတယ်", ["slow", "late", "delay", "နောက်ကျ", "နှေး"]),
      c("kitchen_sequence_visibility", "Kitchen cannot see order sequence clearly", "Order အစဉ်ကို ရှင်းရှင်းမမြင်ရဘူး", ["sequence", "order of", "အစဉ်"]),
      c("order_status_confusion", "Staff keep asking about order status", "Order Status ကို Staff တွေခဏခဏမေးရတယ်", ["status", "ask", "မေး"]),
      c("kitchen_accuracy", "Wrong items are prepared", "အစားအသောက်မှားပြင်တတ်တယ်", ["wrong", "mistake", "မှား"]),
      c("paper_ticket_overload", "Too many paper tickets", "Paper Ticket များလွန်းတယ်", ["paper", "ticket", "စာရွက်"]),
    ],
  },
  menu: {
    id: "followUp",
    text: { mm: "Menu စီမံတဲ့အခါ ဘာက အလုပ်အများဆုံးဖြစ်ပါသလဲ?", en: "What takes the most work when managing your menu?" },
    choices: [
      c("price_updates", "Changing prices", "ဈေးနှုန်း ပြောင်းရတာ", ["price", "ဈေး"]),
      c("menu_item_updates", "Adding/removing items", "Item ထည့် / ဖြုတ်ရတာ", ["add", "remove", "item", "ထည့်", "ဖြုတ်"]),
      c("sold_out_management", "Marking sold-out items", "Sold Out ပြောင်းရတာ", ["sold out", "soldout", "ကုန်"]),
      c("menu_reprinting", "Reprinting menus", "Menu ပြန်ရိုက် / ပြန်ပုံနှိပ်ရတာ", ["print", "ရိုက်", "ပုံနှိပ်"]),
      c("menu_consistency", "Keeping different menus consistent", "နေရာစုံက Menu တွေ တူအောင်ထိန်းရတာ", ["consistent", "same", "တူအောင်"]),
    ],
  },
  staff: {
    id: "followUp",
    text: { mm: "Staff ပိုင်းမှာ ဘာက အချိန်အများဆုံးယူပါသလဲ?", en: "What takes the most time with your staff?" },
    choices: [
      c("new_staff_training", "Training new staff", "Staff အသစ်သင်ပေးရတာ", ["new", "အသစ်"]),
      c("process_training", "Explaining the order process", "Order Process ရှင်းပြရတာ", ["process", "explain", "ရှင်းပြ"]),
      c("repeated_staff_errors", "Correcting repeated mistakes", "တူညီတဲ့အမှားတွေ ပြန်ပြင်ရတာ", ["mistake", "error", "အမှား"]),
      c("multi_system_training", "Teaching different systems", "System အမျိုးမျိုးသင်ပေးရတာ", ["system", "tools"]),
      c("owner_support_burden", "Owner has to answer the same questions repeatedly", "Owner က မေးခွန်းတူတူကို ခဏခဏဖြေရတာ", ["question", "ask", "မေး"]),
    ],
  },
  visibility: {
    id: "followUp",
    text: { mm: "ဆိုင်မှာ မရှိတဲ့အချိန် ဘာကို အဓိကမြင်ချင်ပါသလဲ?", en: "When you are away from the restaurant, what do you most want to see?" },
    choices: [
      c("sales_visibility", "Today's sales", "ဒီနေ့ရောင်းအား", ["sales", "sell", "ရောင်း"]),
      c("order_visibility", "Current orders", "လက်ရှိ Order တွေ", ["order"]),
      c("busy_hour_visibility", "Busy hours", "အလုပ်ရှုပ်တဲ့အချိန်", ["busy", "hour", "ရှုပ်"]),
      c("sold_out_visibility", "Sold-out items", "Sold Out Item တွေ", ["sold out", "ကုန်"]),
      c("branch_activity_visibility", "Staff / branch activity", "Staff / Branch အခြေအနေ", ["staff", "branch", "ဆိုင်ခွဲ"]),
    ],
  },
  online: {
    id: "followUp",
    text: { mm: "Online မှာ Customer တွေကို ဘာကို အဓိကမြင်စေချင်ပါသလဲ?", en: "What do you want customers to see online?" },
    choices: [
      c("website_presence", "Professional restaurant website", "Professional Restaurant Website", ["website", "web", "ဝဘ်ဆိုက်"]),
      c("digital_menu_presence", "Digital menu", "Digital Menu", ["menu", "မီနူး"]),
      c("location_hours", "Location & opening hours", "Location & Opening Hours", ["location", "map", "hour", "တည်နေရာ"]),
      c("brand_story", "Restaurant story / brand", "ဆိုင် Brand / Story", ["brand", "story"]),
      c("promotions", "Promotions", "Promotion", ["promo", "discount", "လျှော့"]),
    ],
  },
  systems: {
    id: "followUp",
    text: { mm: "လက်ရှိ System တွေသုံးရာမှာ ဘာက အခက်ဆုံးဖြစ်ပါသလဲ?", en: "What is hardest about your current systems?" },
    choices: [
      c("fragmented_information", "Information is in different places", "Data တွေ နေရာစုံမှာရှိတယ်", ["different places", "data", "နေရာစုံ"]),
      c("tool_overload", "Staff have to learn too many tools", "Staff က Tool အများကြီးသင်ရတယ်", ["learn", "too many", "သင်"]),
      c("integration_gap", "Systems do not work together", "System တွေ အချင်းချင်းမချိတ်ဘူး", ["connect", "together", "integrat", "မချိတ်"]),
      c("vendor_management", "Owner has to manage several vendors", "Vendor အများကြီးကို Owner က လိုက်ပြောရတယ်", ["vendor", "company"]),
      c("support_gap", "Support is difficult", "Support ရဖို့ခက်တယ်", ["support", "help"]),
    ],
  },
  growth: {
    id: "followUp",
    text: { mm: "ဆိုင်ကြီးလာတာ / Branch များလာတာနဲ့ ဘာက ပိုခက်လာပါသလဲ?", en: "What becomes harder as your restaurant grows?" },
    choices: [
      c("branch_monitoring", "Checking every branch", "Branch တစ်ခုချင်း လိုက်ကြည့်ရတာ", ["check", "monitor", "လိုက်ကြည့်"]),
      c("branch_menu_consistency", "Keeping menus consistent", "Menu တူအောင်ထိန်းရတာ", ["menu"]),
      c("branch_staff_training", "Training new staff", "Staff အသစ်တွေသင်ပေးရတာ", ["staff", "train", "သင်"]),
      c("branch_sales_comparison", "Comparing sales between branches", "Branch တွေရဲ့ ရောင်းအားနှိုင်းယှဉ်ရတာ", ["sales", "compare", "ရောင်းအား", "နှိုင်း"]),
      c("branch_system_management", "Managing different systems", "System အမျိုးမျိုး စီမံရတာ", ["system"]),
    ],
  },
};

const Q_GOAL: Question = {
  id: "mainGoal",
  text: {
    mm: "ဆိုင်အလုပ်ထဲက တစ်ခုကို အရင်ဆုံး ပိုလွယ်အောင်လုပ်ပေးမယ်ဆိုရင် ဘာကိုရွေးချင်ပါသလဲ?",
    en: "If we could make one part of your restaurant easier first, what would matter most?",
  },
  choices: [
    c("saveStaffTime", "Save staff time", "Staff အချိန်သက်သာချင်တယ်", ["staff time", "save time", "အချိန်"]),
    c("reduceMistakes", "Reduce mistakes", "အမှားလျော့ချင်တယ်", ["mistake", "error", "အမှား"]),
    c("serveFaster", "Serve customers faster", "Customer ကို ပိုမြန်မြန်ဝန်ဆောင်ချင်တယ်", ["faster", "fast", "quick", "မြန်မြန်"]),
    c("smootherKitchen", "Make kitchen work smoother", "Kitchen အလုပ်ပိုချောချင်တယ်", ["kitchen"]),
    c("easierMenu", "Update menu more easily", "Menu ပြင်ရတာပိုလွယ်ချင်တယ်", ["menu"]),
    c("seeBusiness", "See the business more clearly", "ဆိုင်အခြေအနေကို ပိုရှင်းရှင်းမြင်ချင်တယ်", ["see", "report", "sales", "မြင်"]),
    c("professionalOnline", "Look more professional online", "Online မှာ ပို Professional ဖြစ်ချင်တယ်", ["online", "website", "professional"]),
    c("manageGrowth", "Manage growth more easily", "ဆိုင်ကြီးလာရင် စီမံရပိုလွယ်ချင်တယ်", ["growth", "branch", "ကြီးလာ"]),
    c("letMyansan", "Let မြန်ဆန် recommend", "မြန်ဆန်က အကြံပြုပေးပါ", ["recommend", "you decide", "မသိ", "အကြံပြု"]),
  ],
};

/** All base questions (follow-ups are picked per problem). */
export const QUESTIONS: Question[] = [Q_TYPE, Q_TABLES, Q_TOOLS, Q_PROBLEM, Q_GOAL];

/** The question sequence for the current answers — only ONE relevant follow-up is asked. */
export function questionsFor(turns: { stage: string; value: string }[]): Question[] {
  const problem = turns.find((t) => t.stage === "mainProblem")?.value;
  const follow = problem ? FOLLOW_UPS[problem] : undefined;
  return [Q_TYPE, Q_TABLES, Q_TOOLS, Q_PROBLEM, ...(follow ? [follow] : []), Q_GOAL];
}

/** Display label for a stored value (handles multi-select and free-text types). */
export function answerLabel(q: Question, value: string, lang: Lang): string {
  if (value.startsWith("custom:")) return value.slice(7);
  const parts = q.multi ? value.split(",") : [value];
  return parts
    .map((v) => {
      const ch = q.choices.find((x) => x.value === v);
      return ch ? pick(lang, ch.label) : v;
    })
    .join(", ");
}

export type Answers = {
  restaurantType: string | null;
  tableCount: string | null;
  currentTools: string | null;
  mainProblem: string | null;
  followUp: string | null;
  mainGoal: string | null;
};

export type SystemRec = { id: string; label: L; why: L };

export type Recommendation = {
  packageId: PackageId;
  headline: L;
  reason: L;
  why: L;
  note?: L;
  benefits: L[];
  websiteStyle: WebsiteStyle;
  qrStyle: QRStyle;
};

const SYS: Record<string, SystemRec> = {
  qr_ordering: { id: "qr_ordering", label: { mm: "QR Ordering", en: "QR Ordering" }, why: { mm: "Waiter တွေ လက်နဲ့ယူရတဲ့ Order လျော့သွားမယ်", en: "fewer orders your waiters have to take by hand" } },
  digital_menu: { id: "digital_menu", label: { mm: "Digital Menu", en: "Digital Menu" }, why: { mm: "Menu ကို ပြန်မရိုက်ဘဲ ချက်ချင်းပြင်နိုင်မယ်", en: "change your menu without reprinting" } },
  pos_order_management: { id: "pos_order_management", label: { mm: "POS / Order Management", en: "POS / Order Management" }, why: { mm: "Order တွေ တစ်နေရာတည်းမှာ ရှင်းရှင်းစီမံနိုင်မယ်", en: "every order tracked in one place for your team" } },
  kitchen_order_screen: { id: "kitchen_order_screen", label: { mm: "Kitchen Order Screen", en: "Kitchen Order Screen" }, why: { mm: "Kitchen က Order အသစ်ကို တန်းမြင်ပြီး ခေါ်ပြောရတာ လျော့မယ်", en: "new orders reach the kitchen clearly, less back-and-forth" } },
  menu_management: { id: "menu_management", label: { mm: "Menu Management", en: "Menu Management" }, why: { mm: "ဈေးနှုန်း၊ Item၊ Sold Out ကို မိနစ်ပိုင်းအတွင်း ပြင်နိုင်မယ်", en: "update prices, items and sold-outs in minutes" } },
  restaurant_website: { id: "restaurant_website", label: { mm: "ဆိုင် Website", en: "Restaurant Website" }, why: { mm: "Online မှာ ဆိုင်ကို Professional ဖြစ်အောင် ပြနိုင်မယ်", en: "present your business professionally online" } },
  reporting: { id: "reporting", label: { mm: "Basic Reporting / Owner Dashboard", en: "Basic Reporting / Owner Dashboard" }, why: { mm: "ဆိုင်မှာမရှိလည်း ရောင်းအားနဲ့ Order တွေကို မြင်နိုင်မယ်", en: "see sales and orders even when you are away" } },
  integration: { id: "integration", label: { mm: "Integration Planning", en: "Integration Planning" }, why: { mm: "လက်ရှိ System တွေကို ချိတ်ဆက်ပြီး တစ်နေရာတည်းက စီမံနိုင်အောင်", en: "connect the tools you already have instead of adding more" } },
  staff_training: { id: "staff_training", label: { mm: "Staff Training", en: "Staff Training" }, why: { mm: "Staff တွေ အလွယ်တကူ စသုံးနိုင်ပြီး Owner မေးခွန်းဖြေရတာ လျော့မယ်", en: "your team learns quickly, fewer questions for you" } },
  support: { id: "support", label: { mm: "Managed Support", en: "Managed Support" }, why: { mm: "System တွေကို မြန်ဆန်က ဆက်ကြည့်ပေးမယ်", en: "မြန်ဆန် looks after your systems for you" } },
};

/** Owner problem → systems that solve it. */
const PROBLEM_SYSTEMS: Record<string, string[]> = {
  orders: ["qr_ordering", "pos_order_management"],
  order_capture_bottleneck: ["qr_ordering", "pos_order_management"],
  missed_orders: ["pos_order_management", "kitchen_order_screen"],
  order_accuracy: ["pos_order_management", "kitchen_order_screen"],
  staff_call_pressure: ["qr_ordering", "digital_menu"],
  manual_order_work: ["qr_ordering", "pos_order_management"],
  kitchen: ["kitchen_order_screen", "pos_order_management"],
  kitchen_delay: ["kitchen_order_screen", "pos_order_management"],
  kitchen_sequence_visibility: ["kitchen_order_screen"],
  order_status_confusion: ["kitchen_order_screen", "pos_order_management"],
  kitchen_accuracy: ["kitchen_order_screen", "pos_order_management"],
  paper_ticket_overload: ["kitchen_order_screen", "pos_order_management"],
  menu: ["digital_menu", "menu_management"],
  price_updates: ["digital_menu", "menu_management"],
  menu_item_updates: ["digital_menu", "menu_management"],
  sold_out_management: ["menu_management", "digital_menu"],
  menu_reprinting: ["digital_menu"],
  menu_consistency: ["menu_management", "digital_menu"],
  staff: ["staff_training", "support"],
  new_staff_training: ["staff_training", "support"],
  process_training: ["staff_training", "pos_order_management"],
  repeated_staff_errors: ["staff_training", "pos_order_management"],
  multi_system_training: ["staff_training", "integration"],
  owner_support_burden: ["staff_training", "support"],
  visibility: ["reporting", "pos_order_management"],
  sales_visibility: ["reporting", "pos_order_management"],
  order_visibility: ["reporting", "pos_order_management"],
  busy_hour_visibility: ["reporting"],
  sold_out_visibility: ["menu_management", "reporting"],
  branch_activity_visibility: ["reporting", "support"],
  online: ["restaurant_website", "digital_menu"],
  website_presence: ["restaurant_website", "digital_menu"],
  digital_menu_presence: ["digital_menu", "restaurant_website"],
  location_hours: ["restaurant_website"],
  brand_story: ["restaurant_website"],
  promotions: ["restaurant_website", "menu_management"],
  systems: ["integration", "support"],
  fragmented_information: ["support", "integration"],
  tool_overload: ["integration", "staff_training"],
  integration_gap: ["integration", "kitchen_order_screen"],
  vendor_management: ["support", "integration"],
  support_gap: ["support"],
  growth: ["support", "reporting"],
  branch_monitoring: ["support", "reporting"],
  branch_menu_consistency: ["menu_management", "support"],
  branch_staff_training: ["staff_training", "support"],
  branch_sales_comparison: ["reporting", "support"],
  branch_system_management: ["integration", "support"],
};

const GOAL_SYSTEMS: Record<string, string[]> = {
  saveStaffTime: ["qr_ordering"],
  reduceMistakes: ["pos_order_management"],
  serveFaster: ["qr_ordering"],
  smootherKitchen: ["kitchen_order_screen"],
  easierMenu: ["menu_management"],
  seeBusiness: ["reporting"],
  professionalOnline: ["restaurant_website"],
  manageGrowth: ["support"],
};

/** Systems the owner already has — never recommend these again. */
const TOOL_COVERS: Record<string, string> = {
  website: "restaurant_website",
  qr: "qr_ordering",
  pos: "pos_order_management",
  kds: "kitchen_order_screen",
  reports: "reporting",
};

const START_PROBLEMS = ["menu", "online"];
const GROWTH_PROBLEMS = ["orders", "kitchen", "staff"];
const PARTNER_PROBLEMS = ["visibility", "systems", "growth"];

/** Systems first (from owner problems), then package. Ties prefer the lower package. */
export function calculateRestaurantRecommendation(a: Answers) {
  const s = { start: 0, growth: 0, partner: 0 };
  const tools = (a.currentTools ?? "").split(",").filter((t) => t && t !== "none");

  switch (a.tableCount) {
    case "1-10": s.start += 2; break;
    case "11-20": s.growth += 1; break;
    case "21-40": s.growth += 2; break;
    case "40+": s.partner += 2; s.growth += 1; break;
    case "multiBranch": s.partner += 3; break;
  }
  const p = a.mainProblem ?? "";
  if (START_PROBLEMS.includes(p)) s.start += 3;
  if (GROWTH_PROBLEMS.includes(p)) s.growth += 3;
  if (PARTNER_PROBLEMS.includes(p)) {
    s.partner += 3;
    if (p === "visibility") s.growth += 2;
  }
  if (tools.length >= 4) s.partner += 1;
  switch (a.mainGoal) {
    case "easierMenu": case "professionalOnline": s.start += 1; break;
    case "saveStaffTime": case "reduceMistakes": case "serveFaster": case "smootherKitchen": s.growth += 1; break;
    case "seeBusiness": case "manageGrowth": s.partner += 1; break;
  }

  let packageId: PackageId = "start";
  if (s.growth > s.start) packageId = "growth";
  if (s.partner > s.growth && s.partner > s.start) packageId = "partner";

  const wanted: string[] = [
    ...(PROBLEM_SYSTEMS[a.followUp ?? ""] ?? PROBLEM_SYSTEMS[p] ?? []),
    ...(GOAL_SYSTEMS[a.mainGoal ?? ""] ?? []),
  ];
  if (packageId !== "start") {
    if (wanted.includes("qr_ordering") || wanted.includes("pos_order_management")) wanted.push("kitchen_order_screen");
    wanted.push("staff_training");
  }
  if (packageId === "partner") wanted.push("support");
  if (wanted.length === 0) wanted.push("restaurant_website", "digital_menu");

  const owned = new Set(tools.map((t) => TOOL_COVERS[t]).filter(Boolean));
  const sys = new Set(wanted.filter((k) => !owned.has(k)));
  // Already has a POS but kitchen/ordering flow is the issue → connect around it.
  if (owned.has("pos_order_management") && wanted.includes("pos_order_management")) sys.add("integration");
  if (sys.size === 0) sys.add("support");

  const order = Object.keys(SYS);
  const recommendedSystems = [...sys]
    .sort((x, y) => order.indexOf(x) - order.indexOf(y))
    .map((k) => SYS[k]!);
  const alreadyHave = [...owned].filter((k) => wanted.includes(k)).map((k) => SYS[k]!);
  return { recommendedPackage: packageId, recommendedSystems, alreadyHave, scores: s };
}

const findLabel = (qs: Question[], value: string | null): L | null => {
  if (!value) return null;
  for (const q of qs) {
    const ch = q.choices.find((x) => x.value === value);
    if (ch) return ch.label;
  }
  return null;
};

const BENEFIT: Record<string, L> = {
  orders: { mm: "ဒီ Setup က လက်နဲ့ Order ယူရတာကို လျော့ပေးပြီး Team အတွက် Order Flow ကို ပိုရှင်းစေပါတယ်။", en: "This setup reduces manual order-taking and makes the order flow clearer for your team." },
  kitchen: { mm: "Kitchen က Order အသစ်တွေကို ပိုရှင်းရှင်းမြင်ပြီး ခေါ်ပြောရတာ လျော့သွားပါမယ်။", en: "New orders become clearer for the kitchen, with less communication delay." },
  menu: { mm: "Menu နဲ့ ဈေးနှုန်းကို ပြန်မရိုက်ဘဲ မိနစ်ပိုင်းအတွင်း ပြင်နိုင်ပါမယ်။", en: "You can update menu items and prices in minutes, without reprinting." },
  staff: { mm: "Staff တွေ ပိုမြန်မြန်တတ်ပြီး Owner အချိန်ပိုသက်သာပါမယ်။", en: "Your staff learn faster and you spend less time answering the same questions." },
  visibility: { mm: "ဆိုင်မှာ မရှိလည်း ဆိုင်အခြေအနေကို ရှင်းရှင်းမြင်နိုင်ပါမယ်။", en: "You can see how the business is doing even when you are away." },
  online: { mm: "Website နဲ့ Digital Menu က ဆိုင်ကို ရှာရလွယ်ပြီး Professional ဖြစ်စေပါတယ်။", en: "A restaurant website and digital menu make your business easier to find and more professional." },
  systems: { mm: "System တွေကို အသစ်ထပ်မထည့်ဘဲ ချိတ်ဆက်ပြီး မြန်ဆန်က တစ်နေရာတည်းက ကူညီပေးပါမယ်။", en: "Instead of adding more tools, မြန်ဆန် connects and looks after what you have." },
  growth: { mm: "Branch တွေကို တစ်နေရာတည်းက ကြည့်ပြီး ညီညီညာညာ စီမံနိုင်ပါမယ်။", en: "You can oversee every branch from one place and keep them consistent." },
};

export function recommend(a: Answers): Recommendation & { systems: SystemRec[] } {
  const calc = calculateRestaurantRecommendation(a);
  const packageId: PackageId = calc.recommendedPackage;

  const custom = a.restaurantType?.startsWith("custom:") ? a.restaurantType.slice(7).toLowerCase() : null;
  const websiteStyle: WebsiteStyle = custom
    ? /hotpot|bbq|fine dining|buffet/.test(custom)
      ? "luxury"
      : /bakery|tea|cafe|juice|coffee/.test(custom)
        ? "modern"
        : "warm"
    : a.restaurantType === "cafe"
      ? "modern"
      : a.restaurantType === "myanmar"
        ? "traditional"
        : a.restaurantType === "hotpot"
          ? "luxury"
          : "warm";
  const qrStyle: QRStyle =
    websiteStyle === "luxury" ? "premium" : websiteStyle === "traditional" ? "traditional" : "simple";

  const issue =
    findLabel(Object.values(FOLLOW_UPS), a.followUp) ?? findLabel([Q_PROBLEM], a.mainProblem);
  const size: L =
    a.tableCount === "multiBranch"
      ? { mm: "Branch တစ်ခုထက်ပို စီမံနေရပြီး", en: "You manage more than one branch" }
      : a.tableCount
        ? { mm: `Table ${a.tableCount.replace("-", "–")} လုံးလောက် စီမံနေရပြီး`, en: `You manage about ${a.tableCount.replace("-", "–")} tables` }
        : { mm: "", en: "You" };
  const benefit = BENEFIT[a.mainProblem ?? ""] ?? { mm: "", en: "" };
  const reason: L = issue
    ? {
        mm: `${size.mm} "${issue.mm}" ဆိုတာ အဓိကအခက်အခဲဖြစ်နေပါတယ်။ ${benefit.mm}`,
        en: `${size.en}, and your main difficulty is: ${issue.en.toLowerCase()}. ${benefit.en}`,
      }
    : { mm: `${size.mm} ဒီ Setup နဲ့ အရင်စတာ အဆင်ပြေပါမယ်။`, en: `${size.en}, so this setup is a good place to start.` };

  const note: L | undefined = calc.alreadyHave.length
    ? {
        mm: `${calc.alreadyHave.map((x) => x.label.mm).join("၊ ")} ကို သုံးပြီးသားဖြစ်လို့ အသစ်ထပ်မဝယ်ဘဲ ပတ်ဝန်းကျင်အပိုင်းတွေကို ပိုကောင်းအောင် အကြံပြုပါတယ်။`,
        en: `You already use ${calc.alreadyHave.map((x) => x.label.en).join(", ")}, so we recommend improving the parts around it instead of replacing it.`,
      }
    : undefined;

  return {
    packageId,
    systems: calc.recommendedSystems,
    headline: { mm: "Recommended for Your Restaurant", en: "Recommended for Your Restaurant" },
    reason,
    note,
    why: {
      mm: "သင့်ဆိုင်အရွယ်အစား၊ လက်ရှိသုံးနေတဲ့ Tool တွေနဲ့ အခက်ဆုံးအပိုင်းကို ကြည့်ပြီး လိုအပ်တာလေးတွေကိုပဲ ရွေးပေးထားပါတယ်။",
      en: "Based on your size, the tools you already use and where running the restaurant is hardest, I picked only what you actually need.",
    },
    benefits: calc.recommendedSystems.slice(0, 4).map((x) => x.why),
    websiteStyle,
    qrStyle,
  };
}

export const templateFor = (style: WebsiteStyle): Template =>
  style === "modern" ? "modern" : style === "luxury" ? "luxury" : "traditional";

export function ackFor(questionId: QuestionId, lang: Lang = "mm"): string {
  const ack: Record<string, L> = {
    restaurantType: { mm: "ကောင်းပါပြီ၊ မှတ်ထားလိုက်ပါပြီ။", en: "Great, noted!" },
    tableCount: { mm: "ဟုတ်ကဲ့၊ နားလည်ပါပြီ။", en: "Got it, understood." },
    currentTools: { mm: "ကျေးဇူးတင်ပါတယ်။ ရှိပြီးသားတွေကို ထပ်မအကြံပြုပါဘူး။", en: "Thanks — I won't recommend what you already have." },
    mainProblem: { mm: "အဲဒါက ဆိုင်အများစုမှာ ဖြစ်တတ်ပါတယ်။ နည်းနည်းထပ်မေးပါရစေ။", en: "That's common for many restaurants. Let me ask one more thing about it." },
    followUp: { mm: "နားလည်ပါပြီ။ ဖြေရှင်းလို့ရပါတယ်။", en: "Understood — that's fixable." },
  };
  return pick(lang, ack[questionId] ?? { mm: "ကျေးဇူးတင်ပါတယ်။", en: "Thank you." });
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

const CLARIFY: Record<QuestionId, L> = {
  restaurantType: {
    mm: "နည်းနည်းမသေချာလို့ပါ။ ဘယ်လိုအစားအစာမျိုး အဓိကရောင်းပါသလဲ? အောက်ကထဲက ရွေးလိုက်လည်း ရပါတယ်။",
    en: "I'm not quite sure yet — what kind of food do you mainly serve? You can also tap a choice below.",
  },
  tableCount: {
    mm: "Table အရေအတွက်လေး ဂဏန်းနဲ့ပြောပေးပါ (ဥပမာ ၁၈)။ Branch များရင် Branch အရေအတွက်လည်း ပြောလို့ရပါတယ်။",
    en: "Could you tell me the number of tables (e.g. 18)? If you have several branches, tell me that too.",
  },
  currentTools: {
    mm: "ဘာတွေသုံးနေလဲ ပြောပြပေးပါ — Paper Menu၊ Facebook Page၊ POS စသဖြင့်။ အောက်က ရွေးလည်းရပါတယ်။",
    en: "Which tools do you use — paper menu, Facebook page, POS…? You can also tap them below.",
  },
  mainProblem: {
    mm: "ဆိုင်စီမံရာမှာ ဘယ်အပိုင်းက အခက်ဆုံးလဲ — Order၊ Kitchen၊ Menu၊ Staff၊ Online၊ Branch? အောက်က ရွေးလည်းရပါတယ်။",
    en: "Which part is hardest — orders, kitchen, menu, staff, online presence, branches? You can tap one below.",
  },
  followUp: {
    mm: "နည်းနည်းထပ်ရှင်းပြပေးပါ၊ ဒါမှမဟုတ် အောက်ကထဲက အနီးစပ်ဆုံးကို ရွေးပေးပါ။",
    en: "Could you tell me a bit more, or tap the closest choice below?",
  },
  mainGoal: {
    mm: "အရင်ဆုံး ဘာကို ပိုလွယ်ချင်ပါသလဲ? အောက်ကထဲက ရွေးပေးပါ။",
    en: "What would you most like to make easier first? Tap a choice below.",
  },
};

const WRONG_STAGE: L = {
  mm: "Table အရေအတွက်ကို ပြောတာလား? ဆိုင်အမျိုးအစားကို အရင်သိချင်ပါတယ် 😊",
  en: "Did you mean the number of tables? I'd like to know your restaurant type first 😊",
};

const keyHit = (text: string, k: string) => {
  const key = normalizeText(k);
  if (!key) return false;
  // Short latin keys must match a whole word ("no", "fb", "pos").
  if (/^[a-z]{1,3}$/.test(key)) return new RegExp(`(^|\\s)${key}(\\s|$)`).test(text);
  return text.includes(key);
};

/** Interpret a typed answer in the context of the CURRENT question only. */
export function interpretAnswer(question: Question, raw: string): Interpretation {
  const text = normalizeText(raw);
  if (!text) return { kind: "unclear", message: CLARIFY[question.id] };

  for (const ch of question.choices) {
    if (
      text === normalizeText(ch.value) ||
      text === normalizeText(ch.label.mm) ||
      text === normalizeText(ch.label.en)
    ) {
      return { kind: "match", value: ch.value, label: ch.label, raw };
    }
  }

  if (question.id === "restaurantType") {
    const free = interpretRestaurantType(text);
    if (free?.kind === "match") return { ...free, raw };
    if (free?.kind === "unclear") return free;
  }

  const num = text.match(/\d+/);
  if (question.id === "tableCount") {
    if (/branch|ဆိုင်ခွဲ|ဘရန့်/.test(text) && !(num && /table|လုံး|ခုံ/.test(text))) {
      const ch = question.choices.find((x) => x.value === "multiBranch")!;
      return { kind: "match", value: ch.value, label: ch.label, raw };
    }
    if (num) {
      const value = bucketForTables(parseInt(num[0], 10));
      const ch = question.choices.find((x) => x.value === value)!;
      return { kind: "match", value, label: ch.label, raw };
    }
    if (/small|နည်းနည်း|သေးသေး/.test(text)) return { kind: "match", value: "1-10", label: question.choices[0]!.label, raw };
    if (/many|big|large|အများကြီး/.test(text)) return { kind: "match", value: "40+", label: question.choices[3]!.label, raw };
  } else if (num && text.replace(/[^a-z\u1000-\u109f]/g, "").length === 0) {
    return { kind: "unclear", message: question.id === "restaurantType" ? WRONG_STAGE : CLARIFY[question.id] };
  }

  // Multi-select: collect every tool mentioned.
  if (question.multi) {
    const hits = question.choices.filter(
      (ch) => ch.value !== "none" && (ch.keys ?? []).some((k) => keyHit(text, k)),
    );
    if (hits.length) {
      return {
        kind: "match",
        value: hits.map((h) => h.value).join(","),
        label: { mm: hits.map((h) => h.label.mm).join(", "), en: hits.map((h) => h.label.en).join(", ") },
        raw,
      };
    }
  }

  // Keyword rules, longest keyword wins.
  let best: { ch: Choice; len: number } | null = null;
  for (const ch of question.choices) {
    for (const k of ch.keys ?? []) {
      if (keyHit(text, k) && (!best || normalizeText(k).length > best.len)) {
        best = { ch, len: normalizeText(k).length };
      }
    }
  }
  if (best) return { kind: "match", value: best.ch.value, label: best.ch.label, raw };
  return { kind: "unclear", message: CLARIFY[question.id] };
}

/** Warm, human acknowledgement of an understood typed answer. */
export function typedAck(question: Question, value: string, lang: Lang, labelOverride?: string): string {
  const label = labelOverride ?? answerLabel(question, value, lang);
  const lines: Record<QuestionId, L> = {
    restaurantType: { mm: `ဟုတ်ကဲ့၊ ${label} ပါနော်။ မှတ်ထားလိုက်ပါပြီ။`, en: `Got it — you run a ${label}.` },
    tableCount: { mm: `ဟုတ်ကဲ့၊ ${label} ပါနော်။`, en: `Got it — ${label}.` },
    currentTools: { mm: `ဟုတ်ကဲ့၊ ${label} သုံးနေတာ မှတ်ထားပါပြီ။`, en: `Noted — you already use ${label}.` },
    mainProblem: { mm: `ဟုတ်ကဲ့၊ "${label}" ကို အဓိကအခက်အခဲအဖြစ် မှတ်ထားပါပြီ။`, en: `Noted — "${label}". Let me ask one more thing.` },
    followUp: { mm: `နားလည်ပါပြီ — "${label}"။ ဖြေရှင်းလို့ရပါတယ်။`, en: `Understood — "${label}". That's fixable.` },
    mainGoal: { mm: `ဟုတ်ကဲ့၊ ${label} ကို ဦးစားပေးပါမယ်။`, en: `Noted — ${label} first.` },
  };
  return pick(lang, lines[question.id]);
}
