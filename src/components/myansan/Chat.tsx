import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";
import { Send } from "lucide-react";

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

export function ChatComposer({
  hint,
  onSend,
}: {
  hint?: string;
  onSend?: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  };

  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mx-auto flex max-w-[820px] items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 shadow-sm focus-within:border-primary"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          aria-label="Message မြန်ဆန်"
          placeholder={hint ?? "စာရိုက်ပြီး ပြောလို့လည်း ရပါတယ်..."}
          className="min-h-11 w-full bg-transparent px-3 text-[16px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!value.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}