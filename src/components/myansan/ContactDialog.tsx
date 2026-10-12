import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSetup } from "@/state/setupStore";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

/** "Talk to မြန်ဆန်" button + minimal lead form. Lead is kept locally only (no backend). */
export function ContactButton({ variant = "primary", className }: { variant?: "primary" | "outline"; className?: string }) {
  const { t } = useT();
  const { state } = useSetup();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ restaurant: "", owner: "", phone: "", method: "phone" });

  const onOpen = () => {
    setForm({
      restaurant: state.restaurantName ?? "",
      owner: (state as { ownerName?: string }).ownerName ?? "",
      phone: (state as { phone?: string }).phone ?? "",
      method: "phone",
    });
    setSent(false);
    setError(false);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.restaurant.trim() || !form.phone.trim()) return setError(true);
    try {
      const prev = JSON.parse(localStorage.getItem("myansan-leads") ?? "[]");
      localStorage.setItem("myansan-leads", JSON.stringify([...prev, { ...form, at: Date.now() }]));
    } catch {
      /* ignore */
    }
    setSent(true);
  };

  const input = "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-[15px]";
  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold transition-colors",
          variant === "primary"
            ? "bg-primary text-primary-foreground hover:bg-primary-hover"
            : "border border-border bg-card hover:bg-muted",
          className,
        )}
      >
        {t("talkToUs")}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("contactTitle")}</DialogTitle>
            <DialogDescription>{sent ? t("contactThanks") : t("contactDesc")}</DialogDescription>
          </DialogHeader>
          {sent ? (
            <button onClick={() => setOpen(false)} className="min-h-12 rounded-full bg-primary text-[15px] font-semibold text-primary-foreground">
              {t("close")}
            </button>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <label className="block text-sm font-medium">{t("contactRestaurant")}
                <input className={input} value={form.restaurant} onChange={(e) => setForm({ ...form, restaurant: e.target.value })} />
              </label>
              <label className="block text-sm font-medium">{t("contactOwner")}
                <input className={input} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
              </label>
              <label className="block text-sm font-medium">{t("contactPhone")}
                <input type="tel" className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label className="block text-sm font-medium">{t("contactMethod")}
                <select className={input} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                  <option value="phone">{t("contactPhoneCall")}</option>
                  <option value="viber">Viber</option>
                  <option value="messenger">Messenger</option>
                  <option value="telegram">Telegram</option>
                </select>
              </label>
              {error ? <p role="alert" className="text-sm text-destructive">{t("contactRequired")}</p> : null}
              <button type="submit" className="min-h-12 w-full rounded-full bg-primary text-[15px] font-semibold text-primary-foreground hover:bg-primary-hover">
                {t("contactSubmit")}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
