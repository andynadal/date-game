import { challenges, type Challenge } from "@/data/challenges";

export const CHALLENGE_COUNT = 15;
export const WINNING_SCORE = 10;

export type PlayerKey = "player1" | "player2";
export type RoundOutcome = PlayerKey | "both" | "skip";

export type TinyHuntGame = {
  gameCode: string;
  players: Record<PlayerKey, string>;
  deck: Challenge[];
  currentIndex: number;
  scores: Record<PlayerKey, number>;
  isRevealed: boolean;
  roundResolved: boolean;
  outcome: RoundOutcome | null;
  completedAt: number | null;
};

type CreateGameInput = {
  gameCode: string;
  player1: string;
  player2: string;
};

const createSeedGenerator = (value: string): (() => number) => {
  let hash = 1779033703 ^ value.length;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
};

const createRandom = (seed: number) => {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

const normalizeName = (name: string, fallback: string) => name.trim() || fallback;
const normalizeCode = (code: string) => code.trim();

export const createChallengeDeck = (gameCode: string): Challenge[] => {
  const seed = createSeedGenerator(normalizeCode(gameCode) || "tiny-hunt")();
  const random = createRandom(seed);
  const deck = [...challenges];

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }

  return deck.slice(0, CHALLENGE_COUNT);
};

export const createGame = ({ gameCode, player1, player2 }: CreateGameInput): TinyHuntGame => ({
  gameCode: normalizeCode(gameCode),
  players: {
    player1: normalizeName(player1, "Player 1"),
    player2: normalizeName(player2, "Player 2"),
  },
  deck: createChallengeDeck(gameCode),
  currentIndex: 0,
  scores: {
    player1: 0,
    player2: 0,
  },
  isRevealed: false,
  roundResolved: false,
  outcome: null,
  completedAt: null,
});

const isDeckFinished = (game: TinyHuntGame) => game.currentIndex >= game.deck.length - 1;
const hasWinner = (scores: TinyHuntGame["scores"]) =>
  scores.player1 >= WINNING_SCORE || scores.player2 >= WINNING_SCORE;

export const revealChallenge = (game: TinyHuntGame): TinyHuntGame => {
  if (game.isRevealed || game.completedAt) {
    return game;
  }

  return {
    ...game,
    isRevealed: true,
  };
};

export const applyRoundOutcome = (
  game: TinyHuntGame,
  outcome: RoundOutcome,
): TinyHuntGame => {
  if (!game.isRevealed || game.roundResolved || game.completedAt) {
    return game;
  }

  const scores = {
    ...game.scores,
  };

  if (outcome === "player1" || outcome === "both") {
    scores.player1 += 1;
  }

  if (outcome === "player2" || outcome === "both") {
    scores.player2 += 1;
  }

  return {
    ...game,
    scores,
    roundResolved: true,
    outcome,
    completedAt: hasWinner(scores) || isDeckFinished(game) ? Date.now() : null,
  };
};

export const advanceToNextChallenge = (game: TinyHuntGame): TinyHuntGame => {
  if (!game.roundResolved || game.completedAt) {
    return game;
  }

  return {
    ...game,
    currentIndex: game.currentIndex + 1,
    isRevealed: false,
    roundResolved: false,
    outcome: null,
  };
};

export const getCurrentChallenge = (game: TinyHuntGame): Challenge | null =>
  game.deck[game.currentIndex] ?? null;

export const getResultSummary = (game: TinyHuntGame) => {
  if (!game.completedAt) {
    return null;
  }

  const { player1, player2 } = game.players;
  const { scores } = game;
  const player1Won = scores.player1 >= WINNING_SCORE;
  const player2Won = scores.player2 >= WINNING_SCORE;

  if (player1Won && player2Won) {
    return {
      title: "A perfect tie",
      detail: `${player1} and ${player2} hit ${WINNING_SCORE} together. Date-night legend behavior.`,
    };
  }

  if (player1Won || player2Won) {
    const winner = player1Won ? player1 : player2;
    return {
      title: `${winner} wins Tiny Hunt`,
      detail: `${winner} reached ${WINNING_SCORE} points first and takes the cinematic victory.`,
    };
  }

  if (scores.player1 === scores.player2) {
    return {
      title: "The deck is complete",
      detail: `All ${game.deck.length} challenges are done and you're still tied. Consider it a romantic overtime draw.`,
    };
  }

  const winner = scores.player1 > scores.player2 ? player1 : player2;

  return {
    title: `${winner} leads at the final card`,
    detail: `All ${game.deck.length} seeded challenges are complete, so ${winner} takes the win on points.`,
  };
};

export const isTinyHuntGame = (value: unknown): value is TinyHuntGame => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const game = value as Partial<TinyHuntGame>;

  return (
    typeof game.gameCode === "string" &&
    typeof game.currentIndex === "number" &&
    typeof game.isRevealed === "boolean" &&
    typeof game.roundResolved === "boolean" &&
    typeof game.completedAt !== "undefined" &&
    typeof game.players?.player1 === "string" &&
    typeof game.players?.player2 === "string" &&
    typeof game.scores?.player1 === "number" &&
    typeof game.scores?.player2 === "number" &&
    Array.isArray(game.deck)
  );
};
