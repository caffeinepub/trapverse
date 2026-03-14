import { ArrowLeft, Lock, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  LEVEL_TARGETS,
  LEVEL_TARGETS_CRYSTAL,
  LEVEL_TARGETS_INFERNO,
  LEVEL_TARGETS_JUNGLE,
  LEVEL_TARGETS_NEON,
  LEVEL_TARGETS_VOID,
  type LevelStar,
  type Universe,
} from "../types";

interface LevelSelectScreenProps {
  universe: Universe;
  levelStars: LevelStar[];
  onSelect: (level: number) => void;
  onBack: () => void;
}

function StarRow({ stars, universe }: { stars: number; universe: Universe }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {["s1", "s2", "s3"].map((sid, idx) => {
        const s = idx + 1;
        return (
          <Star
            key={sid}
            className={`w-3 h-3 ${
              s <= stars
                ? universe === "jungle"
                  ? "fill-jungle-gold text-jungle-gold"
                  : universe === "crystal"
                    ? "fill-crystal-gold text-crystal-gold"
                    : universe === "inferno"
                      ? "fill-inferno-gold text-inferno-gold"
                      : universe === "void"
                        ? "fill-[oklch(0.82_0.16_285)] text-[oklch(0.82_0.16_285)]"
                        : universe === "neon"
                          ? "fill-[oklch(0.82_0.22_155)] text-[oklch(0.82_0.22_155)]"
                          : "star-filled fill-candy-gold"
                : "star-empty"
            }`}
          />
        );
      })}
    </div>
  );
}

const UNIVERSE_CONFIG = {
  candy: {
    bg: "candy-bg",
    levelIcon: "🍭",
    bossIcon: "💀",
    completedIcon: "⭐",
    lockedIcon: "🔒",
    cellNormal:
      "linear-gradient(135deg, oklch(0.22 0.08 290), oklch(0.18 0.06 280))",
    cellCompleted:
      "linear-gradient(135deg, oklch(0.28 0.14 200), oklch(0.22 0.10 220))",
    cellBoss:
      "linear-gradient(135deg, oklch(0.30 0.18 340), oklch(0.22 0.14 310))",
    cellLocked: "oklch(0.18 0.05 280)",
    borderNormal: "oklch(0.32 0.09 285)",
    borderCompleted: "oklch(0.45 0.12 200)",
    borderBoss: "oklch(0.55 0.22 340)",
    borderLocked: "oklch(0.25 0.05 280)",
    titleIcon: "🍭",
  },
  jungle: {
    bg: "jungle-bg",
    levelIcon: "🌿",
    bossIcon: "🐍",
    completedIcon: "✅",
    lockedIcon: "🔒",
    cellNormal:
      "linear-gradient(135deg, oklch(0.20 0.10 152), oklch(0.16 0.07 158))",
    cellCompleted:
      "linear-gradient(135deg, oklch(0.26 0.12 145), oklch(0.20 0.09 155))",
    cellBoss:
      "linear-gradient(135deg, oklch(0.28 0.16 148), oklch(0.20 0.12 160))",
    cellLocked: "oklch(0.16 0.05 155)",
    borderNormal: "oklch(0.35 0.10 150)",
    borderCompleted: "oklch(0.48 0.15 148)",
    borderBoss: "oklch(0.55 0.20 148)",
    borderLocked: "oklch(0.22 0.05 155)",
    titleIcon: "🌿",
  },
  crystal: {
    bg: "crystal-bg",
    levelIcon: "💎",
    bossIcon: "❄️",
    completedIcon: "✅",
    lockedIcon: "🔒",
    cellNormal:
      "linear-gradient(135deg, oklch(0.20 0.09 220), oklch(0.16 0.07 230))",
    cellCompleted:
      "linear-gradient(135deg, oklch(0.26 0.14 215), oklch(0.20 0.11 225))",
    cellBoss:
      "linear-gradient(135deg, oklch(0.28 0.18 210), oklch(0.20 0.14 220))",
    cellLocked: "oklch(0.16 0.05 225)",
    borderNormal: "oklch(0.35 0.10 220)",
    borderCompleted: "oklch(0.50 0.16 215)",
    borderBoss: "oklch(0.60 0.22 210)",
    borderLocked: "oklch(0.22 0.05 225)",
    titleIcon: "💎",
  },
  inferno: {
    bg: "inferno-bg",
    levelIcon: "🔥",
    bossIcon: "☀️",
    completedIcon: "✅",
    lockedIcon: "🔒",
    cellNormal:
      "linear-gradient(135deg, oklch(0.22 0.12 30), oklch(0.18 0.09 20))",
    cellCompleted:
      "linear-gradient(135deg, oklch(0.28 0.16 28), oklch(0.22 0.12 18))",
    cellBoss:
      "linear-gradient(135deg, oklch(0.32 0.20 25), oklch(0.24 0.16 15))",
    cellLocked: "oklch(0.18 0.06 20)",
    borderNormal: "oklch(0.38 0.14 28)",
    borderCompleted: "oklch(0.55 0.20 25)",
    borderBoss: "oklch(0.65 0.26 20)",
    borderLocked: "oklch(0.25 0.06 20)",
    titleIcon: "🔥",
  },
  void: {
    bg: "void-bg",
    levelIcon: "🌑",
    bossIcon: "🌀",
    completedIcon: "✨",
    lockedIcon: "🔒",
    cellNormal:
      "linear-gradient(135deg, oklch(0.16 0.10 290), oklch(0.12 0.08 305))",
    cellCompleted:
      "linear-gradient(135deg, oklch(0.22 0.14 288), oklch(0.16 0.10 300))",
    cellBoss:
      "linear-gradient(135deg, oklch(0.26 0.18 285), oklch(0.18 0.14 300))",
    cellLocked: "oklch(0.12 0.05 295)",
    borderNormal: "oklch(0.32 0.12 288)",
    borderCompleted: "oklch(0.48 0.16 285)",
    borderBoss: "oklch(0.58 0.22 282)",
    borderLocked: "oklch(0.20 0.06 292)",
    titleIcon: "🌑",
  },
  neon: {
    bg: "neon-bg",
    levelIcon: "⚡",
    bossIcon: "🧬",
    completedIcon: "✅",
    lockedIcon: "🔒",
    cellNormal:
      "linear-gradient(135deg, oklch(0.14 0.08 160), oklch(0.10 0.06 175))",
    cellCompleted:
      "linear-gradient(135deg, oklch(0.20 0.14 158), oklch(0.14 0.10 170))",
    cellBoss:
      "linear-gradient(135deg, oklch(0.22 0.18 155), oklch(0.16 0.14 168))",
    cellLocked: "oklch(0.10 0.04 165)",
    borderNormal: "oklch(0.38 0.18 158)",
    borderCompleted: "oklch(0.52 0.22 155)",
    borderBoss: "oklch(0.65 0.26 152)",
    borderLocked: "oklch(0.22 0.08 162)",
    titleIcon: "⚡",
  },
};

function getTargets(universe: Universe) {
  switch (universe) {
    case "jungle":
      return LEVEL_TARGETS_JUNGLE;
    case "crystal":
      return LEVEL_TARGETS_CRYSTAL;
    case "inferno":
      return LEVEL_TARGETS_INFERNO;
    case "void":
      return LEVEL_TARGETS_VOID;
    case "neon":
      return LEVEL_TARGETS_NEON;
    default:
      return LEVEL_TARGETS;
  }
}

export function LevelSelectScreen({
  universe,
  levelStars,
  onSelect,
  onBack,
}: LevelSelectScreenProps) {
  const { t } = useLanguage();
  const cfg = UNIVERSE_CONFIG[universe];
  const targets = getTargets(universe);
  const [savedLevel, setSavedLevel] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("trapverse_level_save");
      if (!raw) {
        setSavedLevel(null);
        return;
      }
      const data = JSON.parse(raw);
      if (data.universe === universe && typeof data.level === "number") {
        setSavedLevel(data.level);
      } else {
        setSavedLevel(null);
      }
    } catch {
      setSavedLevel(null);
    }
  }, [universe]);

  const universeNameKey = `home.universe.${universe}.name`;

  const bossGlowClass =
    universe === "jungle"
      ? "jungle-boss-glow"
      : universe === "crystal"
        ? "crystal-boss-glow"
        : universe === "inferno"
          ? "inferno-boss-glow"
          : universe === "void"
            ? "void-boss-glow"
            : universe === "neon"
              ? "neon-boss-glow"
              : "boss-glow";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen ${cfg.bg} flex flex-col px-4 py-6 relative overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          type="button"
          data-ocid="level_select.back_button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-xl active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm">{t("levelSelect.back")}</span>
        </motion.button>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h1 className="font-display font-bold text-xl text-foreground">
            {cfg.titleIcon} {t(universeNameKey)}
          </h1>
          <p className="text-muted-foreground text-xs">
            {t("levelSelect.chooseLevel")}
          </p>
        </motion.div>
        <div className="w-16" />
      </div>

      {/* Level grid */}
      <div className="grid grid-cols-3 gap-3 flex-1">
        {Array.from({ length: 21 }, (_, i) => {
          const level = i + 1;
          const isBoss = level === 21;
          const progress = levelStars[i] ?? { stars: 0, completed: false };
          const prevCompleted =
            i === 0 || (levelStars[i - 1]?.completed ?? false);
          const locked = !prevCompleted && level !== 1;
          const target = targets[i];

          return (
            <motion.button
              key={level}
              type="button"
              data-ocid={`level_select.item.${level}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 200 }}
              disabled={locked}
              onClick={() => !locked && onSelect(level)}
              className={`relative rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all active:scale-95
                ${locked ? "opacity-40 cursor-not-allowed" : isBoss ? `${bossGlowClass} cursor-pointer` : "cursor-pointer hover:brightness-110"}`}
              style={{
                background: locked
                  ? cfg.cellLocked
                  : isBoss
                    ? cfg.cellBoss
                    : progress.completed
                      ? cfg.cellCompleted
                      : cfg.cellNormal,
                border: `1.5px solid ${locked ? cfg.borderLocked : isBoss ? cfg.borderBoss : progress.completed ? cfg.borderCompleted : cfg.borderNormal}`,
              }}
            >
              {locked && (
                <Lock className="absolute top-2 right-2 w-3 h-3 text-muted-foreground" />
              )}
              {!locked && savedLevel === level && (
                <div
                  className="absolute top-1 right-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold z-10"
                  style={{
                    background: "oklch(0.42 0.18 148)",
                    color: "oklch(0.95 0.10 148)",
                  }}
                >
                  ▶
                </div>
              )}
              {isBoss && !locked && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-display font-bold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {t("levelSelect.boss")}
                </span>
              )}
              <span className="text-2xl">
                {locked
                  ? cfg.lockedIcon
                  : isBoss
                    ? cfg.bossIcon
                    : progress.completed
                      ? cfg.completedIcon
                      : cfg.levelIcon}
              </span>
              <span className="font-display font-bold text-sm text-foreground">
                {isBoss
                  ? t("levelSelect.bossLabel")
                  : `${t("levelSelect.level")} ${level}`}
              </span>
              <StarRow stars={progress.stars} universe={universe} />
              <span className="text-muted-foreground text-[10px]">
                {target} {t("levelSelect.pts")}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
