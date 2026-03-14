import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import type { GameStats } from "../types";

interface StatsScreenProps {
  stats: GameStats;
  onBack: () => void;
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

export function StatsScreen({ stats, onBack }: StatsScreenProps) {
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
        className="flex-1 px-5 pb-8 flex flex-col gap-3"
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
      </div>
    </motion.div>
  );
}
