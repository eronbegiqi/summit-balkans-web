"use client";

import { useEffect, useRef, useState } from "react";

// Approximate PoB trail waypoints (lat, lng)
const TRAIL: [number, number][] = [
  [42.409, 19.778], // Theth
  [42.385, 19.945], // Valbona Pass
  [42.450, 20.080], // Valbona
  [42.520, 20.200], // Dobërdol
  [42.550, 20.320], // Çerem
  [42.659, 20.289], // Peja
  [42.720, 20.050], // Čakor Pass
  [42.820, 19.880], // Babino Polje
  [42.600, 19.940], // Plav
  [42.550, 19.900], // Visitor Plateau
  [42.520, 20.100], // Ropiojani
  [42.380, 20.430], // Gjakova
];

const MARKERS = [
  { pos: [42.409, 19.778] as [number, number], name: "Theth", type: "village", desc: "Traditional Albanian mountain village. Trail starting point." },
  { pos: [42.450, 20.080] as [number, number], name: "Valbona Valley", type: "valley", desc: "Wide, lush valley framed by towering peaks. Iconic landscape." },
  { pos: [42.659, 20.289] as [number, number], name: "Peja", type: "village", desc: "Kosovo's adventure hub. Patriarchate of Peć monastery nearby." },
  { pos: [42.600, 19.940] as [number, number], name: "Plav Lake", type: "lake", desc: "The largest alpine lake in the region. Surrounded by peaks." },
  { pos: [42.520, 20.200] as [number, number], name: "Dobërdol", type: "peak", desc: "High alpine plateau at 2,000m. Remote shepherds' terrain." },
  { pos: [42.385, 19.945] as [number, number], name: "Valbona Pass", type: "peak", desc: "1,793m — the trail's most iconic crossing." },
  { pos: [42.720, 20.050] as [number, number], name: "Čakor Pass", type: "border", desc: "Kosovo–Montenegro border crossing at 1,849m." },
  { pos: [42.550, 19.900] as [number, number], name: "Visitor Plateau", type: "valley", desc: "Arguably the most scenic terrain on the whole trail." },
];

type FilterType = "all" | "peak" | "lake" | "village" | "border" | "valley";

const FILTER_LABELS: { type: FilterType; label: string }[] = [
  { type: "all", label: "All" },
  { type: "peak", label: "Peaks" },
  { type: "lake", label: "Lakes" },
  { type: "village", label: "Villages" },
  { type: "border", label: "Borders" },
  { type: "valley", label: "Valleys" },
];

const TYPE_COLORS: Record<string, string> = {
  village: "#3B4A2E",
  peak: "#B45D3C",
  lake: "#2563eb",
  border: "#E8B254",
  valley: "#059669",
};

export function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon paths for Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [42.55, 20.05],
        zoom: 9,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap © CARTO",
          maxZoom: 18,
        }
      ).addTo(map);

      // Trail polyline
      L.polyline(TRAIL, {
        color: "#3B4A2E",
        weight: 3,
        opacity: 0.8,
        dashArray: "6 4",
      }).addTo(map);

      // Markers
      const markers: import("leaflet").Marker[] = [];
      MARKERS.forEach((m) => {
        const color = TYPE_COLORS[m.type] ?? "#0E1310";
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        const marker = L.marker(m.pos, { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:system-ui;min-width:160px"><strong style="font-size:13px">${m.name}</strong><br/><span style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.08em">${m.type}</span><br/><p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#333">${m.desc}</p></div>`,
            { maxWidth: 220 }
          );
        // Store type on marker for filtering
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker as any)._pobType = m.type;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker as any)._pobName = m.name;
        markers.push(marker);
      });

      markersRef.current = markers;
      mapInstanceRef.current = map;
      setLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Apply filter
  useEffect(() => {
    if (!loaded) return;
    import("leaflet").then((L) => {
      markersRef.current.forEach((marker) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const type = (marker as any)._pobType as string;
        const show = filter === "all" || type === filter;
        if (show) {
          mapInstanceRef.current?.hasLayer(marker) || marker.addTo(mapInstanceRef.current!);
        } else {
          mapInstanceRef.current?.hasLayer(marker) && mapInstanceRef.current.removeLayer(marker);
        }
      });
      void L; // suppress unused
    });
  }, [filter, loaded]);

  return (
    <section id="route" className="py-20 md:py-28 bg-bone">
      <div className="max-w-content mx-auto px-5 md:px-10">
        <div className="mb-10">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-terra mb-3">
            The Route
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-fraunces text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight leading-tight">
              192 km through three countries
            </h2>
            {/* Filter controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {FILTER_LABELS.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    filter === type
                      ? "bg-ink text-white border-ink"
                      : "bg-transparent text-ink/55 border-divider hover:border-ink/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map container */}
        <div className="relative rounded-card-hero overflow-hidden border-2 border-divider">
          {/* Leaflet CSS */}
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          />
          <div ref={mapRef} className="w-full h-[480px] md:h-[560px]" />
          {!loaded && (
            <div className="absolute inset-0 bg-bone flex items-center justify-center">
              <div className="font-mono text-sm text-ink/40 animate-pulse">Loading map…</div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                style={{ background: color }}
              />
              <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider capitalize">
                {type}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 border-t-2 border-dashed border-forest" />
            <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">Trail</span>
          </div>
        </div>

        {/* Starting points */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Theth", country: "Albania" },
            { name: "Valbona Valley", country: "Albania" },
            { name: "Peja", country: "Kosovo" },
            { name: "Plav", country: "Montenegro" },
          ].map(({ name, country }) => (
            <div key={name} className="border-2 border-divider rounded-card p-4 bg-white">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-terra mb-1">
                {country}
              </div>
              <div className="font-fraunces text-base font-semibold">{name}</div>
              <div className="font-mono text-[11px] text-ink/40 mt-1">Starting point</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

