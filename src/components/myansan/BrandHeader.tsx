import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home, Laptop, Moon, Sun } from "lucide-react";
import { useSetup } from "@/state/setupStore";
import { LanguageToggle } from "@/components/myansan/LanguageToggle";
import { useT } from "@/i18n";

export function BrandHeader({
  subtitle,
  status,
  exitTo = "/",
  onBack,
  showBack = true,
}: {
  subtitle?: string;
  status?: string;
  exitTo?: string;
  onBack?: () => void;
  showBack?: boolean;
}) {
  const { resetDemo, state, update } = useSetup();
  const router = useRouter();
  const { t } = useT();
  const theme = state.theme;
  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-4 py-3 2xl:max-w-[1400px]">
        {showBack ? (
          <button
            aria-label={t("back")}
            onClick={() => (onBack ? onBack() : router.history.back())}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : null}
        <Link
          to="/"
          aria-label={t("home")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
        >
          <Home className="h-4 w-4" />
        </Link>
        <Link to="/" className="hidden min-w-0 flex-col leading-tight sm:flex">
          <span className="text-lg font-semibold tracking-tight text-primary">{t("brand")}</span>
          {subtitle ? (
            <span className="truncate text-[11px] text-muted-foreground">{subtitle}</span>
          ) : null}
        </Link>
        {status ? (
          <span className="ml-3 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {status}
          </span>
        ) : null}
        <div className="ml-auto flex items-center gap-1">
          <LanguageToggle />
          <button
            aria-label={t("themeSwitchTo", { theme, next: nextTheme })}
            title={t("themeSwitchTo", { theme, next: nextTheme })}
            onClick={() => update({ theme: nextTheme })}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Laptop className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={resetDemo}
            className="hidden min-h-9 rounded-full px-3 text-[11px] text-muted-foreground/70 transition-colors hover:bg-muted sm:block"
          >
            {t("resetDemo")}
          </button>
          <Link
            to={exitTo}
            className="min-h-9 rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-muted"
          >
            {t("exit")}
          </Link>
        </div>
      </div>
    </header>
  );
}
