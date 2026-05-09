"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  applyRoundOutcome,
  advanceToNextChallenge,
  createGame,
  getCurrentChallenge,
  getResultSummary,
  isTinyHuntGame,
  revealChallenge,
  type RoundOutcome,
  type TinyHuntGame,
  WINNING_SCORE,
} from "@/lib/game";

const STORAGE_KEY = "tiny-hunt-game-state";
const noopSubscribe = () => () => {};

type SetupFormState = {
  gameCode: string;
  player1: string;
  player2: string;
};

const particleSeeds = [
  { left: "8%", top: "14%", size: "0.45rem", delay: "0s", duration: "11s" },
  { left: "18%", top: "64%", size: "0.72rem", delay: "1.2s", duration: "14s" },
  { left: "27%", top: "28%", size: "0.32rem", delay: "2.4s", duration: "9s" },
  { left: "35%", top: "78%", size: "0.65rem", delay: "0.6s", duration: "15s" },
  { left: "46%", top: "18%", size: "0.4rem", delay: "2s", duration: "13s" },
  { left: "57%", top: "69%", size: "0.58rem", delay: "1.5s", duration: "10s" },
  { left: "66%", top: "22%", size: "0.74rem", delay: "0.8s", duration: "12s" },
  { left: "74%", top: "52%", size: "0.36rem", delay: "1.8s", duration: "9.5s" },
  { left: "83%", top: "16%", size: "0.68rem", delay: "0.3s", duration: "14s" },
  { left: "90%", top: "72%", size: "0.5rem", delay: "2.1s", duration: "11.5s" },
];

const initialFormState: SetupFormState = {
  gameCode: "",
  player1: "",
  player2: "",
};

const actionLabelByOutcome: Record<RoundOutcome, string> = {
  player1: "wins this round",
  player2: "wins this round",
  both: "both win a point",
  skip: "challenge skipped",
};

const ActionButton = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}) => {
  const variants = {
    primary:
      "bg-[linear-gradient(135deg,rgba(229,176,114,0.95),rgba(193,113,81,0.95))] text-slate-950 shadow-[0_16px_40px_rgba(198,129,81,0.35)] hover:-translate-y-0.5",
    secondary:
      "bg-white/10 text-white shadow-[0_16px_40px_rgba(10,10,10,0.12)] ring-1 ring-white/15 hover:bg-white/16",
    ghost:
      "bg-transparent text-[#f8d7aa] ring-1 ring-[#f8d7aa]/30 hover:bg-[#f8d7aa]/10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const Surface = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`rounded-[2rem] border border-white/12 bg-white/[0.08] p-6 shadow-[0_25px_90px_rgba(7,10,22,0.35)] backdrop-blur-xl sm:p-8 ${className}`}
  >
    {children}
  </section>
);

const ScoreChip = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) => (
  <div className="rounded-[1.6rem] border border-white/12 bg-slate-950/30 px-4 py-3 text-left shadow-[0_10px_35px_rgba(15,23,42,0.28)]">
    <p className="text-[0.65rem] uppercase tracking-[0.32em] text-white/55">{label}</p>
    <div className="mt-2 flex items-center justify-between gap-3">
      <span className="text-lg font-medium text-white">{value}</span>
      <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
    </div>
  </div>
);

const ProgressBar = ({
  currentIndex,
  totalChallenges,
  player1Score,
  player2Score,
  player1Name,
  player2Name,
}: {
  currentIndex: number;
  totalChallenges: number;
  player1Score: number;
  player2Score: number;
  player1Name: string;
  player2Name: string;
}) => {
  const progress = ((currentIndex + 1) / totalChallenges) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f8d7aa]" />
          <span className="text-white/76">{player1Name}: {player1Score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/76">{player2Name}: {player2Score}</span>
          <span className="h-2.5 w-2.5 rounded-full bg-[#c17151]" />
        </div>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full border border-white/12 bg-slate-950/30">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-[#f8d7aa] to-[#c17151] transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-center text-xs text-white/55">
        Challenge {Math.min(currentIndex + 1, totalChallenges)} of {totalChallenges}
      </p>
    </div>
  );
};

const AmbientBackdrop = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="ambient-orb ambient-orb-left" />
    <div className="ambient-orb ambient-orb-right" />
    <div className="ambient-orb ambient-orb-bottom" />
    {particleSeeds.map((particle, index) => (
      <span
        key={index}
        className="floating-particle"
        style={{
          left: particle.left,
          top: particle.top,
          width: particle.size,
          height: particle.size,
          animationDelay: particle.delay,
          animationDuration: particle.duration,
        }}
      />
    ))}
  </div>
);

const SetupScreen = ({
  form,
  setForm,
  onStart,
}: {
  form: SetupFormState;
  setForm: React.Dispatch<React.SetStateAction<SetupFormState>>;
  onStart: () => void;
}) => {
  const canStart = Boolean(
    form.gameCode.trim() && form.player1.trim() && form.player2.trim(),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
      <Surface className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,215,170,0.22),transparent_46%)]" />
        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-[#f8d7aa]">Date-night card game</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Tiny Hunt
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              A soft, cinematic scavenger hunt for two. Pick a shared game code,
              reveal one beautifully chaotic prompt at a time, and race to {WINNING_SCORE}.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/74 sm:grid-cols-3">
            {[
              "Use the same game code on both phones to draw the exact same 7 challenges.",
              "Tap each card when you are ready, award points, then move to the next round.",
              "Progress is saved in your browser so a refresh does not ruin the mood.",
            ].map((instruction) => (
              <div
                key={instruction}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/25 p-4 leading-6"
              >
                {instruction}
              </div>
            ))}
          </div>
        </div>
      </Surface>

      <Surface className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-white/55">Start a new game</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Set the scene</h2>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-white/76">Game code</span>
          <input
            value={form.gameCode}
            onChange={(event) => {
              const cleaned = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
              setForm((current) => ({ ...current, gameCode: cleaned }));
            }}
            placeholder="MIDNIGHT-TERRACE"
            className="w-full rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#f8d7aa]/55 focus:bg-slate-950/50"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-white/76">Player 1 (you)</span>
          <input
            value={form.player1}
            onChange={(event) =>
              setForm((current) => ({ ...current, player1: event.target.value }))
            }
            placeholder="Your name"
            className="w-full rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#f8d7aa]/55 focus:bg-slate-950/50"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-white/76">Player 2 (other)</span>
          <input
            value={form.player2}
            onChange={(event) =>
              setForm((current) => ({ ...current, player2: event.target.value }))
            }
            placeholder="Their name"
            className="w-full rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#f8d7aa]/55 focus:bg-slate-950/50"
          />
        </label>

        <ActionButton onClick={onStart} disabled={!canStart}>
          Start Game
        </ActionButton>
      </Surface>
    </div>
  );
};

const GameScreen = ({
  game,
  currentChallenge,
  onReveal,
  onRoundOutcome,
  onNext,
  onReset,
}: {
  game: TinyHuntGame;
  currentChallenge: ReturnType<typeof getCurrentChallenge>;
  onReveal: () => void;
  onRoundOutcome: (outcome: RoundOutcome) => void;
  onNext: () => void;
  onReset: () => void;
}) => {
  const result = getResultSummary(game);
  const outcomeLabel = game.outcome ? actionLabelByOutcome[game.outcome] : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <div className="space-y-6">
        <Surface className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#f8d7aa]">Game code</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {game.gameCode || "tiny-hunt"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Same code, same challenge deck. Perfect for playing together without a backend.
              </p>
            </div>
            <ActionButton onClick={onReset} variant="ghost">
              Reset Game
            </ActionButton>
          </div>

          <ProgressBar
            currentIndex={game.currentIndex}
            totalChallenges={game.deck.length}
            player1Score={game.scores.player1}
            player2Score={game.scores.player2}
            player1Name={game.players.player1}
            player2Name={game.players.player2}
          />

          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/25 p-4 text-sm leading-7 text-white/72">
            <p className="uppercase tracking-[0.32em] text-white/42">How to play</p>
            <p className="mt-3">
              Reveal the card, find your proof, then choose who earned the point.
              Keep going until someone reaches {WINNING_SCORE} or the deck runs out.
            </p>
          </div>
        </Surface>

        {outcomeLabel || result ? (
          <Surface className="space-y-3">
            {outcomeLabel ? (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#f8d7aa]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#f8d7aa]">
                  {outcomeLabel}
                </span>
              </div>
            ) : null}
            {result ? (
              <div className="rounded-[1.4rem] border border-[#f8d7aa]/20 bg-[#f8d7aa]/10 p-4 text-sm leading-6 text-white/78">
                <p className="text-base font-semibold text-white">{result.title}</p>
                <p className="mt-2">{result.detail}</p>
              </div>
            ) : null}
          </Surface>
        ) : null}
      </div>

      <Surface className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#f8d7aa]">One challenge at a time</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            {game.isRevealed ? currentChallenge?.category : "Ready?"}
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-6 text-white/62 sm:text-base">
            {game.isRevealed
              ? "Find the funniest, flirtiest proof you can, then award the point."
              : "Tap the card when both of you are ready to flip the next challenge."}
          </p>
        </div>

        <button
          type="button"
          onClick={onReveal}
          disabled={game.isRevealed || Boolean(game.completedAt)}
          className="challenge-scene group block w-full disabled:cursor-default"
        >
          <div className={`challenge-card ${game.isRevealed ? "is-revealed" : ""}`}>
            <div className="card-face card-front">
              <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                <span className="rounded-full border border-[#f8d7aa]/25 bg-[#f8d7aa]/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#f8d7aa]">
                  Challenge {Math.min(game.currentIndex + 1, game.deck.length)}
                </span>
                <div>
                  <h3 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Ready?
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/68 sm:text-base">
                    Breathe in, tap to reveal, and let the tiny scavenger hunt chaos begin.
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.35em] text-white/44">
                  Tap to reveal
                </span>
              </div>
            </div>

            <div className="card-face card-back">
              <div className="flex h-full flex-col justify-between gap-5 text-left">
                <div className="space-y-4">
                  <span className="inline-flex rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.32em] text-[#f8d7aa]">
                    {currentChallenge?.category}
                  </span>
                  <p className="text-2xl font-semibold leading-tight text-white sm:text-[2rem]">
                    {currentChallenge?.prompt}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/28 p-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-white/45">Proof</p>
                  <p className="mt-2 text-sm leading-7 text-white/72 sm:text-base">
                    {currentChallenge?.proof}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </button>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {([
            ["player1", `${game.players.player1} wins point`],
            ["player2", `${game.players.player2} wins point`],
            ["both", "Both win point"],
            ["skip", "Skip"],
          ] as const).map(([outcome, label]) => (
            <ActionButton
              key={outcome}
              onClick={() => onRoundOutcome(outcome)}
              variant={outcome === "skip" ? "ghost" : "secondary"}
              disabled={!game.isRevealed || game.roundResolved || Boolean(game.completedAt)}
            >
              {label}
            </ActionButton>
          ))}
          <ActionButton
            onClick={onNext}
            disabled={!game.roundResolved || Boolean(game.completedAt)}
          >
            Next challenge
          </ActionButton>
        </div>
      </Surface>
    </div>
  );
};

const EndScreen = ({
  game,
  onReset,
}: {
  game: TinyHuntGame;
  onReset: () => void;
}) => {
  const result = getResultSummary(game);
  
  if (!result) {
    return null;
  }

  const { player1, player2 } = game.players;
  const { scores } = game;
  const player1Won = scores.player1 >= WINNING_SCORE;
  const player2Won = scores.player2 >= WINNING_SCORE;
  const isVictory = player1Won || player2Won;
  
  return (
    <div className="relative grid gap-6 lg:grid-cols-1 xl:max-w-3xl xl:mx-auto">
      {/* Animated particles for end screen */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {particleSeeds.concat(particleSeeds).map((particle, index) => (
          <span
            key={index}
            className="floating-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: `${parseFloat(particle.delay) + index * 0.1}s`,
              animationDuration: particle.duration,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      <Surface className="relative space-y-6 text-center overflow-hidden">
        {/* Celebration gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,215,170,0.15),transparent_70%)] animate-pulse" />
        
        <div className="relative space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#f8d7aa] to-[#c17151] mx-auto animate-bounce">
            <span className="text-4xl">{isVictory ? "🎉" : "✨"}</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-[#f8d7aa]">
              {isVictory ? "Victory!" : "Game Complete"}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
              {result.title}
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              {result.detail}
            </p>
          </div>
        </div>

        {/* Score summary */}
        <div className="relative grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
          <div className="rounded-[1.6rem] border border-white/12 bg-slate-950/30 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.28)]">
            <p className="text-xs uppercase tracking-[0.32em] text-white/55 mb-2">{player1}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-3xl font-bold text-white">{scores.player1}</span>
              <span className="h-3 w-3 rounded-full bg-[#f8d7aa]" />
            </div>
            {player1Won && <p className="text-xs text-[#f8d7aa] mt-2">Winner! 👑</p>}
          </div>
          
          <div className="rounded-[1.6rem] border border-white/12 bg-slate-950/30 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.28)]">
            <p className="text-xs uppercase tracking-[0.32em] text-white/55 mb-2">{player2}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-3xl font-bold text-white">{scores.player2}</span>
              <span className="h-3 w-3 rounded-full bg-[#c17151]" />
            </div>
            {player2Won && <p className="text-xs text-[#f8d7aa] mt-2">Winner! 👑</p>}
          </div>
        </div>

        {/* Game stats */}
        <div className="relative rounded-[1.6rem] border border-white/10 bg-slate-950/25 p-5 text-sm leading-7 text-white/72">
          <p className="uppercase tracking-[0.32em] text-white/42 mb-3">Game Summary</p>
          <div className="grid gap-2 text-left">
            <div className="flex justify-between">
              <span>Challenges completed:</span>
              <span className="text-white font-medium">{game.deck.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Game code:</span>
              <span className="text-white font-medium">{game.gameCode || "tiny-hunt"}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="relative">
          <ActionButton onClick={onReset}>
            Start New Game
          </ActionButton>
        </div>
      </Surface>
    </div>
  );
};

export default function TinyHuntApp() {
  const isHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [game, setGame] = useState<TinyHuntGame | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const savedState = window.localStorage.getItem(STORAGE_KEY);
      if (!savedState) {
        return null;
      }

      const parsed = JSON.parse(savedState) as unknown;
      return isTinyHuntGame(parsed) ? parsed : null;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });
  const [form, setForm] = useState<SetupFormState>(initialFormState);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (game) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [game, isHydrated]);

  const currentChallenge = useMemo(() => (game ? getCurrentChallenge(game) : null), [game]);

  const updateGame = (gameUpdater: (currentGame: TinyHuntGame) => TinyHuntGame) => {
    setGame((currentGame) => (currentGame ? gameUpdater(currentGame) : currentGame));
  };

  const startGame = () => {
    setGame(createGame(form));
  };

  const resetGame = () => {
    setGame(null);
    setForm(initialFormState);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  if (!isHydrated) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f172a] px-6 py-10 text-white">
        <AmbientBackdrop />
        <Surface className="relative z-10 max-w-lg text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#f8d7aa]">Tiny Hunt</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Restoring the mood…</h1>
        </Surface>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#081018_0%,#112033_45%,#251d28_100%)] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <AmbientBackdrop />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col justify-center">
        {game ? (
          game.completedAt ? (
            <EndScreen game={game} onReset={resetGame} />
          ) : (
            <GameScreen
              game={game}
              currentChallenge={currentChallenge}
              onReveal={() => updateGame(revealChallenge)}
              onRoundOutcome={(outcome) => updateGame((current) => applyRoundOutcome(current, outcome))}
              onNext={() => updateGame(advanceToNextChallenge)}
              onReset={resetGame}
            />
          )
        ) : (
          <SetupScreen form={form} setForm={setForm} onStart={startGame} />
        )}
      </div>
    </main>
  );
}
