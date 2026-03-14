export type CellType =
  | "bronze"
  | "silver"
  | "gold"
  | "diamond"
  | "bomb"
  | "chain_bomb"
  | "frozen";

export type GamePhase = "playing" | "won" | "lost";

export type Screen =
  | "home"
  | "level-select"
  | "game"
  | "shop"
  | "howToPlay"
  | "quests"
  | "achievements"
  | "stats"
  | "settings"
  | "collection";

export type Universe = "candy" | "jungle" | "crystal" | "inferno";

export interface Cell {
  id: number;
  type: CellType;
  revealed: boolean;
  adjacentBombs: number;
  /** Candy boss: bombs disguised as this collectible type when face-down */
  disguisedAs?: CellType;
}

export interface PowerupCounts {
  detector: number;
  multiplier: number;
  shield: number;
}

export interface LevelStar {
  stars: number;
  completed: boolean;
}

export type QuestType =
  | "win_levels"
  | "earn_coins"
  | "win_3stars"
  | "beat_boss";

export interface Quest {
  id: string;
  type: QuestType;
  target: number;
  progress: number;
  reward: number;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  unlocked: boolean;
  progress: number;
  target: number;
  titleKey?: string;
  descKey?: string;
  icon?: string;
}

export interface GameStats {
  levelsCompleted: number;
  starsEarned: number;
  coinsEarned: number;
  bossesBeaten: number;
  wins: number;
  losses: number;
  threeStarWins: number;
}

export const POWERUP_COSTS: Record<
  "detector" | "multiplier" | "shield",
  number
> = {
  detector: 30,
  multiplier: 50,
  shield: 40,
};

export const CELL_POINTS: Record<CellType, number> = {
  bronze: 10,
  silver: 20,
  gold: 40,
  diamond: 80,
  bomb: 0,
  chain_bomb: 0,
  frozen: 0,
};

export const UNIVERSE_GRID_SIZE: Record<Universe, number> = {
  candy: 5,
  jungle: 6,
  crystal: 7,
  inferno: 8,
};

export const LEVEL_TARGETS = [
  80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 300,
];
export const LEVEL_TARGETS_JUNGLE = [
  100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 350,
];
export const LEVEL_TARGETS_CRYSTAL = [
  120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 450,
];
export const LEVEL_TARGETS_INFERNO = [
  150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 500,
];
