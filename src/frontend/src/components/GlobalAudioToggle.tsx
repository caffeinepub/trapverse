import { useEffect, useState } from "react";

export function GlobalAudioToggle() {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("trapverse_audio_enabled");
    return saved === null ? true : saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("trapverse_audio_enabled", String(audioEnabled));
    try {
      (window as any).AndroidAudioBridge?.setAudioEnabled?.(audioEnabled);
    } catch {
      /* ignore */
    }
  }, [audioEnabled]);

  const toggle = () => setAudioEnabled((prev) => !prev);

  return (
    <button
      type="button"
      data-ocid="global.audio.toggle"
      onClick={toggle}
      className="fixed top-3 right-3 z-[9999] w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white shadow-lg active:scale-95 transition-transform"
      aria-label={audioEnabled ? "Sesi Kapat" : "Sesi A\u00e7"}
    >
      {audioEnabled ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <title>Ses A\u00e7\u0131k</title>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 opacity-60"
          aria-hidden="true"
        >
          <title>Ses Kapal\u0131</title>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
