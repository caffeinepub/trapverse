import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GlobalAudioToggle } from "./components/GlobalAudioToggle";
import { LoginRewardPopup } from "./components/LoginRewardPopup";
import { TutorialOverlay } from "./components/TutorialOverlay";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { useGameStorage } from "./hooks/useGameStorage";
import {
  useAddCoins,
  useSpendCoins,
  useUpdateLevelProgress,
} from "./hooks/useQueries";
import { AchievementsScreen } from "./screens/AchievementsScreen";
import { CollectionScreen } from "./screens/CollectionScreen";
import { GameBoardScreen } from "./screens/GameBoardScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { HowToPlayScreen } from "./screens/HowToPlayScreen";
import { LevelSelectScreen } from "./screens/LevelSelectScreen";
import { QuestBoardScreen } from "./screens/QuestBoardScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { ShopScreen } from "./screens/ShopScreen";
import { StatsScreen } from "./screens/StatsScreen";
import { POWERUP_COSTS, type Screen, type Universe } from "./types";

function AppInner() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentUniverse, setCurrentUniverse] = useState<Universe>("candy");
  const [activeSkin, setActiveSkin] = useState<string>(
    () => localStorage.getItem("trapverse_active_skin") ?? "classic",
  );
  const [ownedSkins, setOwnedSkins] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("trapverse_owned_skins");
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return ["classic"];
  });
  const [showManualReward, setShowManualReward] = useState(false);
  const [showTutorial, setShowTutorial] = useState(
    () => !localStorage.getItem("trapverse_tutorial_done"),
  );
  const { t } = useLanguage();

  const {
    coins,
    setCoins,
    levelStars,
    setLevelStars,
    jungleLevelStars,
    setJungleLevelStars,
    crystalLevelStars,
    setCrystalLevelStars,
    infernoLevelStars,
    setInfernoLevelStars,
    voidLevelStars,
    setVoidLevelStars,
    neonLevelStars,
    setNeonLevelStars,
    shadowLevelStars,
    setShadowLevelStars,
    quantumLevelStars,
    setQuantumLevelStars,
    labyrinthLevelStars,
    setLabyrinthLevelStars,
    frozenLevelStars,
    setFrozenLevelStars,
    powerups,
    setPowerups,
    quests,
    claimQuest,
    setQuests,
    achievements,
    updateAchievementProgress,
    stats,
    updateStats,
    loginRewardInfo,
    markLoginRewardSeen,
  } = useGameStorage();

  const addCoinsMutation = useAddCoins();
  const spendCoinsMutation = useSpendCoins();
  const updateLevelMutation = useUpdateLevelProgress();

  useEffect(() => {
    try {
      (window as any).AndroidAudioBridge?.changeTheme("Candy Cosmos");
    } catch {
      /* ignore */
    }
  }, []);

  const handleSelectUniverse = (universe: Universe) => {
    setCurrentUniverse(universe);
    setScreen("level-select");
    try {
      const themeMap: Record<Universe, string> = {
        candy: "Candy Cosmos",
        jungle: "Mystic Jungle",
        crystal: "Crystal Storm",
        inferno: "Solar Inferno",
        void: "Void Abyss",
        neon: "Neon Circuit",
        shadow: "Shadow Dimension",
        quantum: "Quantum Realm",
        labyrinth: "Infernal Labyrinth",
        frozen: "Frozen Eternity",
      };
      (window as any).AndroidAudioBridge?.changeTheme(themeMap[universe]);
    } catch {
      /* ignore */
    }
  };

  const handleShop = () => setScreen("shop");
  const handleBack = () => setScreen("home");

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    setScreen("game");
  };

  const handleSkinBuy = (skinId: string, cost: number) => {
    if (coins < cost) {
      toast.error(t("toast.notEnoughCoins"));
      return;
    }
    setCoins((prev) => prev - cost);
    spendCoinsMutation.mutate(cost);
    setOwnedSkins((prev) => {
      const next = [...prev, skinId];
      localStorage.setItem("trapverse_owned_skins", JSON.stringify(next));
      return next;
    });
    setActiveSkin(skinId);
    localStorage.setItem("trapverse_active_skin", skinId);
    toast.success(t("toast.purchased", { name: skinId }));
  };

  const handleSkinSelect = (skinId: string) => {
    setActiveSkin(skinId);
    localStorage.setItem("trapverse_active_skin", skinId);
  };

  const handleWin = (
    stars: number,
    coinsEarned: number,
    powerupUsed = true,
  ) => {
    const levelIndex = currentLevel - 1;
    const isBoss = currentLevel === 21;
    switch (currentUniverse) {
      case "candy":
        setLevelStars(levelIndex, stars, true);
        break;
      case "jungle":
        setJungleLevelStars(levelIndex, stars, true);
        break;
      case "crystal":
        setCrystalLevelStars(levelIndex, stars, true);
        break;
      case "inferno":
        setInfernoLevelStars(levelIndex, stars, true);
        break;
      case "void":
        setVoidLevelStars(levelIndex, stars, true);
        break;
      case "neon":
        setNeonLevelStars(levelIndex, stars, true);
        break;
      case "shadow":
        setShadowLevelStars(levelIndex, stars, true);
        break;
      case "quantum":
        setQuantumLevelStars(levelIndex, stars, true);
        break;
      case "labyrinth":
        setLabyrinthLevelStars(levelIndex, stars, true);
        break;
      case "frozen":
        setFrozenLevelStars(levelIndex, stars, true);
        break;
    }
    updateLevelMutation.mutate({ level: currentLevel, stars, completed: true });
    setCoins((prev) => prev + coinsEarned);
    addCoinsMutation.mutate(coinsEarned);
    toast.success(t("toast.coinsEarned", { amount: coinsEarned }), {
      duration: 2000,
    });

    // Update stats
    updateStats({
      levelsCompleted: 1,
      starsEarned: stars,
      coinsEarned: coinsEarned,
      wins: 1,
      bossesBeaten: isBoss ? 1 : 0,
      threeStarWins: stars === 3 ? 1 : 0,
    });

    // Update quest progress
    setQuests((prev) =>
      prev.map((q) => {
        if (q.claimed) return q;
        let delta = 0;
        if (q.type === "win_levels") delta = 1;
        else if (q.type === "earn_coins") delta = coinsEarned;
        else if (q.type === "win_3stars" && stars === 3) delta = 1;
        else if (q.type === "beat_boss" && isBoss) delta = 1;
        return delta > 0
          ? { ...q, progress: Math.min(q.target, q.progress + delta) }
          : q;
      }),
    );

    // Update achievements
    const newTotalLevels = stats.levelsCompleted + 1;
    const newTotalStars = stats.starsEarned + stars;
    const newTotalCoins = stats.coinsEarned + coinsEarned;
    const newBosses = stats.bossesBeaten + (isBoss ? 1 : 0);
    const newThreeStars = stats.threeStarWins + (stars === 3 ? 1 : 0);

    updateAchievementProgress("first_step", newTotalLevels);
    updateAchievementProgress("level_5", newTotalLevels);
    updateAchievementProgress("level_10", newTotalLevels);
    updateAchievementProgress("level_25", newTotalLevels);
    updateAchievementProgress("level_100", newTotalLevels);
    updateAchievementProgress("level_200", newTotalLevels);
    updateAchievementProgress("coin_100", newTotalCoins);
    updateAchievementProgress("coin_500", newTotalCoins);
    updateAchievementProgress("coin_1000", newTotalCoins);
    updateAchievementProgress("star_10", newTotalStars);
    updateAchievementProgress("star_30", newTotalStars);
    updateAchievementProgress("boss_first", newBosses);

    // boss_all: count unique universe bosses beaten (not total)
    const candyBossDone =
      levelStars[20]?.completed ||
      (currentUniverse === "candy" && isBoss && stars > 0);
    const jungleBossDone =
      jungleLevelStars[20]?.completed ||
      (currentUniverse === "jungle" && isBoss && stars > 0);
    const crystalBossDone =
      crystalLevelStars[20]?.completed ||
      (currentUniverse === "crystal" && isBoss && stars > 0);
    const infernoBossDone =
      infernoLevelStars[20]?.completed ||
      (currentUniverse === "inferno" && isBoss && stars > 0);
    const voidBossDone =
      voidLevelStars[20]?.completed ||
      (currentUniverse === "void" && isBoss && stars > 0);
    const neonBossDone =
      neonLevelStars[20]?.completed ||
      (currentUniverse === "neon" && isBoss && stars > 0);
    const shadowBossDone =
      shadowLevelStars[20]?.completed ||
      (currentUniverse === "shadow" && isBoss && stars > 0);
    const quantumBossDone =
      quantumLevelStars[20]?.completed ||
      (currentUniverse === "quantum" && isBoss && stars > 0);
    const labyrinthBossDone =
      labyrinthLevelStars[20]?.completed ||
      (currentUniverse === "labyrinth" && isBoss && stars > 0);
    const frozenBossDone =
      frozenLevelStars[20]?.completed ||
      (currentUniverse === "frozen" && isBoss && stars > 0);
    const uniqueBossCount = [
      candyBossDone,
      jungleBossDone,
      crystalBossDone,
      infernoBossDone,
      voidBossDone,
      neonBossDone,
      shadowBossDone,
      quantumBossDone,
      labyrinthBossDone,
      frozenBossDone,
    ].filter(Boolean).length;
    updateAchievementProgress("boss_all", uniqueBossCount);
    updateAchievementProgress("three_stars", newThreeStars);

    // no_powerup: win without using any powerup
    if (!powerupUsed) {
      const currentPuWins =
        achievements.find((a) => a.id === "no_powerup")?.progress ?? 0;
      updateAchievementProgress("no_powerup", currentPuWins + 1);
    }

    // all_universes: track progress across all 10 universe bosses
    updateAchievementProgress("all_universes", uniqueBossCount);

    if (currentLevel < 21) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      setScreen("level-select");
    }
  };

  const handleLose = () => {
    updateStats({ losses: 1 });
    setScreen("level-select");
  };

  const handlePowerupUse = (type: "detector" | "multiplier" | "shield") => {
    if (powerups[type] <= 0) return;
    setPowerups((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
  };

  const handleBuy = (type: "detector" | "multiplier" | "shield") => {
    const cost = POWERUP_COSTS[type];
    if (coins < cost) {
      toast.error(t("toast.notEnoughCoins"));
      return;
    }
    setCoins((prev) => prev - cost);
    setPowerups((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    spendCoinsMutation.mutate(cost);
    const nameMap = {
      detector: t("shop.item.detector.name"),
      multiplier: t("shop.item.multiplier.name"),
      shield: t("shop.item.shield.name"),
    };
    toast.success(t("toast.purchased", { name: nameMap[type] }));
  };

  const handleClaimLoginReward = () => {
    if (loginRewardInfo.reward.coins > 0) {
      setCoins((prev) => prev + loginRewardInfo.reward.coins);
      addCoinsMutation.mutate(loginRewardInfo.reward.coins);
    }
    if (loginRewardInfo.reward.powerup) {
      const pu = loginRewardInfo.reward.powerup as
        | "detector"
        | "multiplier"
        | "shield";
      setPowerups((prev) => ({
        ...prev,
        [pu]: prev[pu] + loginRewardInfo.reward.extra,
      }));
    }
    markLoginRewardSeen();
    setShowManualReward(false);
  };

  const activeLevelStars = (() => {
    switch (currentUniverse) {
      case "jungle":
        return jungleLevelStars;
      case "crystal":
        return crystalLevelStars;
      case "inferno":
        return infernoLevelStars;
      case "void":
        return voidLevelStars;
      case "neon":
        return neonLevelStars;
      case "shadow":
        return shadowLevelStars;
      case "quantum":
        return quantumLevelStars;
      case "labyrinth":
        return labyrinthLevelStars;
      case "frozen":
        return frozenLevelStars;
      default:
        return levelStars;
    }
  })();

  const slideVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };
  const slideTransition = { duration: 0.22, ease: "easeInOut" as const };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-[430px] min-h-screen relative overflow-hidden">
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <HomeScreen
                coins={coins}
                onSelectUniverse={handleSelectUniverse}
                onShop={handleShop}
                onHowToPlay={() => setScreen("howToPlay")}
                onQuests={() => setScreen("quests")}
                onAchievements={() => setScreen("achievements")}
                onStats={() => setScreen("stats")}
                onCollection={() => setScreen("collection")}
                onSettings={() => setScreen("settings")}
                onDailyReward={() => setShowManualReward(true)}
                dailyRewardClaimed={!loginRewardInfo.shouldShow}
                candyStars={levelStars}
                jungleStars={jungleLevelStars}
                crystalStars={crystalLevelStars}
                infernoStars={infernoLevelStars}
                voidStars={voidLevelStars}
                neonStars={neonLevelStars}
                shadowStars={shadowLevelStars}
                quantumStars={quantumLevelStars}
                labyrinthStars={labyrinthLevelStars}
              />
            </motion.div>
          )}
          {screen === "level-select" && (
            <motion.div
              key="level-select"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <LevelSelectScreen
                universe={currentUniverse}
                levelStars={activeLevelStars}
                onSelect={handleLevelSelect}
                onBack={handleBack}
              />
            </motion.div>
          )}
          {screen === "game" && (
            <motion.div
              key="game"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <GameBoardScreen
                level={currentLevel}
                universe={currentUniverse}
                coins={coins}
                powerupCounts={powerups}
                onWin={handleWin}
                onLose={handleLose}
                onBack={() => setScreen("level-select")}
                onPowerupUse={handlePowerupUse}
                activeSkin={activeSkin}
              />
            </motion.div>
          )}
          {screen === "shop" && (
            <motion.div
              key="shop"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <ShopScreen
                coins={coins}
                powerupCounts={powerups}
                onBuy={handleBuy}
                onBack={handleBack}
              />
            </motion.div>
          )}
          {screen === "howToPlay" && (
            <motion.div
              key="howToPlay"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <HowToPlayScreen onBack={handleBack} />
            </motion.div>
          )}
          {screen === "quests" && (
            <motion.div
              key="quests"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <QuestBoardScreen
                quests={quests}
                onClaim={claimQuest}
                onClaimReward={(_id, reward) => {
                  setCoins((prev) => prev + reward);
                  addCoinsMutation.mutate(reward);
                  toast.success(t("toast.coinsEarned", { amount: reward }));
                }}
                onBack={handleBack}
              />
            </motion.div>
          )}
          {screen === "achievements" && (
            <motion.div
              key="achievements"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <AchievementsScreen
                achievements={achievements}
                onBack={handleBack}
              />
            </motion.div>
          )}
          {screen === "settings" && (
            <motion.div
              key="settings"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <SettingsScreen onBack={() => setScreen("home")} />
            </motion.div>
          )}
          {screen === "stats" && (
            <motion.div
              key="stats"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <StatsScreen
                stats={stats}
                onBack={handleBack}
                universeStars={{
                  candy: levelStars,
                  jungle: jungleLevelStars,
                  crystal: crystalLevelStars,
                  inferno: infernoLevelStars,
                  void: voidLevelStars,
                  neon: neonLevelStars,
                  shadow: shadowLevelStars,
                  quantum: quantumLevelStars,
                  labyrinth: labyrinthLevelStars,
                  frozen: frozenLevelStars,
                }}
              />
            </motion.div>
          )}
          {screen === "collection" && (
            <motion.div
              key="collection"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideTransition}
            >
              <CollectionScreen
                coins={coins}
                ownedSkins={ownedSkins}
                activeSkin={activeSkin}
                onBuy={handleSkinBuy}
                onSelect={handleSkinSelect}
                onBack={handleBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showTutorial && (
            <TutorialOverlay onClose={() => setShowTutorial(false)} />
          )}
        </AnimatePresence>
        {!showTutorial && (loginRewardInfo.shouldShow || showManualReward) && (
          <LoginRewardPopup
            info={loginRewardInfo}
            onClaim={handleClaimLoginReward}
          />
        )}
      </div>
      <GlobalAudioToggle />
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
