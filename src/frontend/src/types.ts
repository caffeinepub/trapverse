export type CellType =
  | "bronze"
  | "silver"
  | "gold"
  | "diamond"
  | "bomb"
  | "chain_bomb"
  | "frozen"
  | "dark";

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

export type Universe =
  | "candy"
  | "jungle"
  | "crystal"
  | "inferno"
  | "void"
  | "neon"
  | "shadow"
  | "quantum"
  | "labyrinth"
  | "frozen";

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
  dark: 0,
};

export const UNIVERSE_GRID_SIZE: Record<Universe, number> = {
  candy: 5,
  jungle: 6,
  crystal: 7,
  inferno: 8,
  void: 9,
  neon: 10,
  shadow: 9,
  quantum: 8,
  labyrinth: 10,
  frozen: 9,
};

export const LEVEL_TARGETS = [
  70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 215, 230,
  245, 260, 280, 300, 350,
];
export const LEVEL_TARGETS_JUNGLE = [
  90, 100, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305,
  320, 340, 360, 380, 450,
];
export const LEVEL_TARGETS_CRYSTAL = [
  110, 125, 140, 158, 176, 194, 212, 230, 250, 270, 290, 310, 330, 350, 370,
  390, 410, 435, 460, 490, 560,
];
export const LEVEL_TARGETS_INFERNO = [
  140, 160, 180, 200, 220, 245, 270, 295, 320, 345, 370, 395, 420, 445, 470,
  495, 520, 550, 580, 615, 700,
];
export const LEVEL_TARGETS_VOID = [
  170, 195, 220, 248, 276, 305, 334, 364, 395, 427, 460, 494, 528, 563, 599,
  636, 674, 712, 752, 795, 900,
];
export const LEVEL_TARGETS_NEON = [
  190, 220, 250, 283, 316, 352, 388, 426, 464, 504, 545, 587, 630, 675, 720,
  768, 816, 868, 924, 984, 1100,
];
export const LEVEL_TARGETS_SHADOW = [
  170, 195, 220, 248, 276, 305, 334, 364, 395, 427, 460, 494, 528, 563, 599,
  636, 674, 712, 752, 795, 900,
];
export const LEVEL_TARGETS_QUANTUM = [
  140, 160, 180, 200, 220, 245, 270, 295, 320, 345, 370, 395, 420, 445, 470,
  495, 520, 550, 580, 615, 700,
];
export const LEVEL_TARGETS_LABYRINTH = [
  200, 230, 262, 296, 332, 370, 410, 452, 496, 542, 590, 640, 692, 746, 803,
  862, 923, 988, 1056, 1126, 1260,
];
export const LEVEL_TARGETS_FROZEN = [
  175, 202, 231, 262, 295, 330, 367, 406, 447, 490, 535, 582, 631, 682, 735,
  790, 848, 908, 970, 1034, 1160,
];
