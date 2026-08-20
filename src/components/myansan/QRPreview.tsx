import { QrCode } from "lucide-react";
import type { QRStyle } from "@/state/setupStore";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

const STYLE_CLASS: Record<QRStyle, string> = {
  simple: "bg-white text-zinc-900 border-zinc-200",
  traditional: "bg-[#F6EEDF] text-[#5A3A22] border-[#D9C3A0]",
  premium: "bg-[#1B1416] text-[#E9DFC9] border-[#5A4530]",
};

export function QRPreview({
  style,
  restaurantName,
  table = "07",
  small,
}: {
  style: QRStyle;
  restaurantName: string;
  table?: string;
  small?: boolean;
}) {
  const { t } = useT();
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border px-5 py-6 text-center",
        STYLE_CLASS[style],
        small && "px-3 py-4",
      )}
    >
      <p className={cn("font-semibold tracking-[0.18em]", small ? "text-[10px]" : "text-xs")}>
        {restaurantName}
      </p>
      <p className={cn("tracking-[0.22em] opacity-70", small ? "text-[9px]" : "text-[11px]")}>
        {t("qr.scanToOrder")}
      </p>
      <div
        className={cn(
          "my-1 flex items-center justify-center rounded-lg bg-current/10",
          small ? "h-14 w-14" : "h-24 w-24",
        )}
      >
        <QrCode className={small ? "h-10 w-10" : "h-16 w-16"} />
      </div>
      <p className={cn("font-semibold tracking-[0.2em]", small ? "text-[10px]" : "text-sm")}>
        {t("qr.table", { table })}
      </p>
      <p className={cn("opacity-60", small ? "text-[8px]" : "text-[10px]")}>{t("qr.poweredBy")}</p>
    </div>
  );
}