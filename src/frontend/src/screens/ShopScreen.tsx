import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Coins,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { POWERUP_COSTS, type PowerupCounts } from "../types";

interface ShopScreenProps {
  coins: number;
  powerupCounts: PowerupCounts;
  onBuy: (type: "detector" | "multiplier" | "shield") => void;
  onBack: () => void;
}

export function ShopScreen({
  coins,
  powerupCounts,
  onBuy,
  onBack,
}: ShopScreenProps) {
  const { t } = useLanguage();

  const POWERUP_INFO = [
    {
      type: "detector" as const,
      icon: <Search className="w-7 h-7" />,
      emoji: "🔍",
      name: t("shop.item.detector.name"),
      desc: t("shop.item.detector.desc"),
      cost: POWERUP_COSTS.detector,
      color: "oklch(0.76 0.18 180)",
      bg: "linear-gradient(135deg, oklch(0.24 0.12 180), oklch(0.18 0.08 200))",
      border: "oklch(0.45 0.14 180)",
      shadow: "0 0 20px oklch(0.76 0.18 180 / 0.35)",
      ocid: "shop.buy_detector_button",
    },
    {
      type: "multiplier" as const,
      icon: <Zap className="w-7 h-7" />,
      emoji: "⚡",
      name: t("shop.item.multiplier.name"),
      desc: t("shop.item.multiplier.desc"),
      cost: POWERUP_COSTS.multiplier,
      color: "oklch(0.84 0.22 75)",
      bg: "linear-gradient(135deg, oklch(0.30 0.18 70), oklch(0.22 0.14 60))",
      border: "oklch(0.55 0.20 75)",
      shadow: "0 0 20px oklch(0.84 0.22 75 / 0.4)",
      ocid: "shop.buy_multiplier_button",
    },
    {
      type: "shield" as const,
      icon: <Shield className="w-7 h-7" />,
      emoji: "🛡️",
      name: t("shop.item.shield.name"),
      desc: t("shop.item.shield.desc"),
      cost: POWERUP_COSTS.shield,
      color: "oklch(0.72 0.25 340)",
      bg: "linear-gradient(135deg, oklch(0.28 0.18 340), oklch(0.20 0.14 320))",
      border: "oklch(0.50 0.22 340)",
      shadow: "0 0 20px oklch(0.72 0.25 340 / 0.4)",
      ocid: "shop.buy_shield_button",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen candy-bg flex flex-col px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-xl active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm">{t("levelSelect.back")}</span>
        </button>
        <h1 className="font-display font-bold text-xl text-foreground">
          {t("shop.title")}
        </h1>
        <div className="flex items-center gap-1.5 bg-card/80 rounded-full px-3 py-1.5 border border-border">
          <Coins className="w-4 h-4 text-candy-gold" />
          <span className="font-display font-bold text-candy-gold">
            {coins}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground text-sm text-center mb-6">
        {t("shop.subtitle")}
      </p>

      {/* Powerup cards */}
      <div className="flex flex-col gap-4">
        {POWERUP_INFO.map((p) => {
          const count = powerupCounts[p.type];
          const canAfford = coins >= p.cost;
          return (
            <motion.div
              key={p.type}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-3xl p-4 border"
              style={{
                background: p.bg,
                borderColor: p.border,
                boxShadow: p.shadow,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{
                    background: "oklch(0.10 0.05 280 / 0.5)",
                    color: p.color,
                  }}
                >
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display font-bold text-base text-foreground">
                      {p.name}
                    </h3>
                    {count > 0 && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: "oklch(0.10 0.05 280 / 0.5)",
                          color: p.color,
                        }}
                      >
                        ×{count}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-candy-gold" />
                  <span className="font-display font-bold text-candy-gold">
                    {p.cost}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {t("shop.coins")}
                  </span>
                </div>
                <Button
                  data-ocid={p.ocid}
                  disabled={!canAfford}
                  onClick={() => onBuy(p.type)}
                  size="sm"
                  className={`rounded-xl font-display font-bold h-10 px-5 active:scale-95 transition-transform ${
                    canAfford
                      ? "text-primary-foreground hover:opacity-90"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                  style={canAfford ? { background: p.color } : undefined}
                >
                  {canAfford ? t("shop.buy") : t("shop.needCoins")}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-2xl p-4 border border-border bg-card/40"
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-accent" />
          <span className="font-semibold text-sm text-foreground">
            {t("shop.earnCoins")}
          </span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            {t("shop.earn.star1")} &nbsp; {t("shop.earn.star2")} &nbsp;{" "}
            {t("shop.earn.star3")}
          </p>
          <p>{t("shop.earn.boss")}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
