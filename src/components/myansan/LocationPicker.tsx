import { useCallback, useEffect, useRef, useState } from "react";
import { Crosshair, MapPin, Check, ExternalLink } from "lucide-react";
import { useT } from "@/i18n";
import { getMapsKey } from "@/lib/maps.functions";

type LatLng = { lat: number; lng: number };
const MYANMAR: LatLng = { lat: 16.8409, lng: 96.1735 }; // Yangon

declare global {
  interface Window {
    google?: any;
    __myansanMapsReady?: () => void;
  }
}

let loader: Promise<void> | null = null;
function loadMaps(key: string): Promise<void> {
  if (window.google?.maps?.Map) return Promise.resolve();
  if (loader) return loader;
  loader = new Promise<void>((resolve, reject) => {
    window.__myansanMapsReady = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&callback=__myansanMapsReady`;
    s.async = true;
    s.onerror = () => { loader = null; reject(new Error("load")); };
    document.head.appendChild(s);
    setTimeout(() => { if (!window.google?.maps?.Map) { loader = null; reject(new Error("timeout")); } }, 12000);
  });
  return loader;
}

export const mapsUrl = (p: LatLng) => `https://www.google.com/maps?q=${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;

export function LocationPicker({
  name, value, onConfirm, onClear, mapLink, onMapLink, onContinue,
}: {
  name: string;
  value: LatLng | null;
  onConfirm: (p: LatLng) => void;
  onClear: () => void;
  mapLink: string;
  onMapLink: (v: string) => void;
  onContinue: () => void;
}) {
  const { p } = useT();
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [pin, setPin] = useState<LatLng>(value ?? MYANMAR);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const confirmed = !!value;

  useEffect(() => {
    if (confirmed) return;
    let alive = true;
    setStatus("loading");
    (async () => {
      try {
        const { key } = await getMapsKey();
        if (!key) throw new Error("nokey");
        await loadMaps(key);
        if (!alive || !el.current) return;
        const g = window.google.maps;
        const map = new g.Map(el.current, {
          center: pin, zoom: value ? 16 : 12, clickableIcons: false, disableDefaultUI: true, zoomControl: true, gestureHandling: "greedy",
          styles: [
            { featureType: "water", stylers: [{ color: "#D6E4F5" }] },
            { featureType: "landscape", stylers: [{ color: "#F7FAFF" }] },
            { featureType: "poi", stylers: [{ visibility: "off" }] },
          ],
        });
        const marker = new g.Marker({ position: pin, map, draggable: true, animation: g.Animation.DROP });
        marker.addListener("dragend", () => { const q = marker.getPosition(); setPin({ lat: q.lat(), lng: q.lng() }); });
        map.addListener("click", (e: any) => { const q = { lat: e.latLng.lat(), lng: e.latLng.lng() }; marker.setPosition(q); map.panTo(q); setPin(q); });
        mapRef.current = map; markerRef.current = marker;
        setStatus("ready");
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, confirmed]);

  const locate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const q = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPin(q); markerRef.current?.setPosition(q); mapRef.current?.panTo(q); mapRef.current?.setZoom(16);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors";

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success"><Check className="h-5 w-5" /></span>
          <div>
            <p className="font-semibold">{p({ en: "Location added", mm: "တည်နေရာ ထည့်ပြီးပါပြီ" })}</p>
            <p className="text-xs text-muted-foreground">{name} · {value!.lat.toFixed(5)}, {value!.lng.toFixed(5)}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={onClear} className={`${btn} border border-border bg-card hover:bg-muted`}>{p({ en: "Change location", mm: "တည်နေရာ ပြောင်းမယ်" })}</button>
          <a href={mapsUrl(value!)} target="_blank" rel="noreferrer" className={`${btn} border border-primary/30 text-primary hover:bg-secondary`}>
            <ExternalLink className="h-4 w-4" /> {p({ en: "Open in Google Maps", mm: "Google Maps မှာ ဖွင့်မယ်" })}
          </a>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-border bg-muted p-6 text-center">
        <MapPin className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 font-semibold">{p({ en: "Add your location later", mm: "တည်နေရာကို နောက်မှ ထည့်နိုင်ပါတယ်" })}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={onContinue} className={`${btn} bg-primary text-primary-foreground hover:bg-primary-hover`}>{p({ en: "Continue without location", mm: "တည်နေရာမပါဘဲ ဆက်မယ်" })}</button>
          <button onClick={() => setPasteOpen((v) => !v)} className={`${btn} border border-border bg-card`}>{p({ en: "Paste Google Maps link", mm: "Google Maps link ထည့်မယ်" })}</button>
          <button onClick={() => setAttempt((a) => a + 1)} className={`${btn} border border-border bg-card`}>{p({ en: "Try again", mm: "ထပ်ကြိုးစားမယ်" })}</button>
        </div>
        {pasteOpen && (
          <input value={mapLink} onChange={(e) => onMapLink(e.target.value)} placeholder="https://maps.app.goo.gl/..."
            className="mt-4 w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary" />
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-[52vh] min-h-[320px] w-full bg-muted">
        <div ref={el} className="absolute inset-0" />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            {p({ en: "Loading map…", mm: "မြေပုံ ဖွင့်နေပါတယ်…" })}
          </div>
        )}
        <button onClick={locate} disabled={status !== "ready"}
          className={`${btn} absolute left-3 top-3 border border-border bg-card shadow-md disabled:opacity-50`}>
          <Crosshair className="h-4 w-4 text-primary" /> {locating ? p({ en: "Finding…", mm: "ရှာနေပါတယ်…" }) : p({ en: "Use my current location", mm: "လက်ရှိတည်နေရာ သုံးမယ်" })}
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-xs text-muted-foreground">{p({ en: "Tap the map or drag the pin.", mm: "မြေပုံကိုနှိပ်ပါ (သို့) Pin ကို ဆွဲရွှေ့ပါ။" })}</p>
        <button onClick={() => onConfirm(pin)} disabled={status !== "ready"}
          className={`${btn} bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40`}>
          {p({ en: "Confirm this location", mm: "ဒီတည်နေရာ အတည်ပြုမယ်" })}
        </button>
      </div>
    </div>
  );
}
