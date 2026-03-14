import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import type { Achievement } from "../types";

interface AchievementsScreenProps {
  achievements: Achievement[];
  onBack: () => void;
}

export function AchievementsScreen({
  achievements,
  onBack,
}: AchievementsScreenProps) {
  const { t } = useLanguage();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
          data-ocid="achievements.secondary_button"
          className="w-10 h-10 flex items-center justify-center rounded-2xl border border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all"
          style={{ background: "oklch(0.15 0.05 280)" }}
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-xl text-foreground">
            {t("achievement.title")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {unlockedCount}/{achievements.length} {t("achievement.unlocked")}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div
        data-ocid="achievements.panel"
        className="flex-1 px-5 pb-8 grid grid-cols-2 gap-3 content-start"
      >
        {achievements.map((ach, idx) => {
          const pct = Math.min(
            100,
            Math.round((ach.progress / ach.target) * 100),
          );
          return (
            <motion.div
              key={ach.id}
              data-ocid={`achievements.item.${idx + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-3xl p-4 border flex flex-col gap-2"
              style={{
                background: ach.unlocked
                  ? "oklch(0.16 0.08 75 / 0.3)"
                  : "oklch(0.14 0.04 280)",
                borderColor: ach.unlocked
                  ? "oklch(0.65 0.18 75)"
                  : "oklch(0.22 0.05 280)",
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: ach.unlocked
                      ? "oklch(0.28 0.12 75)"
                      : "oklch(0.18 0.04 280)",
                    filter: ach.unlocked ? "none" : "grayscale(1)",
                    opacity: ach.unlocked ? 1 : 0.5,
                  }}
                >
                  {ach.icon}
                </div>
                {ach.unlocked && (
                  <span
                    className="text-xs font-bold"
                    style={{ color: "oklch(0.75 0.20 75)" }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <div>
                <p
                  className="font-display font-bold text-sm leading-tight"
                  style={{
                    color: ach.unlocked
                      ? "oklch(0.90 0.12 75)"
                      : "oklch(0.65 0.04 280)",
                  }}
                >
                  {t(ach.titleKey ?? ach.id)}
                </p>
                <p
                  className="text-xs mt-0.5 leading-snug"
                  style={{
                    color: ach.unlocked
                      ? "oklch(0.68 0.08 75)"
                      : "oklch(0.45 0.04 280)",
                  }}
                >
                  {t(ach.descKey ?? ach.id)}
                </p>
              </div>
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: ach.unlocked
                        ? "oklch(0.72 0.14 75)"
                        : "oklch(0.45 0.04 280)",
                    }}
                  >
                    {t("achievement.progress", {
                      current: String(Math.min(ach.progress, ach.target)),
                      total: String(ach.target),
                    })}
                  </span>
                </div>
                <Progress
                  value={pct}
                  className="h-1.5"
                  style={
                    ach.unlocked
                      ? ({
                          "--primary": "oklch(0.72 0.20 75)",
                        } as React.CSSProperties)
                      : {}
                  }
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
