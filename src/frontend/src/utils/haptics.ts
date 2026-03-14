/**
 * Haptic feedback utility for Android WebView.
 * Uses navigator.vibrate() – supported in Android Chrome/WebView, silently ignored on iOS.
 */

function vibrate(pattern: number | number[]) {
  try {
    if (localStorage.getItem("trapverse_vibration_enabled") === "false") return;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // ignore – vibration not supported
  }
}

export const Haptics = {
  /** Light tap – cell reveal */
  tap: () => vibrate(30),

  /** Strong pulse – bomb explosion */
  explosion: () => vibrate([80, 40, 80, 40, 120]),

  /** Medium burst – level won */
  win: () => vibrate([50, 30, 50, 30, 80]),

  /** Short buzz – power-up activated */
  powerup: () => vibrate(50),

  /** Double tap – boss defeated */
  bossWin: () => vibrate([60, 30, 60, 30, 60, 30, 100]),

  /** Warning pulse – Inferno boss low time */
  burnWarning: () => vibrate([40, 20, 40]),
};
