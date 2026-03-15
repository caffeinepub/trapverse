import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import type { GameStats, LevelStar } from "../types";

interface UniverseStars {
  candy: LevelStar[];
  jungle: LevelStar[];
  crystal: LevelStar[];
  inferno: LevelStar[];
  void: LevelStar[];
  neon: LevelStar[];
  shadow: LevelStar[];
  quantum: LevelStar[];
  labyrinth: LevelStar[];
  frozen: LevelStar[];
}

interface StatsScreenProps {
  stats: GameStats;
  onBack: () => void;
  universeStars?: UniverseStars;
}

interface StatRowProps {
  icon: string;
  label: string;
  value: string | number;
  ocid: string;
  delay: number;
}

function StatRow({ icon, label, value, ocid, delay }: StatRowProps) {
  return (
    <motion.div
      data-ocid={ocid}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 p-4 rounded-2xl border"
      style={{
        background: "oklch(0.14 0.05 280)",
        borderColor: "oklch(0.22 0.06 280)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: "oklch(0.20 0.07 280)" }}
      >
        {icon}
      </div>
      <span className="flex-1 text-sm text-muted-foreground font-medium">
        {label}
      </span>
      <span className="font-display font-bold text-lg text-foreground">
        {value}
      </span>
    </motion.div>
  );
}

const UNIVERSE_META: {
  key: keyof UniverseStars;
  emoji: string;
  name: string;
  color: string;
}[] = [
  {
    key: "candy",
    emoji: "🍭",
    name: "Candy Cosmos",
    color: "oklch(0.65 0.25 340)",
  },
  {
    key: "jungle",
    emoji: "🌿",
    name: "Mystic Jungle",
    color: "oklch(0.6 0.22 140)",
  },
  {
    key: "crystal",
    emoji: "💎",
    name: "Crystal Storm",
    color: "oklch(0.65 0.2 220)",
  },
  {
    key: "inferno",
    emoji: "🔥",
    name: "Solar Inferno",
    color: "oklch(0.65 0.25 50)",
  },
  {
    key: "void",
    emoji: "⬛",
    name: "Void Abyss",
    color: "oklch(0.55 0.2 280)",
  },
  {
    key: "neon",
    emoji: "⚡",
    name: "Neon Circuit",
    color: "oklch(0.7 0.25 170)",
  },
  {
    key: "shadow",
    emoji: "👁️",
    name: "Shadow Dimension",
    color: "oklch(0.5 0.15 300)",
  },
  {
    key: "quantum",
    emoji: "🧠",
    name: "Quantum Realm",
    color: "oklch(0.65 0.22 210)",
  },
  {
    key: "labyrinth",
    emoji: "☠️",
    name: "Infernal Labyrinth",
    color: "oklch(0.6 0.25 30)",
  },
  {
    key: "frozen",
    emoji: "🧊",
    name: "Frozen Eternity",
    color: "oklch(0.7 0.18 200)",
  },
];

export function StatsScreen({
  stats,
  onBack,
  universeStars,
}: StatsScreenProps) {
  const { t } = useLanguage();
  const winRate =
    stats.wins + stats.losses > 0
      ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.22 }}
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.10 0.04 280)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-10 pb-4">
        <button
          type="button"
          onClick={onBack}
          data-ocid="stats.secondary_button"
          className="w-10 h-10 flex items-center justify-center rounded-2xl border border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all"
          style={{ background: "oklch(0.15 0.05 280)" }}
        >
          ←
        </button>
        <h1 className="font-display font-bold text-xl text-foreground">
          {t("stats.title")}
        </h1>
      </div>

      {/* Stats list */}
      <div
        data-ocid="stats.panel"
        className="flex-1 px-5 pb-8 flex flex-col gap-3 overflow-y-auto"
      >
        <StatRow
          icon="🎮"
          label={t("stats.levels")}
          value={stats.levelsCompleted}
          ocid="stats.levels_row"
          delay={0.05}
        />
        <StatRow
          icon="⭐"
          label={t("stats.stars")}
          value={stats.starsEarned}
          ocid="stats.stars_row"
          delay={0.1}
        />
        <StatRow
          icon="🪙"
          label={t("stats.coins")}
          value={stats.coinsEarned}
          ocid="stats.coins_row"
          delay={0.15}
        />
        <StatRow
          icon="👑"
          label={t("stats.bosses")}
          value={stats.bossesBeaten}
          ocid="stats.bosses_row"
          delay={0.2}
        />
        <StatRow
          icon="✅"
          label={t("stats.wins")}
          value={stats.wins}
          ocid="stats.wins_row"
          delay={0.25}
        />
        <StatRow
          icon="💥"
          label={t("stats.losses")}
          value={stats.losses}
          ocid="stats.losses_row"
          delay={0.3}
        />
        <StatRow
          icon="📈"
          label={t("stats.winRate")}
          value={`${winRate}%`}
          ocid="stats.winrate_row"
          delay={0.35}
        />
        <StatRow
          icon="✨"
          label={t("stats.threeStars")}
          value={stats.threeStarWins}
          ocid="stats.threestars_row"
          delay={0.4}
        />

        {/* Per-universe breakdown */}
        {universeStars && (
          <>
            <p
              className="text-xs font-bold uppercase tracking-widest px-1 mt-3"
              style={{ color: "oklch(0.55 0.1 280)" }}
            >
              {t("stats.universeBreakdown")}
            </p>
            {UNIVERSE_META.map((u, idx) => {
              const stars = universeStars[u.key] ?? [];
              const completed = stars.filter((s) => s.completed).length;
              const totalStars = stars.reduce(
                (acc, s) => acc + (s.completed ? s.stars : 0),
                0,
              );
              const bossBeaten = stars[20]?.completed ?? false;
              return (
                <motion.div
                  key={u.key}
                  data-ocid={`stats.universe.item.${idx + 1}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + idx * 0.04 }}
                  className="rounded-2xl p-4 border"
                  style={{
                    background: "oklch(0.14 0.05 280)",
                    borderColor: "oklch(0.22 0.06 280)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        background: `${u.color.replace("oklch", "oklch").replace(")", " / 0.15)")}`,
                      }}
                    >
                      {u.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-bold truncate"
                          style={{ color: "oklch(0.88 0.07 280)" }}
                        >
                          {u.name}
                        </span>
                        {bossBeaten && (
                          <span className="text-xs">&#x1F451;</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {/* Progress bar */}
                        <div
                          className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "oklch(0.22 0.06 280)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.round((completed / 21) * 100)}%`,
                              background: u.color,
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-mono flex-shrink-0"
                          style={{ color: "oklch(0.6 0.08 280)", minWidth: 48 }}
                        >
                          {completed}/21 ⭐{totalStars}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </div>
    </motion.div>
  );
}
