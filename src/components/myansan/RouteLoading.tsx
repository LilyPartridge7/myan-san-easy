import logoAsset from "@/assets/myansan-logo.png.asset.json";
import { useT } from "@/i18n";

/** Shared branded route-loading screen. Theme-aware, opaque — never shows the previous page. */
export function RouteLoading() {
  const { t } = useT();
  return (
    <div className="page-enter fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <img src={logoAsset.url} alt="MyanSan" className="ms-logo-loader h-32 w-auto" />
      <div>
        <p className="text-[16px] font-medium text-foreground">{t("routeLoadingTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("routeLoadingSubtitle")}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
      </div>
    </div>
  );
}

export default RouteLoading;
