import { useCallback, useState } from "react";
import type {
  Achievement,
  GameStats,
  LevelStar,
  PowerupCounts,
  Quest,
  QuestType,
} from "../types";

const KEYS = {
  coins: "trapverse_coins",
  levelStars: "trapverse_level_stars",
  jungleLevelStars: "trapverse_jungle_level_stars",
  crystalLevelStars: "trapverse_crystal_level_stars",
  infernoLevelStars: "trapverse_inferno_level_stars",
  voidLevelStars: "trapverse_void_level_stars",
  neonLevelStars: "trapverse_neon_level_stars",
  shadowLevelStars: "trapverse_shadow_level_stars",
  quantumLevelStars: "trapverse_quantum_level_stars",
  powerups: "trapverse_powerups",
  quests: "trapverse_quests",
  questDate: "trapverse_quest_date",
  achievements: "trapverse_achievements",
  loginRewardDay: "trapverse_login_day",
  loginRewardDate: "trapverse_login_date",
  stats: "trapverse_stats",
};

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const QUEST_TYPES: QuestType[] = [
  "win_levels",
  "earn_coins",
  "win_3stars",
  "beat_boss",
];

function generateQuests(): Quest[] {
  const shuffled = [...QUEST_TYPES].sort(() => Math.random() - 0.5).slice(0, 3);
  return shuffled.map((type, i) => {
    let target = 1;
    if (type === "win_levels") target = randInt(3, 5);
    else if (type === "earn_coins") target = randInt(50, 150);
    else if (type === "win_3stars") target = randInt(2, 3);
    else if (type === "beat_boss") target = 1;
    return {
      id: `quest_${i}_${Date.now()}`,
      type,
      target,
      progress: 0,
      reward: type === "beat_boss" ? 80 : type === "earn_coins" ? 30 : 50,
      claimed: false,
    };
  });
}

const ACHIEVEMENT_DEFS: Omit<Achievement, "progress" | "unlocked">[] = [
  {
    id: "first_step",
    titleKey: "ach.first_step.title",
    descKey: "ach.first_step.desc",
    icon: "🎯",
    target: 1,
  },
  {
    id: "level_5",
    titleKey: "ach.level_5.title",
    descKey: "ach.level_5.desc",
    icon: "🏃",
    target: 5,
  },
  {
    id: "level_10",
    titleKey: "ach.level_10.title",
    descKey: "ach.level_10.desc",
    icon: "⚡",
    target: 10,
  },
  {
    id: "level_25",
    titleKey: "ach.level_25.title",
    descKey: "ach.level_25.desc",
    icon: "🚀",
    target: 25,
  },
  {
    id: "level_44",
    titleKey: "ach.level_44.title",
    descKey: "ach.level_44.desc",
    icon: "👑",
    target: 44,
  },
  {
    id: "level_66",
    titleKey: "ach.level_66.title",
    descKey: "ach.level_66.desc",
    icon: "🌌",
    target: 66,
  },
  {
    id: "coin_100",
    titleKey: "ach.coin_100.title",
    descKey: "ach.coin_100.desc",
    icon: "🪙",
    target: 100,
  },
  {
    id: "coin_500",
    titleKey: "ach.coin_500.title",
    descKey: "ach.coin_500.desc",
    icon: "💰",
    target: 500,
  },
  {
    id: "coin_1000",
    titleKey: "ach.coin_1000.title",
    descKey: "ach.coin_1000.desc",
    icon: "💎",
    target: 1000,
  },
  {
    id: "star_10",
    titleKey: "ach.star_10.title",
    descKey: "ach.star_10.desc",
    icon: "⭐",
    target: 10,
  },
  {
    id: "star_30",
    titleKey: "ach.star_30.title",
    descKey: "ach.star_30.desc",
    icon: "🌟",
    target: 30,
  },
  {
    id: "boss_first",
    titleKey: "ach.boss_first.title",
    descKey: "ach.boss_first.desc",
    icon: "🏆",
    target: 1,
  },
  {
    id: "boss_all",
    titleKey: "ach.boss_all.title",
    descKey: "ach.boss_all.desc",
    icon: "🎖️",
    target: 6,
  },
  {
    id: "three_stars",
    titleKey: "ach.three_stars.title",
    descKey: "ach.three_stars.desc",
    icon: "✨",
    target: 5,
  },
  {
    id: "no_powerup",
    titleKey: "ach.no_powerup.title",
    descKey: "ach.no_powerup.desc",
    icon: "💪",
    target: 3,
  },
  {
    id: "all_universes",
    titleKey: "ach.all_universes.title",
    descKey: "ach.all_universes.desc",
    icon: "🌌",
    target: 6,
  },
];

function loadAchievements(): Achievement[] {
  try {
    const saved = localStorage.getItem(KEYS.achievements);
    const savedMap: Record<string, { progress: number; unlocked: boolean }> =
      saved ? JSON.parse(saved) : {};
    return ACHIEVEMENT_DEFS.map((def) => ({
      ...def,
      progress: savedMap[def.id]?.progress ?? 0,
      unlocked: savedMap[def.id]?.unlocked ?? false,
    }));
  } catch {
    return ACHIEVEMENT_DEFS.map((def) => ({
      ...def,
      progress: 0,
      unlocked: false,
    }));
  }
}

function saveAchievements(achievements: Achievement[]) {
  try {
    const map: Record<string, { progress: number; unlocked: boolean }> = {};
    for (const a of achievements) {
      map[a.id] = { progress: a.progress, unlocked: a.unlocked };
    }
    localStorage.setItem(KEYS.achievements, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

function loadQuests(): Quest[] {
  const today = getTodayStr();
  try {
    const savedDate = localStorage.getItem(KEYS.questDate);
    if (savedDate === today) {
      const saved = localStorage.getItem(KEYS.quests);
      if (saved) return JSON.parse(saved) as Quest[];
    }
  } catch {
    /* ignore */
  }
  const newQuests = generateQuests();
  try {
    localStorage.setItem(KEYS.questDate, today);
    localStorage.setItem(KEYS.quests, JSON.stringify(newQuests));
  } catch {
    /* ignore */
  }
  return newQuests;
}

function loadStats(): GameStats {
  try {
    const saved = localStorage.getItem(KEYS.stats);
    if (saved) return JSON.parse(saved) as GameStats;
  } catch {
    /* ignore */
  }
  return {
    levelsCompleted: 0,
    starsEarned: 0,
    coinsEarned: 0,
    bossesBeaten: 0,
    wins: 0,
    losses: 0,
    threeStarWins: 0,
  };
}

const LOGIN_REWARDS = [
  { day: 1, coins: 20, powerup: null as null | string, extra: 0 },
  { day: 2, coins: 30, powerup: null, extra: 0 },
  { day: 3, coins: 0, powerup: "detector", extra: 1 },
  { day: 4, coins: 50, powerup: null, extra: 0 },
  { day: 5, coins: 0, powerup: "multiplier", extra: 1 },
  { day: 6, coins: 75, powerup: null, extra: 0 },
  { day: 7, coins: 100, powerup: "shield", extra: 1 },
];

function loadLoginReward() {
  const today = getTodayStr();
  try {
    const lastDate = localStorage.getItem(KEYS.loginRewardDate);
    const savedDay = Number.parseInt(
      localStorage.getItem(KEYS.loginRewardDay) || "0",
      10,
    );
    if (lastDate === today) {
      return { day: savedDay, shouldShow: false };
    }
    const nextDay = savedDay >= 7 ? 1 : savedDay + 1;
    return { day: nextDay, shouldShow: true };
  } catch {
    return { day: 1, shouldShow: true };
  }
}

function loadCoins(): number {
  try {
    const v = localStorage.getItem(KEYS.coins);
    return v ? Number.parseInt(v, 10) : 100;
  } catch {
    return 100;
  }
}

function loadLevelStars(key: string): LevelStar[] {
  try {
    const v = localStorage.getItem(key);
    if (v) return JSON.parse(v) as LevelStar[];
  } catch {
    /* ignore */
  }
  return Array(21).fill({ stars: 0, completed: false });
}

function loadPowerups(): PowerupCounts {
  try {
    const v = localStorage.getItem(KEYS.powerups);
    if (v) return JSON.parse(v) as PowerupCounts;
  } catch {
    /* ignore */
  }
  return { detector: 0, multiplier: 0, shield: 0 };
}

export function useGameStorage() {
  const [coins, setCoinsState] = useState<number>(loadCoins);
  const [levelStars, setLevelStarsState] = useState<LevelStar[]>(() =>
    loadLevelStars(KEYS.levelStars),
  );
  const [jungleLevelStars, setJungleLevelStarsState] = useState<LevelStar[]>(
    () => loadLevelStars(KEYS.jungleLevelStars),
  );
  const [crystalLevelStars, setCrystalLevelStarsState] = useState<LevelStar[]>(
    () => loadLevelStars(KEYS.crystalLevelStars),
  );
  const [infernoLevelStars, setInfernoLevelStarsState] = useState<LevelStar[]>(
    () => loadLevelStars(KEYS.infernoLevelStars),
  );
  const [voidLevelStars, setVoidLevelStarsState] = useState<LevelStar[]>(() =>
    loadLevelStars(KEYS.voidLevelStars),
  );
  const [neonLevelStars, setNeonLevelStarsState] = useState<LevelStar[]>(() =>
    loadLevelStars(KEYS.neonLevelStars),
  );
  const [shadowLevelStars, setShadowLevelStarsState] = useState<LevelStar[]>(
    () => loadLevelStars(KEYS.shadowLevelStars),
  );
  const [quantumLevelStars, setQuantumLevelStarsState] = useState<LevelStar[]>(
    () => loadLevelStars(KEYS.quantumLevelStars),
  );
  const [powerups, setPowerupsState] = useState<PowerupCounts>(loadPowerups);
  const [quests, setQuestsState] = useState<Quest[]>(loadQuests);
  const [achievements, setAchievementsState] =
    useState<Achievement[]>(loadAchievements);
  const [stats, setStatsState] = useState<GameStats>(loadStats);
  const [loginRewardState] = useState(() => loadLoginReward());
  const [loginRewardSeen, setLoginRewardSeen] = useState(false);

  const setCoins = useCallback((value: number | ((prev: number) => number)) => {
    setCoinsState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try {
        localStorage.setItem(KEYS.coins, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const makeLevelStarsSetter =
    (
      setState: React.Dispatch<React.SetStateAction<LevelStar[]>>,
      storageKey: string,
    ) =>
    (index: number, stars: number, completed: boolean) => {
      setState((prev) => {
        const next = [...prev];
        if (stars > (next[index]?.stars ?? 0) || completed) {
          next[index] = {
            stars: Math.max(stars, next[index]?.stars ?? 0),
            completed,
          };
        }
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    };

  const setLevelStars = useCallback(
    makeLevelStarsSetter(setLevelStarsState, KEYS.levelStars),
    [],
  );
  const setJungleLevelStars = useCallback(
    makeLevelStarsSetter(setJungleLevelStarsState, KEYS.jungleLevelStars),
    [],
  );
  const setCrystalLevelStars = useCallback(
    makeLevelStarsSetter(setCrystalLevelStarsState, KEYS.crystalLevelStars),
    [],
  );
  const setInfernoLevelStars = useCallback(
    makeLevelStarsSetter(setInfernoLevelStarsState, KEYS.infernoLevelStars),
    [],
  );
  const setVoidLevelStars = useCallback(
    makeLevelStarsSetter(setVoidLevelStarsState, KEYS.voidLevelStars),
    [],
  );
  const setNeonLevelStars = useCallback(
    makeLevelStarsSetter(setNeonLevelStarsState, KEYS.neonLevelStars),
    [],
  );
  const setShadowLevelStars = useCallback(
    makeLevelStarsSetter(setShadowLevelStarsState, KEYS.shadowLevelStars),
    [],
  );
  const setQuantumLevelStars = useCallback(
    makeLevelStarsSetter(setQuantumLevelStarsState, KEYS.quantumLevelStars),
    [],
  );

  const setPowerups = useCallback(
    (value: PowerupCounts | ((prev: PowerupCounts) => PowerupCounts)) => {
      setPowerupsState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          localStorage.setItem(KEYS.powerups, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const setQuests = useCallback(
    (value: Quest[] | ((prev: Quest[]) => Quest[])) => {
      setQuestsState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          localStorage.setItem(KEYS.quests, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const claimQuest = useCallback((questId: string) => {
    setQuestsState((prev) => {
      const next = prev.map((q) =>
        q.id === questId && q.progress >= q.target && !q.claimed
          ? { ...q, claimed: true }
          : q,
      );
      try {
        localStorage.setItem(KEYS.quests, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const updateAchievementProgress = useCallback(
    (id: string, progress: number) => {
      setAchievementsState((prev) => {
        const next = prev.map((a) => {
          if (a.id !== id) return a;
          const newProgress = Math.max(a.progress, progress);
          return {
            ...a,
            progress: newProgress,
            unlocked: newProgress >= a.target,
          };
        });
        saveAchievements(next);
        return next;
      });
    },
    [],
  );

  const updateStats = useCallback((delta: Partial<GameStats>) => {
    setStatsState((prev) => {
      const next: GameStats = {
        levelsCompleted: prev.levelsCompleted + (delta.levelsCompleted ?? 0),
        starsEarned: prev.starsEarned + (delta.starsEarned ?? 0),
        coinsEarned: prev.coinsEarned + (delta.coinsEarned ?? 0),
        bossesBeaten: prev.bossesBeaten + (delta.bossesBeaten ?? 0),
        wins: prev.wins + (delta.wins ?? 0),
        losses: prev.losses + (delta.losses ?? 0),
        threeStarWins: prev.threeStarWins + (delta.threeStarWins ?? 0),
      };
      try {
        localStorage.setItem(KEYS.stats, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const markLoginRewardSeen = useCallback(() => {
    setLoginRewardSeen(true);
    const today = getTodayStr();
    try {
      localStorage.setItem(KEYS.loginRewardDate, today);
      localStorage.setItem(KEYS.loginRewardDay, String(loginRewardState.day));
    } catch {
      /* ignore */
    }
  }, [loginRewardState.day]);

  const loginRewardInfo = {
    day: loginRewardState.day,
    reward: LOGIN_REWARDS[loginRewardState.day - 1] ?? LOGIN_REWARDS[0],
    shouldShow: loginRewardState.shouldShow && !loginRewardSeen,
  };

  return {
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
    powerups,
    setPowerups,
    quests,
    setQuests,
    claimQuest,
    achievements,
    updateAchievementProgress,
    stats,
    updateStats,
    loginRewardInfo,
    markLoginRewardSeen,
  };
}
