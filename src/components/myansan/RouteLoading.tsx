/** Shared branded route-loading screen. Theme-aware, opaque — never shows the previous page. */
export function RouteLoading() {
  return (
    <div className="page-enter fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        မြန်
      </span>
      <div>
        <p className="text-[16px] font-medium text-foreground">အနည်းငယ်စောင့်ပေးပါ...</p>
        <p className="mt-1 text-sm text-muted-foreground">Preparing your experience...</p>
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
