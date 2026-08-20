import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetup } from "@/state/setupStore";

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
  const { state, update, resetDemo } = useSetup();
  const router = useRouter();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-4 py-3">
        {showBack ? (
          <button
            aria-label="Back"
            onClick={() => (onBack ? onBack() : router.history.back())}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : null}
        <Link
          to="/"
          aria-label="Home"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
        >
          <Home className="h-4 w-4" />
        </Link>
        <Link to="/" className="flex min-w-0 flex-col leading-tight">
          <span className="text-lg font-semibold tracking-tight text-primary">မြန်ဆန်</span>
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
          <button
            onClick={() => update({ language: state.language === "mm" ? "en" : "mm" })}
            className="min-h-9 rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {state.language === "mm" ? "မြန်မာ" : "EN"}
          </button>
          <button
            aria-label="Toggle theme"
            onClick={() => setDark((d) => !d)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={resetDemo}
            className="hidden min-h-9 rounded-full px-3 text-[11px] text-muted-foreground/70 transition-colors hover:bg-muted sm:block"
          >
            Reset Demo
          </button>
          <Link
            to={exitTo}
            className="min-h-9 rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-muted"
          >
            Exit
          </Link>
        </div>
      </div>
    </header>
  );
}