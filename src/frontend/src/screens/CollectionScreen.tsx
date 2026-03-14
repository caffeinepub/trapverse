import { ArrowLeft, Coins } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

export interface SkinDef {
  id: string;
  cost: number;
  emoji: string;
  closedStyle: React.CSSProperties;
  openedStyle: React.CSSProperties;
  bombStyle: React.CSSProperties;
}

export const SKINS: SkinDef[] = [
  {
    id: "classic",
    cost: 0,
    emoji: "🎮",
    closedStyle: {
      background:
        "linear-gradient(135deg, oklch(0.26 0.08 285), oklch(0.20 0.06 275))",
      border: "1.5px solid oklch(0.38 0.10 280)",
    },
    openedStyle: {
      background:
        "linear-gradient(135deg, oklch(0.32 0.14 200), oklch(0.26 0.10 215))",
      border: "1.5px solid oklch(0.45 0.14 200)",
    },
    bombStyle: {
      background:
        "linear-gradient(135deg, oklch(0.35 0.18 15), oklch(0.28 0.14 10))",
      border: "1.5px solid oklch(0.50 0.22 15)",
    },
  },
  {
    id: "neon",
    cost: 150,
    emoji: "⚡",
    closedStyle: {
      background: "oklch(0.10 0.05 285)",
      border: "2px solid oklch(0.65 0.28 290)",
      boxShadow:
        "0 0 8px oklch(0.65 0.28 290 / 0.5), inset 0 0 6px oklch(0.65 0.28 290 / 0.1)",
    },
    openedStyle: {
      background: "oklch(0.10 0.05 190)",
      border: "2px solid oklch(0.70 0.25 175)",
      boxShadow:
        "0 0 8px oklch(0.70 0.25 175 / 0.5), inset 0 0 6px oklch(0.70 0.25 175 / 0.1)",
    },
    bombStyle: {
      background: "oklch(0.10 0.05 15)",
      border: "2px solid oklch(0.72 0.28 20)",
      boxShadow: "0 0 8px oklch(0.72 0.28 20 / 0.5)",
    },
  },
  {
    id: "wooden",
    cost: 200,
    emoji: "🪵",
    closedStyle: {
      background:
        "linear-gradient(135deg, oklch(0.38 0.12 55), oklch(0.30 0.10 48))",
      border: "1.5px solid oklch(0.50 0.14 52)",
    },
    openedStyle: {
      background:
        "linear-gradient(135deg, oklch(0.55 0.14 72), oklch(0.44 0.12 65))",
      border: "1.5px solid oklch(0.62 0.16 68)",
    },
    bombStyle: {
      background:
        "linear-gradient(135deg, oklch(0.28 0.14 30), oklch(0.22 0.10 25))",
      border: "1.5px solid oklch(0.42 0.18 28)",
    },
  },
  {
    id: "crystal_skin",
    cost: 250,
    emoji: "💠",
    closedStyle: {
      background:
        "linear-gradient(135deg, oklch(0.72 0.08 220 / 0.4), oklch(0.85 0.05 210 / 0.3))",
      border: "1.5px solid oklch(0.80 0.15 215)",
      backdropFilter: "blur(4px)",
      boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.3)",
    },
    openedStyle: {
      background:
        "linear-gradient(135deg, oklch(0.80 0.10 195 / 0.5), oklch(0.90 0.06 200 / 0.35))",
      border: "1.5px solid oklch(0.85 0.16 195)",
      backdropFilter: "blur(4px)",
      boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.4)",
    },
    bombStyle: {
      background:
        "linear-gradient(135deg, oklch(0.55 0.18 260 / 0.5), oklch(0.40 0.14 270 / 0.4))",
      border: "1.5px solid oklch(0.65 0.22 260)",
      backdropFilter: "blur(4px)",
    },
  },
  {
    id: "golden",
    cost: 350,
    emoji: "✨",
    closedStyle: {
      background:
        "linear-gradient(135deg, oklch(0.55 0.18 75), oklch(0.45 0.15 68))",
      border: "1.5px solid oklch(0.72 0.22 78)",
      boxShadow: "inset 0 1px 0 oklch(0.90 0.18 80 / 0.4)",
    },
    openedStyle: {
      background:
        "linear-gradient(135deg, oklch(0.70 0.20 78), oklch(0.58 0.18 70))",
      border: "1.5px solid oklch(0.82 0.24 82)",
      boxShadow:
        "inset 0 1px 0 oklch(0.95 0.15 85 / 0.5), 0 2px 6px oklch(0.65 0.20 75 / 0.4)",
    },
    bombStyle: {
      background:
        "linear-gradient(135deg, oklch(0.38 0.16 30), oklch(0.30 0.14 22))",
      border: "1.5px solid oklch(0.55 0.20 28)",
    },
  },
];

interface CollectionScreenProps {
  coins: number;
  ownedSkins: string[];
  activeSkin: string;
  onBuy: (skinId: string, cost: number) => void;
  onSelect: (skinId: string) => void;
  onBack: () => void;
}

function TilePreview({ skin }: { skin: SkinDef }) {
  const cells = [
    { type: "closed", style: skin.closedStyle },
    { type: "opened", style: skin.openedStyle },
    { type: "closed", style: skin.closedStyle },
    { type: "opened", style: skin.openedStyle },
    { type: "bomb", style: skin.bombStyle },
    { type: "opened", style: skin.openedStyle },
    { type: "closed", style: skin.closedStyle },
    { type: "opened", style: skin.openedStyle },
    { type: "closed", style: skin.closedStyle },
  ];
  return (
    <div className="grid grid-cols-3 gap-1 w-20 h-20">
      {cells.map((cell, i) => (
        <div
          key={`preview-${skin.id}-${i}`}
          className="rounded-md flex items-center justify-center text-xs"
          style={cell.style}
        >
          {cell.type === "bomb" ? "💣" : cell.type === "opened" ? "🥉" : ""}
        </div>
      ))}
    </div>
  );
}

export function CollectionScreen({
  coins,
  ownedSkins,
  activeSkin,
  onBuy,
  onSelect,
  onBack,
}: CollectionScreenProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen candy-bg flex flex-col px-4 py-6 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          type="button"
          data-ocid="collection.back_button"
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
            🎨 {t("collection.title")}
          </h1>
          <p className="text-muted-foreground text-xs">
            {t("collection.subtitle")}
          </p>
        </motion.div>
        <div className="flex items-center gap-1.5 bg-card/80 rounded-full px-3 py-1.5">
          <Coins className="w-3.5 h-3.5 text-candy-gold" />
          <span className="font-bold text-xs text-candy-gold">{coins}</span>
        </div>
      </div>

      {/* Skin cards */}
      <div className="flex flex-col gap-4">
        {SKINS.map((skin, idx) => {
          const owned = ownedSkins.includes(skin.id);
          const isActive = activeSkin === skin.id;
          const canAfford = coins >= skin.cost;

          return (
            <motion.div
              key={skin.id}
              data-ocid={`collection.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, type: "spring", stiffness: 200 }}
              className="rounded-3xl p-4 border border-border"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, oklch(0.22 0.10 290), oklch(0.18 0.07 280))"
                  : "linear-gradient(135deg, oklch(0.16 0.06 285), oklch(0.13 0.04 280))",
                borderColor: isActive ? "oklch(0.65 0.22 290)" : undefined,
              }}
            >
              <div className="flex items-center gap-4">
                {/* Preview */}
                <TilePreview skin={skin} />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{skin.emoji}</span>
                    <h3 className="font-display font-bold text-foreground">
                      {t(`skin.${skin.id}`)}
                    </h3>
                    {isActive && (
                      <span className="text-[10px] font-bold text-accent bg-accent/20 border border-accent/30 rounded-full px-2 py-0.5">
                        {t("collection.selected")}
                      </span>
                    )}
                    {!owned && !isActive && (
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted/30 border border-border rounded-full px-2 py-0.5">
                        {t("collection.locked")}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mb-3">
                    {t(`skin.${skin.id}.desc`)}
                  </p>

                  {skin.cost > 0 && !owned && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Coins className="w-3.5 h-3.5 text-candy-gold" />
                      <span className="font-bold text-sm text-candy-gold">
                        {skin.cost}
                      </span>
                    </div>
                  )}
                  {skin.cost === 0 && !owned && (
                    <span className="text-xs text-accent font-semibold">
                      FREE
                    </span>
                  )}

                  {/* Action buttons */}
                  {owned ? (
                    <button
                      type="button"
                      data-ocid={`collection.select_button.${idx + 1}`}
                      disabled={isActive}
                      onClick={() => onSelect(skin.id)}
                      className={`min-h-[44px] px-5 rounded-xl font-display font-bold text-sm transition-all active:scale-95 ${
                        isActive
                          ? "bg-accent/20 text-accent border border-accent/40 cursor-default"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {isActive
                        ? t("collection.selected")
                        : t("collection.select")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      data-ocid={`collection.buy_button.${idx + 1}`}
                      disabled={!canAfford}
                      onClick={() => canAfford && onBuy(skin.id, skin.cost)}
                      className={`min-h-[44px] px-5 rounded-xl font-display font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${
                        canAfford
                          ? "bg-candy-gold/90 text-background hover:bg-candy-gold"
                          : "bg-muted/40 text-muted-foreground cursor-not-allowed opacity-50"
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      {t("collection.buy")} {skin.cost}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
