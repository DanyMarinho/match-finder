import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { type Venue } from "@/data/venues";
import { Button } from "@/components/ui/button";

// Custom emerald pin
const pinIcon = L.divIcon({
  className: "matchmap-pin",
  html: `<div style="
    width:34px;height:42px;position:relative;
    filter: drop-shadow(0 4px 8px rgba(16,185,129,0.5));
  ">
    <svg viewBox="0 0 32 40" width="34" height="42">
      <path d="M16 0C7.2 0 0 7 0 15.6 0 27 16 40 16 40s16-13 16-24.4C32 7 24.8 0 16 0z" fill="#10b981"/>
      <circle cx="16" cy="15" r="6" fill="#0f172a"/>
      <circle cx="16" cy="15" r="3" fill="#10b981"/>
    </svg>
  </div>`,
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -38],
});

function FlyTo({ venue }: { venue: Venue | null }) {
  const map = useMap();
  useEffect(() => {
    if (venue) map.flyTo(venue.coords, 16, { duration: 0.8 });
  }, [venue, map]);
  return null;
}

interface Props {
  venues: Venue[];
  selected: Venue | null;
  onSelect: (id: string) => void;
}

export function VenueMap({ venues, selected, onSelect }: Props) {
  const center: [number, number] = [-26.3045, -48.8487];
  const ref = useRef<L.Map | null>(null);

  return (
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
      {venues.map((v) => (
        <Marker key={v.id} position={v.coords} icon={pinIcon}>
          <Popup>
            <div className="space-y-2 p-1">
              <div className="font-semibold">{v.name}</div>
              <div className="text-xs opacity-80">{v.match}</div>
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
      ))}
    </MapContainer>
  );
}
