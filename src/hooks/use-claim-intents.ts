import { useLocalStorage } from "./use-local-storage";
import type { ClaimBarInput } from "@/lib/validation-schemas";

interface ClaimIntent extends ClaimBarInput {
  venueId: string;
  submittedAt: string;
}

export function useClaimIntents() {
  const [intents, setIntents] = useLocalStorage<ClaimIntent[]>(
    "matchmap:claims:v1",
    [],
  );
  const submit = (venueId: string, input: ClaimBarInput) => {
    setIntents((prev) => [
      ...prev,
      { ...input, venueId, submittedAt: new Date().toISOString() },
    ]);
  };
  const hasClaimedFor = (venueId: string) => intents.some((i) => i.venueId === venueId);
  return { submit, hasClaimedFor };
}
