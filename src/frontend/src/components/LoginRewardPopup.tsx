import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

interface LoginRewardInfo {
  day: number;
  reward: {
    day: number;
    coins: number;
    powerup: string | null;
    extra: number;
  };
  shouldShow: boolean;
}

interface LoginRewardPopupProps {
  info: LoginRewardInfo;
  onClaim: () => void;
}

const DAY_REWARDS = [
  { coins: 20, powerup: null },
  { coins: 30, powerup: null },
  { coins: 0, powerup: "🔍" },
  { coins: 50, powerup: null },
  { coins: 0, powerup: "✖️" },
  { coins: 75, powerup: null },
  { coins: 100, powerup: "🛡️" },
];

export function LoginRewardPopup({ info, onClaim }: LoginRewardPopupProps) {
  const { t } = useLanguage();

  if (!info.shouldShow) return null;

  const rewardText = info.reward.powerup
    ? `${info.reward.powerup === "detector" ? "🔍" : info.reward.powerup === "multiplier" ? "✖️" : "🛡️"} x1`
    : `🪙 ${info.reward.coins}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-6"
        style={{ background: "oklch(0.05 0.03 280 / 0.88)" }}
        data-ocid="login_reward.dialog"
      >
        <motion.div
          initial={{ scale: 0.8, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-sm rounded-3xl p-6 border"
          style={{
            background: "oklch(0.14 0.06 280)",
            borderColor: "oklch(0.30 0.10 280)",
          }}
        >
          {/* Title */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎁</div>
            <h2 className="font-display font-bold text-xl text-foreground">
              {t("loginReward.title")}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {t("loginReward.day", { day: String(info.day) })}
            </p>
          </div>

          {/* 7-day strip */}
          <div className="flex gap-1.5 mb-6 justify-center">
            {Array.from({ length: 7 }, (_, i) => {
              const dayNum = i + 1;
              const isCurrent = dayNum === info.day;
              const isPast = dayNum < info.day;
              const dayReward = DAY_REWARDS[i];
              return (
                <div key={dayNum} className="flex flex-col items-center gap-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      background: isCurrent
                        ? "linear-gradient(135deg, oklch(0.65 0.22 75), oklch(0.55 0.18 75))"
                        : isPast
                          ? "oklch(0.22 0.06 148)"
                          : "oklch(0.18 0.04 280)",
                      color: isCurrent
                        ? "white"
                        : isPast
                          ? "oklch(0.55 0.10 148)"
                          : "oklch(0.45 0.04 280)",
                      border: isCurrent
                        ? "2px solid oklch(0.75 0.22 75)"
                        : "1px solid transparent",
                    }}
                  >
                    {isPast ? "✓" : dayNum}
                  </div>
                  <span
                    className="text-[9px] text-center leading-tight"
                    style={{ color: "oklch(0.45 0.04 280)" }}
                  >
                    {dayReward.powerup ?? `🪙${dayReward.coins}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Today's reward */}
          <div
            className="rounded-2xl p-4 mb-5 text-center border"
            style={{
              background: "oklch(0.18 0.08 75 / 0.3)",
              borderColor: "oklch(0.45 0.16 75)",
            }}
          >
            <p
              className="text-xs font-semibold mb-1"
              style={{ color: "oklch(0.70 0.12 75)" }}
            >
              {t("loginReward.reward")}
            </p>
            <p
              className="font-display font-extrabold text-2xl"
              style={{ color: "oklch(0.88 0.22 75)" }}
            >
              {rewardText}
            </p>
          </div>

          {/* Claim button */}
          <motion.button
            type="button"
            data-ocid="login_reward.claim_button"
            whileTap={{ scale: 0.95 }}
            onClick={onClaim}
            className="w-full py-4 rounded-2xl font-display font-bold text-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.60 0.22 75), oklch(0.50 0.18 75))",
              color: "white",
              minHeight: 56,
            }}
          >
            {t("loginReward.claim")} {rewardText}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
