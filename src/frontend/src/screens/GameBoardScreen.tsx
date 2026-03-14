import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Coins,
  Flame,
  Pause,
  Search,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FloatingCoins } from "../components/FloatingCoins";
import { useLanguage } from "../contexts/LanguageContext";
import { useGameState } from "../hooks/useGameState";
import type { CellType, PowerupCounts, Universe } from "../types";
import { SKINS } from "./CollectionScreen";

interface GameBoardScreenProps {
  level: number;
  universe: Universe;
  coins: number;
  powerupCounts: PowerupCounts;
  onWin: (stars: number, coinsEarned: number, powerupUsed: boolean) => void;
  onLose: () => void;
  onBack: () => void;
  onPowerupUse: (type: "detector" | "multiplier" | "shield") => void;
  activeSkin?: string;
}

const CELL_ICONS: Record<CellType, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  diamond: "💎",
  bomb: "💣",
  chain_bomb: "⛓️💣",
  frozen: "🧊",
  dark: "🌑",
};

const CELL_POINTS_LABEL: Record<CellType, string> = {
  bronze: "+5",
  silver: "+15",
  gold: "+30",
  diamond: "+60",
  bomb: "💥",
  chain_bomb: "💥💥",
  frozen: "—",
  dark: "—",
};

const UNIVERSE_CONFETTI_COLORS: Record<Universe, string[]> = {
  candy: [
    "oklch(0.72 0.25 340)",
    "oklch(0.84 0.22 75)",
    "oklch(0.75 0.20 290)",
    "oklch(0.65 0.22 170)",
    "oklch(0.90 0.20 80)",
  ],
  jungle: [
    "oklch(0.62 0.22 148)",
    "oklch(0.82 0.20 148)",
    "oklch(0.45 0.18 160)",
    "oklch(0.75 0.18 120)",
    "oklch(0.90 0.20 80)",
  ],
  crystal: [
    "oklch(0.75 0.22 215)",
    "oklch(0.85 0.18 220)",
    "oklch(0.65 0.20 230)",
    "oklch(0.90 0.15 200)",
    "oklch(0.80 0.20 245)",
  ],
  inferno: [
    "oklch(0.75 0.28 20)",
    "oklch(0.85 0.24 45)",
    "oklch(0.70 0.26 30)",
    "oklch(0.90 0.22 55)",
    "oklch(0.65 0.28 15)",
  ],
  void: [
    "oklch(0.62 0.22 285)",
    "oklch(0.45 0.18 300)",
    "oklch(0.78 0.16 285)",
    "oklch(0.35 0.14 310)",
    "oklch(0.85 0.12 290)",
  ],
  neon: [
    "oklch(0.75 0.28 155)",
    "oklch(0.65 0.26 330)",
    "oklch(0.78 0.24 200)",
    "oklch(0.90 0.22 80)",
    "oklch(0.70 0.28 25)",
  ],
};

const CONFETTI_SEEDS = [
  { angle: 0, dist: 70 },
  { angle: 30, dist: 90 },
  { angle: 60, dist: 75 },
  { angle: 90, dist: 85 },
  { angle: 120, dist: 80 },
  { angle: 150, dist: 95 },
  { angle: 180, dist: 70 },
  { angle: 210, dist: 88 },
  { angle: 240, dist: 75 },
  { angle: 270, dist: 90 },
  { angle: 300, dist: 82 },
  { angle: 330, dist: 78 },
];

function ConfettiBurst({ universe }: { universe: Universe }) {
  const colors = UNIVERSE_CONFETTI_COLORS[universe];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {CONFETTI_SEEDS.map((seed, i) => {
        const rad = (seed.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * seed.dist;
        const ty = Math.sin(rad) * seed.dist;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={`confetti-${seed.angle}`}
            className="absolute left-1/2 top-1/3"
            style={{
              width: 8,
              height: 8,
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0%",
              background: color,
              marginLeft: -4,
              marginTop: -4,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: tx,
              y: ty,
              scale: [1, 1.2, 0],
              opacity: [1, 1, 0],
              rotate: seed.angle * 2,
            }}
            transition={{
              duration: 0.9,
              delay: i * 0.03,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

function StarDisplay({
  count,
  universe,
}: { count: number; universe: Universe }) {
  const starIds = ["s1", "s2", "s3"];
  const delays = [0.3, 0.5, 0.7];
  return (
    <div className="flex gap-1 justify-center">
      {starIds.map((sid, idx) => {
        const s = idx + 1;
        return (
          <motion.div
            key={sid}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: s <= count ? [0, 1.4, 1] : 0.6,
              opacity: s <= count ? 1 : 0.3,
            }}
            transition={{
              delay: delays[idx],
              duration: 0.4,
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
          >
            <Star
              className={`w-8 h-8 ${
                s <= count
                  ? universe === "jungle"
                    ? "fill-jungle-gold text-jungle-gold"
                    : universe === "crystal"
                      ? "fill-crystal-gold text-crystal-gold"
                      : universe === "inferno"
                        ? "fill-inferno-gold text-inferno-gold"
                        : "star-filled fill-candy-gold"
                  : "star-empty"
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function BurnTimerBar({
  timeLeft,
  label,
}: { timeLeft: number; label: string }) {
  const pct = Math.max(0, (timeLeft / 40) * 100);
  const danger = timeLeft <= 10;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      data-ocid="game.inferno_timer_panel"
      className="mb-3 rounded-2xl px-4 py-2 border"
      style={{
        background: danger
          ? "oklch(0.18 0.12 20 / 0.9)"
          : "oklch(0.16 0.08 30 / 0.8)",
        borderColor: danger ? "oklch(0.65 0.24 20)" : "oklch(0.50 0.18 35)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Flame
            className="w-4 h-4"
            style={{
              color: danger ? "oklch(0.70 0.25 20)" : "oklch(0.75 0.22 40)",
            }}
          />
          <span
            className="text-xs font-display font-bold"
            style={{
              color: danger ? "oklch(0.70 0.25 20)" : "oklch(0.82 0.18 40)",
            }}
          >
            {label}
          </span>
        </div>
        <motion.span
          className="font-display font-extrabold text-lg"
          style={{
            color: danger ? "oklch(0.75 0.28 20)" : "oklch(0.90 0.20 40)",
          }}
          animate={danger ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        >
          {timeLeft}s
        </motion.span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden bg-muted">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
          style={{
            background: danger
              ? "linear-gradient(90deg, oklch(0.55 0.24 20), oklch(0.70 0.28 15))"
              : "linear-gradient(90deg, oklch(0.65 0.22 35), oklch(0.78 0.24 50))",
          }}
        />
      </div>
    </motion.div>
  );
}

export function GameBoardScreen({
  level,
  universe,
  coins,
  powerupCounts,
  onWin,
  onLose,
  onBack,
  onPowerupUse,
  activeSkin = "classic",
}: GameBoardScreenProps) {
  const { t } = useLanguage();
  const [showPause, setShowPause] = useState(false);

  // Resolve active skin definition (null = use default CSS classes)
  const skinDef =
    activeSkin !== "classic"
      ? (SKINS.find((s) => s.id === activeSkin) ?? null)
      : null;

  const getCellStyle = (
    revealed: boolean,
    type: CellType,
  ): React.CSSProperties => {
    if (!skinDef) return {};
    if (revealed) {
      if (type === "bomb" || type === "chain_bomb") return skinDef.bombStyle;
      return skinDef.openedStyle;
    }
    if (type === "frozen") return {};
    return skinDef.closedStyle;
  };

  const {
    grid,
    score,
    phase,
    activePowerups,
    anyPowerupUsed,
    isBoss,
    target,
    gridSize,
    starsEarned,
    burnTimeLeft,
    frozenTappedIndex,
    darkenedCells,
    voidDarkenCountdown,
    showVirusNotification,
    revealCell,
    activatePowerup,
    resetGame,
    showDetectorWarning,
  } = useGameState(level, universe, showPause);

  const [showFloatingCoins, setShowFloatingCoins] = useState(false);

  useEffect(() => {
    if (phase === "won") {
      setShowFloatingCoins(true);
      const timer = setTimeout(() => setShowFloatingCoins(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const POWERUP_DEFS = [
    {
      type: "detector" as const,
      icon: Search,
      label: t("game.powerup.detect"),
      ocid: "game.powerup_detector_button",
    },
    {
      type: "multiplier" as const,
      icon: Zap,
      label: t("game.powerup.multiplier"),
      ocid: "game.powerup_multiplier_button",
    },
    {
      type: "shield" as const,
      icon: Shield,
      label: t("game.powerup.shield"),
      ocid: "game.powerup_shield_button",
    },
  ];

  const bgClass =
    universe === "jungle"
      ? "jungle-bg"
      : universe === "crystal"
        ? "crystal-bg"
        : universe === "inferno"
          ? "inferno-bg"
          : universe === "void"
            ? "void-bg"
            : universe === "neon"
              ? "neon-bg"
              : "candy-bg";
  const progressClass =
    universe === "jungle"
      ? "progress-jungle"
      : universe === "crystal"
        ? "progress-crystal"
        : universe === "inferno"
          ? "progress-inferno"
          : universe === "void"
            ? "progress-void"
            : universe === "neon"
              ? "progress-neon"
              : "progress-candy";
  const progressPct = Math.min(100, Math.round((score / target) * 100));
  const coinsEarned =
    starsEarned === 3
      ? 35
      : starsEarned === 2
        ? 20
        : starsEarned === 1
          ? 10
          : 0;
  const totalCoins = coinsEarned + (isBoss && starsEarned > 0 ? 100 : 0);

  const bossLabel =
    universe === "jungle"
      ? t("game.boss.jungle")
      : universe === "crystal"
        ? t("game.boss.crystal")
        : universe === "inferno"
          ? t("game.boss.inferno")
          : universe === "void"
            ? t("game.boss.void")
            : universe === "neon"
              ? t("game.boss.neon")
              : t("game.boss.candy");

  const levelEmoji =
    universe === "jungle"
      ? "🌿"
      : universe === "crystal"
        ? "💎"
        : universe === "inferno"
          ? "🔥"
          : universe === "void"
            ? "🌑"
            : universe === "neon"
              ? "⚡"
              : "🍭";
  const levelLabel = `${levelEmoji} ${t("levelSelect.level")} ${level}`;

  const handleActivatePowerup = (
    type: "detector" | "multiplier" | "shield",
  ) => {
    if (powerupCounts[type] <= 0 || activePowerups[type]) return;
    onPowerupUse(type);
    activatePowerup(type);
  };

  const gridColsClass =
    gridSize === 10
      ? "grid-cols-10"
      : gridSize === 9
        ? "grid-cols-9"
        : gridSize === 8
          ? "grid-cols-8"
          : gridSize === 7
            ? "grid-cols-7"
            : gridSize === 6
              ? "grid-cols-6"
              : "grid-cols-5";
  const cellSizeClass =
    gridSize >= 9
      ? "rounded-sm"
      : gridSize >= 8
        ? "rounded-md"
        : gridSize >= 7
          ? "rounded-lg"
          : "rounded-2xl";

  const winEmoji =
    universe === "crystal"
      ? "💎"
      : universe === "inferno"
        ? "🔥"
        : universe === "jungle"
          ? "🌿"
          : universe === "void"
            ? "🌌"
            : universe === "neon"
              ? "⚡"
              : "🎉";

  const loseEmoji =
    universe === "inferno" && isBoss
      ? "🌋"
      : universe === "jungle" && isBoss
        ? "⛓️"
        : universe === "crystal" && isBoss
          ? "🧊"
          : universe === "void" && isBoss
            ? "🌑"
            : universe === "neon" && isBoss
              ? "💀"
              : "💥";
  const loseTitle =
    universe === "inferno" && isBoss
      ? t("game.lose.burnedAlive")
      : universe === "jungle"
        ? t("game.lose.chainReaction")
        : universe === "crystal" && isBoss
          ? t("game.lose.frozenSolid")
          : universe === "void" && isBoss
            ? t("game.lose.voidConsumed")
            : universe === "neon" && isBoss
              ? t("game.lose.virusSpread")
              : t("game.lose.boom");
  const loseMsg =
    universe === "inferno" && isBoss
      ? t("game.lose.infernoMsg")
      : universe === "jungle"
        ? t("game.lose.chainBombs")
        : universe === "crystal" && isBoss
          ? t("game.lose.frozenMsg")
          : universe === "void" && isBoss
            ? t("game.lose.voidMsg")
            : universe === "neon" && isBoss
              ? t("game.lose.virusMsg")
              : t("game.lose.hitBomb");

  // Universe-specific face-down tile class
  const faceDownClass = `cell-face-down-${universe}`;

  return (
    <div
      className={`min-h-screen ${bgClass} flex flex-col px-3 py-4 relative overflow-hidden`}
    >
      {/* Top HUD */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          data-ocid="game.back_button"
          onClick={() => setShowPause(true)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <span className="font-display font-bold text-sm text-foreground">
            {isBoss ? bossLabel : levelLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-card/80 rounded-full px-3 py-1.5">
            <Coins className="w-3.5 h-3.5 text-candy-gold" />
            <span className="font-bold text-xs text-candy-gold">{coins}</span>
          </div>
          <button
            type="button"
            data-ocid="game.pause_button"
            onClick={() => setShowPause(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground active:scale-95"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inferno Boss Burn Timer */}
      {burnTimeLeft !== null && (
        <BurnTimerBar timeLeft={burnTimeLeft} label={t("game.infernoTimer")} />
      )}

      {/* Void Boss Darkening Countdown */}
      {universe === "void" &&
        isBoss &&
        voidDarkenCountdown !== null &&
        phase === "playing" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 px-4 py-2 rounded-2xl border flex items-center justify-between"
            style={{
              background: "oklch(0.14 0.10 290 / 0.8)",
              borderColor: "oklch(0.40 0.16 285)",
            }}
          >
            <span
              className="text-xs font-display font-bold"
              style={{ color: "oklch(0.78 0.18 285)" }}
            >
              🌑 {t("game.voidDarken")}
            </span>
            <span
              className="font-display font-extrabold text-lg"
              style={{ color: "oklch(0.82 0.20 285)" }}
            >
              {voidDarkenCountdown}s
            </span>
          </motion.div>
        )}

      {/* Neon Boss Virus Notification */}
      <AnimatePresence>
        {universe === "neon" && isBoss && showVirusNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-2 px-4 py-2 rounded-2xl border text-center"
            style={{
              background: "oklch(0.16 0.14 155 / 0.9)",
              borderColor: "oklch(0.55 0.26 155)",
            }}
          >
            <span
              className="font-display font-extrabold text-sm"
              style={{ color: "oklch(0.82 0.26 155)" }}
            >
              ⚡ {t("game.virusSpread")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score HUD */}
      <div className="mb-3 bg-card/60 rounded-2xl px-4 py-3 border border-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground text-xs font-medium">
            {t("game.score")}
          </span>
          <span className="font-display font-bold text-lg text-foreground">
            {score}
          </span>
          <span className="text-muted-foreground text-xs">
            {t("game.target")}: {target}
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden bg-muted">
          <motion.div
            className={`h-full rounded-full ${progressClass}`}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">⭐ {target}</span>
          <span className="text-[10px] text-muted-foreground">
            ⭐⭐ {Math.round(target * 1.5)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            ⭐⭐⭐ {target * 2}
          </span>
        </div>
      </div>

      {/* Powerup bar */}
      <div className="flex gap-2 mb-3 justify-center">
        {POWERUP_DEFS.map(({ type, icon: Icon, label, ocid }) => {
          const active = activePowerups[type];
          const available = powerupCounts[type] > 0 && !active;
          return (
            <div key={type} className="flex-1 relative">
              {active && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-accent pointer-events-none"
                  animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                />
              )}
              <button
                type="button"
                data-ocid={ocid}
                disabled={!available}
                onClick={() => handleActivatePowerup(type)}
                className={`w-full min-h-[44px] flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all active:scale-95 ${
                  active
                    ? "bg-accent/20 border-accent text-accent shadow-mint"
                    : available
                      ? "bg-card border-border text-foreground hover:bg-secondary active:scale-95"
                      : "bg-card/40 border-border/40 text-muted-foreground opacity-50 cursor-not-allowed"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-semibold">
                  {active ? t("game.powerup.on") : label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ×{powerupCounts[type]}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Game grid */}
      <div className={`grid ${gridColsClass} gap-1.5 flex-1`}>
        {grid.map((cell, i) => {
          const warning = showDetectorWarning(i);
          const isExploded =
            cell.revealed &&
            (cell.type === "bomb" || cell.type === "chain_bomb");
          const isChainBomb = cell.type === "chain_bomb";
          const isFrozen = cell.type === "frozen";
          const isDisguised = !cell.revealed && !!cell.disguisedAs;
          const isShaking = frozenTappedIndex === i;
          const isDarkened = !cell.revealed && darkenedCells.has(i);

          return (
            <motion.button
              key={cell.id}
              type="button"
              data-ocid={`game.cell.${i + 1}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: isShaking ? [0, -4, 4, -4, 4, 0] : 0,
              }}
              transition={{
                delay: isShaking ? 0 : i * 0.01,
                duration: isShaking ? 0.4 : undefined,
                type: isShaking ? "tween" : "spring",
                stiffness: isShaking ? undefined : 300,
                damping: isShaking ? undefined : 20,
              }}
              disabled={cell.revealed || phase !== "playing"}
              onClick={() => revealCell(i)}
              className={`aspect-square ${cellSizeClass} flex flex-col items-center justify-center gap-0.5 relative overflow-hidden
                ${
                  cell.revealed
                    ? isExploded
                      ? isChainBomb
                        ? "cell-chain-exploded"
                        : "cell-bomb-exploded"
                      : `cell-${cell.type}`
                    : isFrozen
                      ? "cell-frozen"
                      : isDarkened
                        ? "cell-void-darkened"
                        : warning
                          ? `${faceDownClass} cell-warning`
                          : faceDownClass
                }`}
              style={getCellStyle(cell.revealed, cell.type)}
            >
              <AnimatePresence>
                {cell.revealed && (
                  <motion.div
                    key="revealed"
                    initial={{ scale: 0, rotateY: 90 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex flex-col items-center"
                  >
                    <span
                      className={
                        gridSize >= 7
                          ? "text-base leading-none"
                          : gridSize === 6
                            ? "text-lg leading-none"
                            : "text-xl leading-none"
                      }
                    >
                      {CELL_ICONS[cell.type]}
                    </span>
                    <span className="text-[9px] font-bold text-white/90 leading-none mt-0.5">
                      {CELL_POINTS_LABEL[cell.type]}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              {!cell.revealed && isFrozen && (
                <motion.span
                  className={gridSize >= 7 ? "text-base" : "text-xl"}
                  animate={isShaking ? { rotate: [0, -10, 10, -10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  🧊
                </motion.span>
              )}
              {!cell.revealed && isDisguised && (
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <span
                    className={
                      gridSize >= 7
                        ? "text-base leading-none"
                        : gridSize === 6
                          ? "text-lg leading-none"
                          : "text-xl leading-none"
                    }
                  >
                    {CELL_ICONS[cell.disguisedAs!]}
                  </span>
                </motion.div>
              )}
              {isDarkened && !cell.revealed && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span className="text-lg">🌑</span>
                </motion.div>
              )}
              {!cell.revealed && !isFrozen && !isDarkened && warning && (
                <motion.div
                  className={`absolute inset-0 ${cellSizeClass}`}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  style={{ background: "oklch(0.60 0.22 20 / 0.25)" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {phase === "lost" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ background: "oklch(0.08 0.04 280 / 0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.6, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              data-ocid="game_over.dialog"
              className="mx-6 rounded-3xl p-6 w-full max-w-sm border border-destructive/30"
              style={{ background: "oklch(0.16 0.06 280)" }}
            >
              <div className="text-center">
                <div className="text-6xl mb-3">{loseEmoji}</div>
                <h2 className="font-display font-extrabold text-2xl text-foreground mb-1">
                  {loseTitle}
                </h2>
                <p className="text-muted-foreground text-sm mb-2">{loseMsg}</p>
                <p className="text-foreground font-bold text-lg mb-6">
                  {t("game.lose.score")}: {score}
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    data-ocid="game_over.retry_button"
                    onClick={resetGame}
                    className="h-12 rounded-2xl font-display font-bold bg-primary text-primary-foreground active:scale-95 transition-transform"
                  >
                    {t("game.lose.tryAgain")}
                  </Button>
                  <Button
                    data-ocid="game_over.back_button"
                    variant="outline"
                    onClick={onLose}
                    className="h-11 rounded-2xl font-medium border-border active:scale-95 transition-transform"
                  >
                    {t("game.lose.backToLevels")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win Modal */}
      <AnimatePresence>
        {phase === "won" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ background: "oklch(0.08 0.04 280 / 0.85)" }}
          >
            <ConfettiBurst universe={universe} />
            <FloatingCoins active={showFloatingCoins} amount={totalCoins} />
            <motion.div
              initial={{ scale: 0.6, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              data-ocid="game_over.dialog"
              className="mx-6 rounded-3xl p-6 w-full max-w-sm border border-accent/30 relative"
              style={{ background: "oklch(0.16 0.06 280)" }}
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  {winEmoji}
                </motion.div>
                <h2 className="font-display font-extrabold text-2xl text-foreground mb-1">
                  {t("game.win.title")}
                </h2>
                <p className="text-muted-foreground text-sm mb-3">
                  {t("game.win.subtitle", { level })}
                </p>
                <StarDisplay count={starsEarned} universe={universe} />
                <div className="mt-4 mb-4 flex justify-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-muted-foreground text-xs">
                      {t("game.win.score")}
                    </div>
                    <div className="font-display font-bold text-foreground">
                      {score}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground text-xs">
                      {t("game.win.coins")}
                    </div>
                    <div className="font-display font-bold text-candy-gold flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      {totalCoins}
                    </div>
                  </div>
                </div>
                {isBoss && (
                  <div className="text-xs text-primary font-semibold mb-3">
                    {t("game.win.bossBonus")}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {level < 21 && (
                    <Button
                      data-ocid="game_over.next_button"
                      onClick={() =>
                        onWin(starsEarned, totalCoins, anyPowerupUsed)
                      }
                      className="h-12 rounded-2xl font-display font-bold bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 transition-transform"
                    >
                      {t("game.win.nextLevel")}
                    </Button>
                  )}
                  <Button
                    data-ocid="game_over.retry_button"
                    variant="outline"
                    onClick={resetGame}
                    className="h-11 rounded-2xl font-medium border-border active:scale-95 transition-transform"
                  >
                    {t("game.win.playAgain")}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      onWin(starsEarned, totalCoins, anyPowerupUsed)
                    }
                    className="h-10 rounded-2xl text-sm text-muted-foreground active:scale-95 transition-transform"
                  >
                    {t("game.win.backToLevels")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Modal */}
      <AnimatePresence>
        {showPause && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ background: "oklch(0.08 0.04 280 / 0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              data-ocid="game.pause.dialog"
              className="mx-6 rounded-3xl p-6 w-full max-w-sm border border-border"
              style={{ background: "oklch(0.16 0.06 280)" }}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">⏸</div>
                <h2 className="font-display font-extrabold text-2xl text-foreground mb-6">
                  {t("game.pause.title")}
                </h2>
                <div className="flex flex-col gap-3">
                  <Button
                    data-ocid="game.pause.resume_button"
                    onClick={() => setShowPause(false)}
                    className="h-12 rounded-2xl font-display font-bold bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 transition-transform"
                  >
                    ▶ {t("game.pause.resume")}
                  </Button>
                  <Button
                    data-ocid="game.pause.restart_button"
                    variant="outline"
                    onClick={() => {
                      setShowPause(false);
                      resetGame();
                    }}
                    className="h-12 rounded-2xl font-display font-bold border-border active:scale-95 transition-transform"
                  >
                    🔄 {t("game.pause.restart")}
                  </Button>
                  <Button
                    data-ocid="game.pause.quit_button"
                    variant="ghost"
                    onClick={() => {
                      setShowPause(false);
                      onBack();
                    }}
                    className="h-11 rounded-2xl text-sm text-muted-foreground active:scale-95 transition-transform"
                  >
                    ← {t("game.pause.quit")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
