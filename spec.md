# TrapVerse

## Current State
- 4 universe game with GameBoardScreen, LevelSelectScreen, CollectionScreen
- Universe backgrounds exist as CSS classes: `candy-bg`, `jungle-bg`, `crystal-bg`, `inferno-bg` — basic radial gradient meshes
- Tiles use shared CSS class `cell-face-down` (same purple/blue for ALL universes — no universe theming)
- Skin system exists: `getCellStyle()` applies inline styles only for non-classic skins; classic skin returns `{}` so CSS class is sole styling
- Revealed tile types: bronze, silver, gold, diamond, bomb, chain_bomb with their own CSS classes
- `universe` prop is available in `GameBoard` component already

## Requested Changes (Diff)

### Add
- Universe-themed closed tile variants in CSS: `cell-face-down-candy`, `cell-face-down-jungle`, `cell-face-down-crystal`, `cell-face-down-inferno`
  - Candy Cosmos: pink/magenta candy colors (oklch purples-pinks)
  - Mystic Jungle: deep green, earthy moss tones
  - Crystal Storm: icy blue-white crystalline
  - Solar Inferno: deep orange-red volcanic
- Each variant should have distinct border, gradient, box-shadow glow in theme color
- Richer universe backgrounds: add subtle animated particle-like CSS pseudo-elements or keyframe shimmer to backgrounds; increase depth and richness. The background should feel immersive.
- `cell-warning` universe-specific pulse glow variants for the warning tiles matching universe color

### Modify
- `GameBoardScreen.tsx`: change `cell-face-down` class to `cell-face-down-${universe}` when classic skin active (when `!skinDef`)
- `LevelSelectScreen.tsx`: ensure universe background classes give a rich themed feel — update if needed
- `index.css`: upgrade all 4 `*-bg` classes to be richer (deeper gradients, more radial layers, stronger color saturation), add keyframe shimmer/pulse animation to them
- Skin styles in CollectionScreen: update `classic` skin `closedStyle` to be neutral (it won't be used for classic since we use CSS classes, so it's just preview) — keep as is

### Remove
- Nothing removed

## Implementation Plan
1. Update `index.css`:
   - Enrich 4 universe background classes with stronger gradients and a subtle `@keyframes` shimmer/pulse animation applied
   - Add 4 `cell-face-down-{universe}` CSS classes with universe-themed colors and glow
   - Add 4 warning variants or keep warning as complementary
2. Update `GameBoardScreen.tsx`:
   - In the cell className, replace `cell-face-down` with `cell-face-down-${universe}` for revealed=false, non-frozen cells
   - Keep frozen as `cell-frozen`, keep warning class addition
3. Validate build passes
