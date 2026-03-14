import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import type { Quest } from "../types";

interface QuestBoardScreenProps {
  quests: Quest[];
  onClaim: (questId: string) => void;
  onClaimReward: (questId: string, reward: number) => void;
  onBack: () => void;
}

const QUEST_ICONS: Record<string, string> = {
  win_levels: "🎮",
  earn_coins: "🪙",
  win_3stars: "⭐",
  beat_boss: "👑",
};

function getTomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString();
}

export function QuestBoardScreen({
  quests,
  onClaim,
  onClaimReward,
  onBack,
}: QuestBoardScreenProps) {
  const { t } = useLanguage();

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
          data-ocid="quest.secondary_button"
          className="w-10 h-10 flex items-center justify-center rounded-2xl border border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all"
          style={{ background: "oklch(0.15 0.05 280)" }}
        >
          ←
        </button>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            {t("quest.title")}
          </h1>
          <p className="text-xs text-muted-foreground">{t("quest.daily")}</p>
        </div>
      </div>

      {/* Quests */}
      <div className="flex-1 px-5 flex flex-col gap-4 pb-8">
        {quests.map((quest, idx) => {
          const pct = Math.min(
            100,
            Math.round((quest.progress / quest.target) * 100),
          );
          const done = quest.progress >= quest.target;
          const ocidIdx = idx + 1;
          return (
            <motion.div
              key={quest.id}
              data-ocid={`quest.item.${ocidIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-3xl p-5 border"
              style={{
                background: done
                  ? "oklch(0.16 0.08 148 / 0.6)"
                  : "oklch(0.14 0.05 280)",
                borderColor: done
                  ? "oklch(0.38 0.14 148)"
                  : "oklch(0.22 0.06 280)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: done
                      ? "oklch(0.30 0.12 148)"
                      : "oklch(0.20 0.06 280)",
                  }}
                >
                  {QUEST_ICONS[quest.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-display font-bold text-sm text-foreground">
                      {t(`quest.type.${quest.type}`, {
                        target: String(quest.target),
                      })}
                    </p>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: "oklch(0.75 0.22 75 / 0.15)",
                        color: "oklch(0.82 0.18 75)",
                      }}
                    >
                      🪙 {quest.reward}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted-foreground">
                      {quest.progress}/{quest.target}
                    </span>
                    {done && !quest.claimed && (
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "oklch(0.72 0.18 148)" }}
                      >
                        ✓ {t("quest.claim")}
                      </span>
                    )}
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                {quest.claimed ? (
                  <span
                    className="text-xs font-semibold px-4 py-2 rounded-2xl"
                    style={{
                      background: "oklch(0.20 0.05 280)",
                      color: "oklch(0.50 0.05 280)",
                    }}
                  >
                    ✓ {t("quest.claimed")}
                  </span>
                ) : done ? (
                  <motion.button
                    type="button"
                    data-ocid={`quest.claim_button.${ocidIdx}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClaim(quest.id);
                      onClaimReward(quest.id, quest.reward);
                    }}
                    className="px-5 py-2.5 rounded-2xl font-display font-bold text-sm active:scale-95 transition-transform"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.52 0.20 148), oklch(0.42 0.16 155))",
                      color: "white",
                      minHeight: 44,
                    }}
                  >
                    🎁 {t("quest.claim")} +{quest.reward}
                  </motion.button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {quest.progress}/{quest.target}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        <p
          className="text-center text-xs mt-4"
          style={{ color: "oklch(0.45 0.05 280)" }}
        >
          🔄 {t("quest.renewsTomorrow")} {getTomorrowStr()}
        </p>
      </div>
    </motion.div>
  );
}
