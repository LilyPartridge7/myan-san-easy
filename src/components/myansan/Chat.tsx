import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AIMessage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("fade-up flex gap-3", className)}>
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
        မြန်
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card px-4 py-3 text-[15px] leading-relaxed text-card-foreground shadow-sm ring-1 ring-border">
        {children}
      </div>
    </div>
  );
}

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="fade-up flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-[15px] text-primary-foreground shadow-sm">
        {children}
      </div>
    </div>
  );
}

export function QuickChoices({
  choices,
  onSelect,
}: {
  choices: { value: string; label: string }[];
  onSelect: (value: string, label: string) => void;
}) {
  return (
    <div className="fade-up flex flex-wrap gap-2 pl-11">
      {choices.map((c) => (
        <button
          key={c.value}
          onClick={() => onSelect(c.value, c.label)}
          className="min-h-11 rounded-full border border-border bg-card px-5 py-2.5 text-[15px] font-medium text-card-foreground transition-colors hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export function ChatComposer({ hint }: { hint?: string }) {
  return (
    <div className="border-t border-border bg-background/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-[820px] items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
        <input
          readOnly
          placeholder={hint ?? "အပေါ်က ရွေးချယ်စရာလေးတွေထဲက နှိပ်ပေးပါ"}
          className="min-h-9 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}