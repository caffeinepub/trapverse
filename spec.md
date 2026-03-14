# TrapVerse

## Current State
TrapVerse has 6 universes (candy, jungle, crystal, inferno, void, neon), each with 20 regular levels + 1 boss (126 total). Grid size increases with each universe (5x5 to 10x10). Boss mechanics include hidden bombs, chain reaction, frozen tiles, burn timer, void darkening, and neon virus spread.

## Requested Changes (Diff)

### Add
- Universe 7: Shadow Dimension (9x9 grid, dark purple/black theme)
  - Difficulty: Limited Vision -- unrevealed cells start dark; tapping reveals adjacent area
  - Boss mechanic: Vision radius shrinks every 10 seconds
- Universe 8: Quantum Realm (8x8 grid, blue/teal theme)
  - Difficulty: Memory Mode -- board shown for 3s at start, then numbers hidden
  - Boss mechanic: Board flashes visible for 2s every 20 seconds

### Modify
- types.ts, useGameState.ts, useGameStorage.ts, App.tsx, HomeScreen.tsx, GameBoardScreen.tsx, index.css, translations.ts

### Remove
- Nothing

## Implementation Plan
1. Update types.ts
2. Update useGameStorage.ts
3. Update useGameState.ts  
4. Update index.css
5. Update translations.ts
6. Update HomeScreen.tsx
7. Update App.tsx
8. Update GameBoardScreen.tsx
