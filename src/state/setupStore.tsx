import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PackageId, ServiceKey } from "@/data/packages";
import { getPackage } from "@/data/packages";
import type { MenuItem } from "@/data/menu";

export type SetupStage =
  | "recommendation"
  | "package"
  | "website"
  | "qr"
  | "services"
  | "details"
  | "summary"
  | "payment"
  | "success";

export type WebsiteStyle = "warm" | "modern" | "traditional" | "luxury";
export type Template = "modern" | "traditional" | "luxury";
export type QRStyle = "simple" | "traditional" | "premium";
export type HelpService = "menuDigital" | "qrStand" | "staffTraining" | "websiteHelp" | "selfServe";
export type PaymentMethod = "kbzpay" | "wavepay" | "bank" | "contact";
export type SetupStatus = "draft" | "paid" | "waitingForContact";

export type CartLine = { item: MenuItem; qty: number };

export type SetupState = {
  restaurantName: string;
  restaurantType: string | null;
  tableCount: string | null;
  orderingMethod: string | null;
  mainProblem: string | null;
  mainGoal: string | null;
  recommendedPackage: PackageId | null;
  selectedPackage: PackageId | null;
  selectedServices: ServiceKey[];
  websiteStyle: WebsiteStyle | null;
  restaurantColor: string;
  tagline: string;
  heroImage: string;
  language: "mm" | "en";
  qrStyle: QRStyle | null;
  helpServices: HelpService[];
  address: string;
  township: string;
  city: string;
  mapLink: string;
  contactName: string;
  phone: string;
  email: string;
  preferredContact: "phone" | "viber" | "messenger" | "email";
  paymentMethod: PaymentMethod | null;
  setupStatus: SetupStatus;
  reference: string | null;
  currentStage: SetupStage;
  stageHistory: SetupStage[];
  confirmed: boolean;
  cart: CartLine[];
  orderPlaced: string | null;
};

const INITIAL: SetupState = {
  restaurantName: "SHWE HOTPOT",
  restaurantType: null,
  tableCount: null,
  orderingMethod: null,
  mainProblem: null,
  mainGoal: null,
  recommendedPackage: null,
  selectedPackage: null,
  selectedServices: [],
  websiteStyle: null,
  restaurantColor: "#7B1E28",
  tagline: "A warm hotpot experience made for sharing.",
  heroImage: "heroInterior",
  language: "mm",
  qrStyle: null,
  helpServices: [],
  address: "",
  township: "",
  city: "",
  mapLink: "",
  contactName: "",
  phone: "",
  email: "",
  preferredContact: "phone",
  paymentMethod: null,
  setupStatus: "draft",
  reference: null,
  currentStage: "recommendation",
  stageHistory: [],
  confirmed: false,
  cart: [],
  orderPlaced: null,
};

const STORAGE_KEY = "myansan-demo-state";

type Ctx = {
  state: SetupState;
  update: (patch: Partial<SetupState>) => void;
  goToStage: (stage: SetupStage) => void;
  goBack: () => void;
  canGoBack: boolean;
  toggleService: (key: ServiceKey) => void;
  toggleHelp: (key: HelpService) => void;
  applyPackage: (id: PackageId) => void;
  addToCart: (item: MenuItem) => void;
  setQty: (id: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;
  resetDemo: () => void;
};

const SetupContext = createContext<Ctx | null>(null);

export function SetupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SetupState>(INITIAL);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...(JSON.parse(raw) as Partial<SetupState>) }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const update = useCallback((patch: Partial<SetupState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const goToStage = useCallback((stage: SetupStage) => {
    setState((s) =>
      s.currentStage === stage
        ? s
        : { ...s, currentStage: stage, stageHistory: [...s.stageHistory, s.currentStage] },
    );
  }, []);

  const goBack = useCallback(() => {
    setState((s) => {
      if (s.stageHistory.length === 0) return s;
      const history = [...s.stageHistory];
      const prev = history.pop()!;
      return { ...s, currentStage: prev, stageHistory: history };
    });
  }, []);

  const toggleService = useCallback((key: ServiceKey) => {
    setState((s) => ({
      ...s,
      selectedServices: s.selectedServices.includes(key)
        ? s.selectedServices.filter((k) => k !== key)
        : [...s.selectedServices, key],
    }));
  }, []);

  const toggleHelp = useCallback((key: HelpService) => {
    setState((s) => {
      if (key === "selfServe") return { ...s, helpServices: ["selfServe"] };
      const without = s.helpServices.filter((k) => k !== "selfServe");
      return {
        ...s,
        helpServices: without.includes(key)
          ? without.filter((k) => k !== key)
          : [...without, key],
      };
    });
  }, []);

  const applyPackage = useCallback((id: PackageId) => {
    setState((s) => ({ ...s, selectedPackage: id, selectedServices: [...getPackage(id).services] }));
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setState((s) => {
      const existing = s.cart.find((l) => l.item.id === item.id);
      return {
        ...s,
        cart: existing
          ? s.cart.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l))
          : [...s.cart, { item, qty: 1 }],
      };
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setState((s) => ({
      ...s,
      cart:
        qty <= 0
          ? s.cart.filter((l) => l.item.id !== id)
          : s.cart.map((l) => (l.item.id === id ? { ...l, qty } : l)),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(INITIAL);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const cartCount = state.cart.reduce((a, l) => a + l.qty, 0);
  const cartTotal = state.cart.reduce((a, l) => a + l.qty * l.item.price, 0);

  const value = useMemo<Ctx>(
    () => ({
      state,
      update,
      goToStage,
      goBack,
      canGoBack: state.stageHistory.length > 0,
      toggleService,
      toggleHelp,
      applyPackage,
      addToCart,
      setQty,
      cartCount,
      cartTotal,
      resetDemo,
    }),
    [
      state,
      update,
      goToStage,
      goBack,
      toggleService,
      toggleHelp,
      applyPackage,
      addToCart,
      setQty,
      cartCount,
      cartTotal,
      resetDemo,
    ],
  );

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
}

export function useSetup() {
  const ctx = useContext(SetupContext);
  if (!ctx) throw new Error("useSetup must be used inside SetupProvider");
  return ctx;
}