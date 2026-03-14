import { Button } from "@/components/ui/button";
import {
  Coins,
  Gift,
  Globe,
  HelpCircle,
  Settings,
  ShoppingBag,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import type { LevelStar, Universe } from "../types";

interface HomeScreenProps {
  coins: number;
  onSelectUniverse: (universe: Universe) => void;
  onShop: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onQuests: () => void;
  onAchievements: () => void;
  onStats: () => void;
  onCollection: () => void;
  onDailyReward: () => void;
  dailyRewardClaimed: boolean;
  candyStars: LevelStar[];
  jungleStars: LevelStar[];
  crystalStars: LevelStar[];
  infernoStars: LevelStar[];
  voidStars: LevelStar[];
}

const particles = [
  {
    id: "p1",
    size: 12,
    color: "oklch(0.72 0.25 340 / 0.6)",
    top: "10%",
    left: "8%",
    delay: 0,
    dur: 3,
  },
  {
    id: "p2",
    size: 8,
    color: "oklch(0.84 0.22 75 / 0.7)",
    top: "20%",
    left: "85%",
    delay: 0.5,
    dur: 4,
  },
  {
    id: "p3",
    size: 16,
    color: "oklch(0.45 0.15 150 / 0.5)",
    top: "60%",
    left: "5%",
    delay: 1.2,
    dur: 3.5,
  },
  {
    id: "p4",
    size: 10,
    color: "oklch(0.70 0.18 290 / 0.6)",
    top: "75%",
    left: "90%",
    delay: 0.8,
    dur: 5,
  },
  {
    id: "p5",
    size: 6,
    color: "oklch(0.55 0.18 140 / 0.7)",
    top: "40%",
    left: "92%",
    delay: 1.8,
    dur: 3.2,
  },
  {
    id: "p6",
    size: 14,
    color: "oklch(0.72 0.25 340 / 0.4)",
    top: "85%",
    left: "15%",
    delay: 0.3,
    dur: 4.5,
  },
  {
    id: "p7",
    size: 9,
    color: "oklch(0.84 0.22 75 / 0.5)",
    top: "30%",
    left: "3%",
    delay: 2.1,
    dur: 3.8,
  },
  {
    id: "p8",
    size: 11,
    color: "oklch(0.38 0.12 155 / 0.4)",
    top: "55%",
    left: "88%",
    delay: 1.5,
    dur: 4.2,
  },
];

function CardShimmer({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-0 bottom-0 w-16"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.06) 50%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "400%"] }}
        transition={{
          duration: 1.2,
          delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 2.8,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

function LockOverlay({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-1 z-10"
      style={{ background: "oklch(0.06 0.03 280 / 0.75)" }}
    >
      <span className="text-3xl">🔒</span>
      <span className="text-xs font-semibold text-white/80 text-center px-4">
        {label}
      </span>
    </div>
  );
}

export function HomeScreen({
  coins,
  onSelectUniverse,
  onShop,
  onHowToPlay,
  onSettings,
  onQuests,
  onAchievements,
  onStats,
  onCollection,
  onDailyReward,
  dailyRewardClaimed,
  candyStars,
  jungleStars,
  crystalStars,
  infernoStars,
  voidStars,
}: HomeScreenProps) {
  const { t, lang, setLang, languages } = useLanguage();
  const [showLangModal, setShowLangModal] = useState(false);

  const jungleUnlocked = candyStars[20]?.completed === true;
  const crystalUnlocked = jungleStars[20]?.completed === true;
  const infernoUnlocked = crystalStars[20]?.completed === true;
  const voidUnlocked = infernoStars[20]?.completed === true;
  const neonUnlocked = voidStars[20]?.completed === true;

  const lockedLabel = t("home.locked");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen candy-bg flex flex-col items-center justify-between px-6 py-10 relative overflow-hidden"
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            top: p.top,
            left: p.left,
          }}
          animate={{
            y: [0, -14, 0],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Top row: language + coin */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="self-stretch flex items-center justify-between"
      >
        <button
          type="button"
          data-ocid="home.language_button"
          onClick={() => setShowLangModal(true)}
          className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-semibold">
            {languages.find((l) => l.code === lang)?.flag}
          </span>
        </button>

        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2">
          <Coins className="w-4 h-4 text-candy-gold" />
          <span className="font-display font-bold text-candy-gold text-sm">
            {coins.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="home.settings_button"
            onClick={onSettings}
            className="flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-full hover:text-foreground transition-colors active:scale-95 text-muted-foreground"
            style={{ minWidth: 44, minHeight: 44, width: 44, height: 44 }}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-ocid="home.secondary_button"
            onClick={onHowToPlay}
            className="flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-full hover:text-foreground transition-colors active:scale-95 text-muted-foreground"
            style={{ minWidth: 44, minHeight: 44, width: 44, height: 44 }}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Hero section */}
      <div className="flex flex-col items-center gap-6 flex-1 justify-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="flex flex-col items-center gap-3"
        >
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-candy boss-glow"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.28 0.15 290), oklch(0.20 0.12 310))",
              }}
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              💣
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Star className="w-4 h-4 fill-primary-foreground text-primary-foreground" />
            </motion.div>
          </div>
          <div className="text-center">
            <h1 className="font-display font-extrabold text-5xl tracking-tight text-foreground">
              Trap<span className="text-primary">Verse</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium tracking-wide">
              {t("app.tagline")}
            </p>
          </div>
        </motion.div>

        {/* Universe cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
          className="w-full max-w-sm flex flex-col gap-3"
        >
          {/* Candy Cosmos */}
          <motion.button
            type="button"
            data-ocid="home.candy_button"
            className="w-full relative rounded-3xl p-5 border border-border overflow-hidden cursor-pointer text-left"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.08 300) 0%, oklch(0.16 0.06 280) 100%)",
            }}
            onClick={() => onSelectUniverse("candy")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, oklch(0.72 0.25 340) 0%, transparent 60%)",
              }}
            />
            <CardShimmer delay={0} />
            <div className="relative flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.60 0.22 340), oklch(0.50 0.20 310))",
                }}
              >
                🍭
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="font-display font-bold text-lg text-foreground">
                    {t("home.universe.candy.name")}
                  </h2>
                  <span className="text-xs bg-accent/20 text-accent border border-accent/30 rounded-full px-2 py-0.5 font-medium">
                    {t("home.badge.open")}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {t("home.universe.candy.desc")}
                </p>
              </div>
              <motion.div
                className="text-xl text-muted-foreground"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                →
              </motion.div>
            </div>
          </motion.button>

          {/* Mystic Jungle */}
          <motion.button
            type="button"
            data-ocid="home.jungle_button"
            className={`w-full relative rounded-3xl p-5 overflow-hidden text-left transition-opacity ${jungleUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.12 150) 0%, oklch(0.18 0.09 160) 100%)",
              border: "1.5px solid oklch(0.38 0.14 148)",
            }}
            onClick={() => {
              if (jungleUnlocked) onSelectUniverse("jungle");
            }}
            whileHover={jungleUnlocked ? { scale: 1.01 } : {}}
            whileTap={jungleUnlocked ? { scale: 0.97 } : {}}
          >
            {!jungleUnlocked && <LockOverlay label={lockedLabel} />}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at 70% 50%, oklch(0.52 0.20 145) 0%, transparent 60%)",
              }}
            />
            <CardShimmer delay={1} />
            <div className="relative flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.42 0.18 148), oklch(0.32 0.14 155))",
                }}
              >
                🌿
              </div>
              <div className="flex-1">
                <h2
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.82 0.16 145)" }}
                >
                  {t("home.universe.jungle.name")}
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.58 0.10 148)" }}
                >
                  {t("home.universe.jungle.desc")}
                </p>
              </div>
              {jungleUnlocked && (
                <motion.div
                  className="text-xl"
                  style={{ color: "oklch(0.65 0.14 148)" }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.3,
                  }}
                >
                  →
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* Crystal Storm */}
          <motion.button
            type="button"
            data-ocid="home.crystal_button"
            className={`w-full relative rounded-3xl p-5 overflow-hidden text-left transition-opacity ${crystalUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.10 220) 0%, oklch(0.16 0.08 230) 100%)",
              border: "1.5px solid oklch(0.38 0.14 218)",
            }}
            onClick={() => {
              if (crystalUnlocked) onSelectUniverse("crystal");
            }}
            whileHover={crystalUnlocked ? { scale: 1.01 } : {}}
            whileTap={crystalUnlocked ? { scale: 0.97 } : {}}
          >
            {!crystalUnlocked && <LockOverlay label={lockedLabel} />}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, oklch(0.65 0.22 215) 0%, transparent 60%)",
              }}
            />
            <CardShimmer delay={2} />
            <div className="relative flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.45 0.20 215), oklch(0.35 0.16 225))",
                }}
              >
                💎
              </div>
              <div className="flex-1">
                <h2
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.85 0.18 215)" }}
                >
                  {t("home.universe.crystal.name")}
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.10 220)" }}
                >
                  {t("home.universe.crystal.desc")}
                </p>
              </div>
              {crystalUnlocked && (
                <motion.div
                  className="text-xl"
                  style={{ color: "oklch(0.65 0.16 218)" }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.6,
                  }}
                >
                  →
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* Solar Inferno */}
          <motion.button
            type="button"
            data-ocid="home.inferno_button"
            className={`w-full relative rounded-3xl p-5 overflow-hidden text-left transition-opacity ${infernoUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.14 25) 0%, oklch(0.18 0.10 15) 100%)",
              border: "1.5px solid oklch(0.48 0.20 22)",
            }}
            onClick={() => {
              if (infernoUnlocked) onSelectUniverse("inferno");
            }}
            whileHover={infernoUnlocked ? { scale: 1.01 } : {}}
            whileTap={infernoUnlocked ? { scale: 0.97 } : {}}
          >
            {!infernoUnlocked && <LockOverlay label={lockedLabel} />}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at 70% 50%, oklch(0.65 0.26 25) 0%, transparent 60%)",
              }}
            />
            <CardShimmer delay={3} />
            <div className="relative flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.24 25), oklch(0.42 0.20 18))",
                }}
              >
                🔥
              </div>
              <div className="flex-1">
                <h2
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.88 0.20 35)" }}
                >
                  {t("home.universe.inferno.name")}
                </h2>
                <p className="text-xs" style={{ color: "oklch(0.60 0.14 25)" }}>
                  {t("home.universe.inferno.desc")}
                </p>
              </div>
              {infernoUnlocked && (
                <motion.div
                  className="text-xl"
                  style={{ color: "oklch(0.70 0.20 28)" }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.9,
                  }}
                >
                  →
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* Void Abyss */}
          <motion.button
            type="button"
            data-ocid="home.void_button"
            className={`w-full relative rounded-3xl p-5 overflow-hidden text-left transition-opacity ${voidUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.14 0.10 290) 0%, oklch(0.10 0.08 310) 100%)",
              border: "1.5px solid oklch(0.35 0.14 285)",
            }}
            onClick={() => {
              if (voidUnlocked) onSelectUniverse("void");
            }}
            whileHover={voidUnlocked ? { scale: 1.01 } : {}}
            whileTap={voidUnlocked ? { scale: 0.97 } : {}}
          >
            {!voidUnlocked && <LockOverlay label={lockedLabel} />}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 30%, oklch(0.55 0.22 290) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, oklch(0.35 0.16 300) 0%, transparent 40%)",
              }}
            />
            {/* Star field effect */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {["s1", "s2", "s3", "s4", "s5", "s6"].map((sid, si) => (
                <motion.div
                  key={sid}
                  className="absolute rounded-full"
                  style={{
                    width: si % 2 === 0 ? 2 : 3,
                    height: si % 2 === 0 ? 2 : 3,
                    background: "oklch(0.90 0.05 290)",
                    top: `${10 + si * 14}%`,
                    right: `${5 + (si % 3) * 10}%`,
                  }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5 + si * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: si * 0.3,
                  }}
                />
              ))}
            </div>
            <CardShimmer delay={4} />
            <div className="relative flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.30 0.18 290), oklch(0.20 0.14 310))",
                }}
              >
                🌑
              </div>
              <div className="flex-1">
                <h2
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.82 0.16 285)" }}
                >
                  {t("home.universe.void.name")}
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.52 0.10 290)" }}
                >
                  {t("home.universe.void.desc")}
                </p>
              </div>
              {voidUnlocked && (
                <motion.div
                  className="text-xl"
                  style={{ color: "oklch(0.65 0.16 285)" }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1.2,
                  }}
                >
                  →
                </motion.div>
              )}
            </div>
          </motion.button>

          {/* Neon Circuit */}
          <motion.button
            type="button"
            data-ocid="home.neon_button"
            className={`w-full relative rounded-3xl p-5 overflow-hidden text-left transition-opacity ${neonUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.12 0.08 160) 0%, oklch(0.10 0.06 200) 100%)",
              border: "1.5px solid oklch(0.55 0.20 155)",
            }}
            onClick={() => {
              if (neonUnlocked) onSelectUniverse("neon");
            }}
            whileHover={neonUnlocked ? { scale: 1.01 } : {}}
            whileTap={neonUnlocked ? { scale: 0.97 } : {}}
          >
            {!neonUnlocked && <LockOverlay label={lockedLabel} />}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 50%, oklch(0.62 0.28 155) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, oklch(0.55 0.26 330) 0%, transparent 45%)",
              }}
            />
            {/* Circuit lines effect */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, oklch(0.62 0.28 155) 0px, oklch(0.62 0.28 155) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, oklch(0.62 0.28 155) 0px, oklch(0.62 0.28 155) 1px, transparent 1px, transparent 20px)",
              }}
            />
            <CardShimmer delay={5} />
            <div className="relative flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.38 0.24 155), oklch(0.28 0.18 175))",
                  boxShadow: "0 0 12px oklch(0.55 0.28 155 / 0.5)",
                }}
              >
                ⚡
              </div>
              <div className="flex-1">
                <h2
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.82 0.22 155)" }}
                >
                  {t("home.universe.neon.name")}
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.52 0.14 160)" }}
                >
                  {t("home.universe.neon.desc")}
                </p>
              </div>
              {neonUnlocked && (
                <motion.div
                  className="text-xl"
                  style={{ color: "oklch(0.70 0.24 155)" }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1.5,
                  }}
                >
                  →
                </motion.div>
              )}
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="w-full max-w-sm flex flex-col gap-3"
      >
        {/* Daily Reward Button */}
        <motion.button
          type="button"
          data-ocid="home.daily_reward_button"
          whileTap={{ scale: 0.97 }}
          onClick={onDailyReward}
          className="w-full relative rounded-2xl overflow-hidden flex items-center gap-3 px-4"
          style={{
            background: dailyRewardClaimed
              ? "oklch(0.16 0.05 280)"
              : "linear-gradient(135deg, oklch(0.52 0.20 75), oklch(0.42 0.16 55))",
            border: dailyRewardClaimed
              ? "1.5px solid oklch(0.28 0.06 280)"
              : "1.5px solid oklch(0.68 0.22 75)",
            minHeight: 52,
          }}
        >
          {!dailyRewardClaimed && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.10) 50%, transparent 70%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          )}
          <div
            className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: dailyRewardClaimed
                ? "oklch(0.22 0.06 280)"
                : "oklch(0.62 0.24 75 / 0.4)",
            }}
          >
            <Gift
              className="w-5 h-5"
              style={{
                color: dailyRewardClaimed
                  ? "oklch(0.48 0.06 280)"
                  : "oklch(0.98 0.06 75)",
              }}
            />
          </div>
          <div className="relative flex-1 text-left">
            <p
              className="font-display font-bold text-sm"
              style={{
                color: dailyRewardClaimed
                  ? "oklch(0.50 0.05 280)"
                  : "oklch(0.98 0.05 75)",
              }}
            >
              {t("loginReward.title")}
            </p>
            <p
              className="text-xs"
              style={{
                color: dailyRewardClaimed
                  ? "oklch(0.38 0.04 280)"
                  : "oklch(0.85 0.10 75)",
              }}
            >
              {dailyRewardClaimed
                ? t("loginReward.claimed")
                : t("loginReward.available")}
            </p>
          </div>
          {!dailyRewardClaimed && (
            <motion.div
              className="relative text-lg"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
            >
              🎁
            </motion.div>
          )}
          {dailyRewardClaimed && (
            <span
              className="relative text-xs font-semibold px-2 py-1 rounded-lg"
              style={{
                background: "oklch(0.22 0.06 280)",
                color: "oklch(0.42 0.05 280)",
              }}
            >
              ✓
            </span>
          )}
        </motion.button>

        <Button
          data-ocid="home.shop_button"
          size="lg"
          variant="outline"
          className="h-14 rounded-2xl font-display font-semibold border-border hover:bg-secondary active:scale-95 transition-transform"
          onClick={onShop}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          {t("home.shop")}
        </Button>

        {/* Feature buttons row */}
        <div className="grid grid-cols-4 gap-2">
          <motion.button
            type="button"
            data-ocid="home.quests_button"
            whileTap={{ scale: 0.95 }}
            onClick={onQuests}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border py-3 px-2 text-muted-foreground hover:text-foreground hover:bg-card/70 active:scale-95 transition-all"
            style={{ background: "oklch(0.14 0.05 280 / 0.8)", minHeight: 68 }}
          >
            <span className="text-xl">📋</span>
            <span className="text-[10px] font-semibold">
              {t("quest.title")}
            </span>
          </motion.button>
          <motion.button
            type="button"
            data-ocid="home.achievements_button"
            whileTap={{ scale: 0.95 }}
            onClick={onAchievements}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border py-3 px-2 text-muted-foreground hover:text-foreground hover:bg-card/70 active:scale-95 transition-all"
            style={{ background: "oklch(0.14 0.05 280 / 0.8)", minHeight: 68 }}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-semibold">
              {t("achievement.title")}
            </span>
          </motion.button>
          <motion.button
            type="button"
            data-ocid="home.stats_button"
            whileTap={{ scale: 0.95 }}
            onClick={onStats}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border py-3 px-2 text-muted-foreground hover:text-foreground hover:bg-card/70 active:scale-95 transition-all"
            style={{ background: "oklch(0.14 0.05 280 / 0.8)", minHeight: 68 }}
          >
            <span className="text-xl">📊</span>
            <span className="text-[10px] font-semibold">
              {t("stats.title")}
            </span>
          </motion.button>
          <motion.button
            type="button"
            data-ocid="home.collection_button"
            whileTap={{ scale: 0.95 }}
            onClick={onCollection}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border py-3 px-2 text-muted-foreground hover:text-foreground hover:bg-card/70 active:scale-95 transition-all"
            style={{ background: "oklch(0.14 0.05 280 / 0.8)", minHeight: 68 }}
          >
            <span className="text-xl">🎨</span>
            <span className="text-[10px] font-semibold">
              {t("collection.title")}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLangModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end justify-center z-50 pb-0"
            style={{ background: "oklch(0.08 0.04 280 / 0.85)" }}
            onClick={() => setShowLangModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              data-ocid="home.language_modal"
              className="w-full rounded-t-3xl p-6 border-t border-border"
              style={{ background: "oklch(0.14 0.06 280)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-foreground">
                  {t("lang.select")}
                </h2>
                <button
                  type="button"
                  data-ocid="home.language_modal_close"
                  onClick={() => setShowLangModal(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((l) => (
                  <motion.button
                    key={l.code}
                    type="button"
                    data-ocid={`home.lang_${l.code}_button`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setLang(l.code);
                      setShowLangModal(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                      lang === l.code
                        ? "border-primary bg-primary/20 text-foreground"
                        : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/70"
                    }`}
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <span className="font-medium text-sm">{l.name}</span>
                    {lang === l.code && (
                      <span className="ml-auto text-primary text-xs">✓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
