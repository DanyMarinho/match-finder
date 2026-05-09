import { useLocalStorage } from "./use-local-storage";

interface CouponState {
  redeemedAt: Record<string, string>; // venueId -> ISO
}

export function useCoupons() {
  const [state, setState] = useLocalStorage<CouponState>("matchmap:coupons:v1", {
    redeemedAt: {},
  });

  const redeem = (venueId: string) => {
    if (state.redeemedAt[venueId]) return;
    setState((p) => ({ redeemedAt: { ...p.redeemedAt, [venueId]: new Date().toISOString() } }));
  };

  const redeemedAt = (venueId: string) => state.redeemedAt[venueId];

  return { redeem, redeemedAt };
}
