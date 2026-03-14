import { useCallback, useEffect, useRef, useState } from "react";
import {
  CELL_POINTS,
  type Cell,
  type CellType,
  type GamePhase,
  LEVEL_TARGETS,
  LEVEL_TARGETS_CRYSTAL,
  LEVEL_TARGETS_INFERNO,
  LEVEL_TARGETS_JUNGLE,
  UNIVERSE_GRID_SIZE,
  type Universe,
} from "../types";
import { Haptics } from "../utils/haptics";

const SAVE_KEY = "trapverse_level_save";

interface LevelSaveData {
  level: number;
  universe: Universe;
  grid: Cell[];
  score: number;
  burnTimeLeft: number | null;
}

function loadSave(level: number, universe: Universe): LevelSaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data: LevelSaveData = JSON.parse(raw);
    if (data.level === level && data.universe === universe) return data;
  } catch {
    /* ignore */
  }
  return null;
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}

const playSound = (name: string) => {
  try {
    (window as any).AndroidAudioBridge?.playSound(name);
  } catch {
    /* ignore */
  }
};

const DISGUISE_POOL: CellType[] = ["gold", "diamond", "silver", "gold", "gold"];

function generateGrid(level: number, universe: Universe): Cell[] {
  const gridSize = UNIVERSE_GRID_SIZE[universe];
  const totalCells = gridSize * gridSize;
  const isBoss = level === 11;

  let bombCount: number;
  let chainBombCount = 0;
  let frozenCount = 0;

  if (universe === "jungle") {
    if (isBoss) {
      chainBombCount = 5;
      bombCount = 4;
    } else {
      bombCount = Math.round(totalCells * 0.2);
    }
  } else if (universe === "crystal") {
    bombCount = Math.round(totalCells * 0.25);
    if (isBoss) {
      frozenCount = Math.round(totalCells * 0.2);
    }
  } else if (universe === "inferno") {
    bombCount = Math.round(totalCells * 0.3);
  } else {
    // candy
    if (isBoss) {
      bombCount = 7;
    } else {
      bombCount = 4;
      if (level >= 8) bombCount = 5;
    }
  }

  const nonBombCount = totalCells - bombCount - chainBombCount - frozenCount;

  const diamondCount = Math.max(1, Math.round(nonBombCount * 0.04));
  const goldCount = Math.max(2, Math.round(nonBombCount * 0.16));
  const silverCount = Math.max(3, Math.round(nonBombCount * 0.24));
  const bronzeCount = nonBombCount - diamondCount - goldCount - silverCount;

  const types: CellType[] = [
    ...Array<CellType>(bombCount).fill("bomb"),
    ...Array<CellType>(chainBombCount).fill("chain_bomb"),
    ...Array<CellType>(frozenCount).fill("frozen"),
    ...Array<CellType>(diamondCount).fill("diamond"),
    ...Array<CellType>(goldCount).fill("gold"),
    ...Array<CellType>(silverCount).fill("silver"),
    ...Array<CellType>(Math.max(0, bronzeCount)).fill("bronze"),
  ];

  while (types.length < totalCells) types.push("bronze");
  types.splice(totalCells);

  // Fischer-Yates shuffle
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = types[i];
    types[i] = types[j];
    types[j] = tmp;
  }

  const grid: Cell[] = types.map((type, idx) => ({
    id: idx,
    type,
    revealed: false,
    adjacentBombs: 0,
  }));

  // Candy boss: disguise bombs as high-value collectibles
  if (universe === "candy" && isBoss) {
    grid.forEach((cell, i) => {
      if (cell.type === "bomb") {
        grid[i] = {
          ...cell,
          disguisedAs: DISGUISE_POOL[i % DISGUISE_POOL.length],
        };
      }
    });
  }

  // Calculate adjacent bombs
  for (let i = 0; i < totalCells; i++) {
    if (
      grid[i].type === "bomb" ||
      grid[i].type === "chain_bomb" ||
      grid[i].type === "frozen"
    )
      continue;
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
          const neighbor = grid[nr * gridSize + nc];
          if (neighbor.type === "bomb" || neighbor.type === "chain_bomb")
            count++;
        }
      }
    }
    grid[i] = { ...grid[i], adjacentBombs: count };
  }

  return grid;
}

function getTargets(universe: Universe) {
  switch (universe) {
    case "jungle":
      return LEVEL_TARGETS_JUNGLE;
    case "crystal":
      return LEVEL_TARGETS_CRYSTAL;
    case "inferno":
      return LEVEL_TARGETS_INFERNO;
    default:
      return LEVEL_TARGETS;
  }
}

export function useGameState(
  level: number,
  universe: Universe = "candy",
  isPaused = false,
) {
  const isBoss = level === 11;
  const isInfernoBoss = universe === "inferno" && isBoss;
  const gridSize = UNIVERSE_GRID_SIZE[universe];
  const targets = getTargets(universe);
  const target = targets[level - 1] ?? 300;

  const [grid, setGrid] = useState<Cell[]>(() => {
    const save = loadSave(level, universe);
    return save ? save.grid : generateGrid(level, universe);
  });
  const [score, setScore] = useState<number>(() => {
    const save = loadSave(level, universe);
    return save ? save.score : 0;
  });
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [activePowerups, setActivePowerups] = useState({
    detector: false,
    multiplier: false,
    shield: false,
  });
  const [anyPowerupUsed, setAnyPowerupUsed] = useState(false);
  const [burnTimeLeft, setBurnTimeLeft] = useState<number | null>(() => {
    const save = loadSave(level, universe);
    if (save && save.burnTimeLeft !== null) return save.burnTimeLeft;
    return isInfernoBoss ? 40 : null;
  });
  // Track last frozen cell tapped for shake feedback
  const [frozenTappedIndex, setFrozenTappedIndex] = useState<number | null>(
    null,
  );
  const burnTickRef = useRef(0);
  const phaseRef = useRef<GamePhase>("playing");
  const prevBurnTimeRef = useRef<number | null>(isInfernoBoss ? 40 : null);

  const safeSetPhase = useCallback((newPhase: GamePhase) => {
    if (phaseRef.current === "playing") {
      phaseRef.current = newPhase;
      setPhase(newPhase);
      clearSave();
    }
  }, []);

  // Save progress to localStorage whenever grid or score changes
  useEffect(() => {
    if (phaseRef.current !== "playing") return;
    try {
      const data: LevelSaveData = {
        level,
        universe,
        grid,
        score,
        burnTimeLeft,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [grid, score, burnTimeLeft, level, universe]);

  useEffect(() => {
    const save = loadSave(level, universe);
    if (save) {
      setGrid(save.grid);
      setScore(save.score);
      if (save.burnTimeLeft !== null) setBurnTimeLeft(save.burnTimeLeft);
    } else {
      setGrid(generateGrid(level, universe));
      setScore(0);
      setBurnTimeLeft(universe === "inferno" && level === 11 ? 40 : null);
    }
    phaseRef.current = "playing";
    setPhase("playing");
    setActivePowerups({ detector: false, multiplier: false, shield: false });
    prevBurnTimeRef.current =
      universe === "inferno" && level === 11 ? 40 : null;
    burnTickRef.current = 0;
  }, [level, universe]);

  // Inferno boss burn timer — stops when paused
  useEffect(() => {
    if (!isInfernoBoss) return;
    if (phase !== "playing") return;
    if (isPaused) return;

    const interval = setInterval(() => {
      setBurnTimeLeft((prev) => {
        if (prev === null) return null;
        const next = prev - 1;
        // Haptic warning when time is low
        if (next === 10 || next === 5 || next === 3) {
          Haptics.burnWarning();
        }
        if (next <= 0) {
          safeSetPhase("lost");
          Haptics.explosion();
          return 0;
        }
        return next;
      });

      burnTickRef.current += 1;
      if (burnTickRef.current % 10 === 0) {
        setGrid((prev) => {
          const candidates = prev
            .map((c, i) => ({ c, i }))
            .filter(
              ({ c }) =>
                !c.revealed &&
                c.type !== "bomb" &&
                c.type !== "chain_bomb" &&
                c.type !== "frozen",
            );
          if (candidates.length === 0) return prev;
          const pick =
            candidates[Math.floor(Math.random() * candidates.length)];
          const next = [...prev];
          next[pick.i] = { ...next[pick.i], revealed: true };
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isInfernoBoss, phase, safeSetPhase, isPaused]);

  const resetGame = useCallback(() => {
    clearSave();
    setGrid(generateGrid(level, universe));
    setScore(0);
    phaseRef.current = "playing";
    setPhase("playing");
    setActivePowerups({ detector: false, multiplier: false, shield: false });
    setBurnTimeLeft(universe === "inferno" && level === 11 ? 40 : null);
    prevBurnTimeRef.current =
      universe === "inferno" && level === 11 ? 40 : null;
    burnTickRef.current = 0;
  }, [level, universe]);

  const triggerChainReaction = useCallback(
    (startIndex: number, currentGrid: Cell[]): Cell[] => {
      const newGrid = [...currentGrid];
      const visited = new Set<number>();
      const queue = [startIndex];

      while (queue.length > 0) {
        const idx = queue.shift()!;
        if (visited.has(idx)) continue;
        visited.add(idx);
        newGrid[idx] = { ...newGrid[idx], revealed: true };

        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
              const nIdx = nr * gridSize + nc;
              if (
                !visited.has(nIdx) &&
                !newGrid[nIdx].revealed &&
                (newGrid[nIdx].type === "bomb" ||
                  newGrid[nIdx].type === "chain_bomb")
              ) {
                queue.push(nIdx);
              }
            }
          }
        }
      }
      return newGrid.map((c) =>
        c.type === "bomb" || c.type === "chain_bomb"
          ? { ...c, revealed: true }
          : c,
      );
    },
    [gridSize],
  );

  const revealCell = useCallback(
    (index: number) => {
      if (phaseRef.current !== "playing") return;
      const cell = grid[index];
      if (!cell || cell.revealed) return;
      if (cell.type === "frozen") {
        // Frozen tile: provide haptic + shake feedback, block reveal
        Haptics.tap();
        setFrozenTappedIndex(index);
        setTimeout(() => setFrozenTappedIndex(null), 500);
        return;
      }

      playSound("tap");
      Haptics.tap();

      if (cell.type === "chain_bomb") {
        playSound("chain_bomb");
        if (activePowerups.shield) {
          playSound("powerup");
          Haptics.powerup();
          setActivePowerups((prev) => ({ ...prev, shield: false }));
          setGrid((prev) =>
            prev.map((c, i) => (i === index ? { ...c, revealed: true } : c)),
          );
        } else {
          Haptics.explosion();
          setGrid((prev) => triggerChainReaction(index, prev));
          safeSetPhase("lost");
        }
        return;
      }

      if (cell.type === "bomb") {
        if (activePowerups.shield) {
          playSound("powerup");
          Haptics.powerup();
          setActivePowerups((prev) => ({ ...prev, shield: false }));
          setGrid((prev) =>
            prev.map((c, i) => (i === index ? { ...c, revealed: true } : c)),
          );
        } else {
          playSound("bomb");
          Haptics.explosion();
          setGrid((prev) =>
            prev.map((c, i) =>
              i === index || c.type === "bomb" || c.type === "chain_bomb"
                ? { ...c, revealed: true }
                : c,
            ),
          );
          safeSetPhase("lost");
        }
      } else {
        const multiplier = activePowerups.multiplier ? 2 : 1;
        const points = CELL_POINTS[cell.type] * multiplier;
        playSound("collect");
        setGrid((prev) =>
          prev.map((c, i) => (i === index ? { ...c, revealed: true } : c)),
        );
        setScore((prev) => {
          const next = prev + points;
          if (next >= target) {
            setTimeout(() => {
              safeSetPhase("won");
              if (isBoss) {
                Haptics.bossWin();
              } else {
                Haptics.win();
              }
            }, 300);
            playSound("levelwin");
          }
          return next;
        });
      }
    },
    [grid, activePowerups, target, isBoss, triggerChainReaction, safeSetPhase],
  );

  const activatePowerup = useCallback(
    (type: "detector" | "multiplier" | "shield") => {
      if (phaseRef.current !== "playing") return;
      playSound("powerup");
      Haptics.powerup();
      setActivePowerups((prev) => ({ ...prev, [type]: true }));
      setAnyPowerupUsed(true);
    },
    [],
  );

  const starsEarned =
    score >= target * 2
      ? 3
      : score >= target * 1.5
        ? 2
        : score >= target
          ? 1
          : 0;

  const showDetectorWarning = (index: number): boolean => {
    if (universe === "candy" && isBoss) return false;
    if (!activePowerups.detector) return false;
    if (grid[index]?.type === "frozen") return false;
    return grid[index].adjacentBombs > 0 && !grid[index].revealed;
  };

  return {
    grid,
    score,
    phase,
    activePowerups,
    anyPowerupUsed,
    isBoss,
    target,
    gridSize,
    starsEarned,
    burnTimeLeft,
    frozenTappedIndex,
    revealCell,
    activatePowerup,
    resetGame,
    showDetectorWarning,
  };
}
