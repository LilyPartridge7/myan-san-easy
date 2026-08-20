import { ChevronLeft } from "lucide-react";
import { useT } from "@/i18n";

export function SetupNavigation({
  onBack,
  onContinue,
  continueLabel,
  backLabel,
  disabled,
  extra,
}: {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  backLabel?: string;
  disabled?: boolean;
  extra?: React.ReactNode;
}) {
  const { t } = useT();
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      {onBack ? (
        <button
          onClick={onBack}
          className="inline-flex min-h-12 items-center gap-1 rounded-full border border-border bg-card px-5 text-[15px] font-medium transition-colors hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" /> {backLabel ?? t("navBack")}
        </button>
      ) : null}
      {onContinue ? (
        <button
          onClick={onContinue}
          disabled={disabled}
          className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-40"
        >
          {continueLabel ?? t("navContinue")}
        </button>
      ) : null}
      {extra}
    </div>
  );
}

export function StageRail({ active }: { active: "Consultation" | "Your Setup" | "Review" }) {
  const { t } = useT();
  const steps = [
    { key: "Consultation" as const, label: t("navStageConsultation") },
    { key: "Your Setup" as const, label: t("navStageSetup") },
    { key: "Review" as const, label: t("navStageReview") },
  ];
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {steps.map((s, i) => (
        <span key={s.key} className="flex items-center gap-2">
          <span className={s.key === active ? "font-semibold text-primary" : ""}>{s.label}</span>
          {i < steps.length - 1 ? <span className="opacity-40">→</span> : null}
        </span>
      ))}
    </div>
  );
}
