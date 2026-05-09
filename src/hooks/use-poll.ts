import { useLocalStorage } from "./use-local-storage";

type Vote = "home" | "away";
interface State {
  votes: Record<string, { home: number; away: number }>;
  myVote: Record<string, Vote>;
}

const seed = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  const total = 20 + (Math.abs(h) % 60);
  const homePct = 30 + (Math.abs(h >> 3) % 41);
  const home = Math.round((total * homePct) / 100);
  return { home, away: total - home };
};

export function usePoll() {
  const [state, setState] = useLocalStorage<State>("matchmap:poll:v1", {
    votes: {},
    myVote: {},
  });

  const key = (venueId: string, matchId: string) => `${venueId}:${matchId}`;

  const tallyFor = (venueId: string, matchId: string) => {
    const k = key(venueId, matchId);
    const base = seed(k);
    const extra = state.votes[k] ?? { home: 0, away: 0 };
    return { home: base.home + extra.home, away: base.away + extra.away };
  };

  const myVote = (venueId: string, matchId: string) => state.myVote[key(venueId, matchId)];

  const vote = (venueId: string, matchId: string, side: Vote) => {
    const k = key(venueId, matchId);
    setState((prev) => {
      const prevVote = prev.myVote[k];
      if (prevVote === side) return prev;
      const cur = prev.votes[k] ?? { home: 0, away: 0 };
      const next = { ...cur };
      if (prevVote) next[prevVote] = Math.max(0, next[prevVote] - 1);
      next[side] = (next[side] ?? 0) + 1;
      return { votes: { ...prev.votes, [k]: next }, myVote: { ...prev.myVote, [k]: side } };
    });
  };

  return { tallyFor, myVote, vote };
}
