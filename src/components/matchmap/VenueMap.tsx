import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { type Venue } from "@/data/venues";
import { Button } from "@/components/ui/button";
import { LocateButton } from "./LocateButton";
import type { LatLng } from "@/lib/geo";

type PinState = "idle" | "hovered" | "selected" | "alert" | "alert-critical";

function buildPinIcon(state: PinState): L.DivIcon {
  const color =
    state === "alert-critical"
      ? "#ef4444"
      : state === "alert"
        ? "#f59e0b"
        : state === "hovered"
          ? "#fb923c"
          : "#10b981";
  const size = state === "selected" || state === "hovered" ? 42 : 34;
  const height = Math.round(size * 1.235);
  const ping =
    state === "alert" || state === "alert-critical"
      ? `<span style="position:absolute;inset:-4px;border-radius:9999px;background:${color};opacity:0.35;animation:matchmap-ping 1.6s cubic-bezier(0,0,0.2,1) infinite"></span>`
      : "";
  const inner =
    state === "alert" || state === "alert-critical"
      ? `<svg viewBox="0 0 24 24" width="${size * 0.55}" height="${size * 0.55}" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;top:18%;left:22%"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
      : `<circle cx="${size / 2}" cy="${size * 0.4}" r="${size * 0.18}" fill="#0f172a"/><circle cx="${size / 2}" cy="${size * 0.4}" r="${size * 0.09}" fill="${color}"/>`;

  return L.divIcon({
    className: "matchmap-pin",
    html: `<div style="width:${size}px;height:${height}px;position:relative;filter:drop-shadow(0 4px 8px ${color}66);">
      ${ping}
      <svg viewBox="0 0 32 40" width="${size}" height="${height}" style="position:relative;z-index:1">
        <path d="M16 0C7.2 0 0 7 0 15.6 0 27 16 40 16 40s16-13 16-24.4C32 7 24.8 0 16 0z" fill="${color}"/>
      </svg>
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="position:absolute;top:0;left:0;z-index:2">${inner}</svg>
    </div>`,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height + 4],
  });
}

function FlyTo({ venue }: { venue: Venue | null }) {
  const map = useMap();
  useEffect(() => {
    if (!venue || venue.suggested) return;
    const [lat, lng] = venue.coords;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    // Wait until the container has real dimensions; otherwise unproject() returns NaN.
    const run = () => {
      const size = map.getSize();
      if (size.x === 0 || size.y === 0) {
        map.invalidateSize();
        return;
      }
      map.flyTo([lat, lng], 16, { duration: 0.8 });
    };
    // Defer one frame to let layout settle.
    const id = window.requestAnimationFrame(run);
    return () => window.cancelAnimationFrame(id);
  }, [venue, map]);
  return null;
}

interface Props {
  venues: Venue[];
  selected: Venue | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  alertsCountFor: (id: string) => number;
  hasCriticalAlert: (id: string) => boolean;
  userCoords: LatLng | null;
  onLocate: () => void;
}

export function VenueMap({
  venues,
  selected,
  hoveredId,
  onSelect,
  onHover,
  alertsCountFor,
  hasCriticalAlert,
  userCoords,
  onLocate,
}: Props) {
  const center: [number, number] = [-26.3045, -48.8487];
  const ref = useRef<L.Map | null>(null);

  const visible = venues.filter((v) => !v.suggested);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={13}
        ref={ref}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
          subdomains="abcd"
        />
        <FlyTo venue={selected} />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {visible.map((v) => {
            const alerts = alertsCountFor(v.id);
            const critical = hasCriticalAlert(v.id);
            const state: PinState =
              selected?.id === v.id
                ? "selected"
                : critical
                  ? "alert-critical"
                  : alerts > 0
                    ? "alert"
                    : hoveredId === v.id
                      ? "hovered"
                      : "idle";
            const next = v.matches[0];
            return (
              <Marker
                key={`${v.id}-${state}`}
                position={v.coords}
                icon={buildPinIcon(state)}
                eventHandlers={{
                  mouseover: () => onHover(v.id),
                  mouseout: () => onHover(null),
                }}
              >
                <Popup>
                  <div className="space-y-2 p-1">
                    <div className="font-semibold">{v.name}</div>
                    {next && (
                      <div className="text-xs opacity-80">
                        {next.home} × {next.away}
                      </div>
                    )}
                    <Button
                      size="sm"
                      onClick={() => onSelect(v.id)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
        {userCoords && (
          <Marker
            position={userCoords}
            icon={L.divIcon({
              className: "matchmap-me",
              html: `<div style="width:18px;height:18px;border-radius:9999px;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 6px rgba(59,130,246,0.25)"></div>`,
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            })}
          />
        )}
      </MapContainer>
      <LocateButton onClick={onLocate} />
    </div>
  );
}
