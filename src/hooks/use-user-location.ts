import { useEffect, useState } from "react";
import type { LatLng } from "@/lib/geo";

export type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; coords: LatLng }
  | { status: "denied" }
  | { status: "unavailable" };

export function useUserLocation() {
  const [state, setState] = useState<LocationState>({ status: "idle" });

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "unavailable" });
      return;
    }
    setState({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          status: "ready",
          coords: [pos.coords.latitude, pos.coords.longitude],
        }),
      (err) => {
        setState({ status: err.code === err.PERMISSION_DENIED ? "denied" : "unavailable" });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  };

  return { state, request };
}

/** Auto-load on mount (silent fail if denied). */
export function useAutoUserLocation(enabled: boolean) {
  const { state, request } = useUserLocation();
  useEffect(() => {
    if (enabled && state.status === "idle") request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  return state;
}
