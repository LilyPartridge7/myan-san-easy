import { IMAGES } from "./images";

export type MenuItem = {
  id: string;
  name: string;
  nameMm: string;
  price: number;
  category: "Popular" | "Hotpot" | "Sides" | "Drinks";
  image: string;
  soldOut?: boolean;
};

export const MENU: MenuItem[] = [
  {
    id: "chicken-hotpot",
    name: "Chicken Hotpot",
    nameMm: "ကြက်သား ဟော့ပေါ့",
    price: 12000,
    category: "Popular",
    image: IMAGES.hotpot,
  },
  {
    id: "seafood-hotpot",
    name: "Seafood Hotpot",
    nameMm: "ပင်လယ်စာ ဟော့ပေါ့",
    price: 18000,
    category: "Hotpot",
    image: IMAGES.food1,
  },
  {
    id: "premium-beef",
    name: "Premium Beef Set",
    nameMm: "အမဲသား အထူးစုံ",
    price: 22000,
    category: "Hotpot",
    image: IMAGES.food2,
    soldOut: true,
  },
  {
    id: "mushroom-pot",
    name: "Mushroom Veggie Pot",
    nameMm: "မှို နှင့် ဟင်းသီးဟင်းရွက်",
    price: 10000,
    category: "Hotpot",
    image: IMAGES.food3,
  },
  {
    id: "spring-rolls",
    name: "Crispy Spring Rolls",
    nameMm: "ကော်ပြန့်ကြော်",
    price: 4500,
    category: "Sides",
    image: IMAGES.gallery1,
  },
  {
    id: "garlic-rice",
    name: "Garlic Rice",
    nameMm: "ကြက်သွန်ဖြူ ထမင်းကြော်",
    price: 3500,
    category: "Sides",
    image: IMAGES.gallery2,
  },
  {
    id: "milk-tea",
    name: "Milk Tea",
    nameMm: "လက်ဖက်ရည်",
    price: 3000,
    category: "Drinks",
    image: IMAGES.drink,
  },
  {
    id: "lime-soda",
    name: "Lime Soda",
    nameMm: "သံပရာ ဆိုဒါ",
    price: 2500,
    category: "Drinks",
    image: IMAGES.gallery3,
  },
];

export const CATEGORIES = ["Popular", "Hotpot", "Sides", "Drinks"] as const;

export const formatMMK = (n: number) => `${n.toLocaleString("en-US")} MMK`;