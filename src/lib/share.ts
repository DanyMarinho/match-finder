export function whatsappLink(phone: string | undefined, message: string): string {
  const cleaned = (phone ?? "").replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return cleaned
    ? `https://wa.me/55${cleaned}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export function googleMapsRoute(coords: [number, number]): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
}

export function uberLink(coords: [number, number], name: string): string {
  const params = new URLSearchParams({
    action: "setPickup",
    "pickup": "my_location",
    "dropoff[latitude]": String(coords[0]),
    "dropoff[longitude]": String(coords[1]),
    "dropoff[nickname]": name,
  });
  return `https://m.uber.com/ul/?${params.toString()}`;
}

export async function nativeShare(
  title: string,
  text: string,
  url: string,
): Promise<boolean> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
