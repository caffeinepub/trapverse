import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface TutorialOverlayProps {
  onClose: () => void;
}

const steps = [
  {
    id: "welcome",
    emoji: "💣",
    titleKey: "tutorial.step1.title",
    descKey: "tutorial.step1.desc",
  },
  {
    id: "grid",
    emoji: "🔢",
    titleKey: "tutorial.step2.title",
    descKey: "tutorial.step2.desc",
  },
  {
    id: "bombs",
    emoji: "💥",
    titleKey: "tutorial.step3.title",
    descKey: "tutorial.step3.desc",
  },
  {
    id: "powerups",
    emoji: "⚡",
    titleKey: "tutorial.step4.title",
    descKey: "tutorial.step4.desc",
  },
  {
    id: "stars",
    emoji: "⭐",
    titleKey: "tutorial.step5.title",
    descKey: "tutorial.step5.desc",
  },
];

export function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();

  const finish = () => {
    localStorage.setItem("trapverse_tutorial_done", "1");
    onClose();
  };

  const next = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else finish();
  };

  const current = steps[step];

  return (
    <motion.div
      data-ocid="tutorial.modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5, 3, 18, 0.88)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.18 0.06 280), oklch(0.13 0.08 300))",
          border: "1px solid oklch(0.35 0.15 280 / 0.5)",
          boxShadow:
            "0 0 60px oklch(0.45 0.2 280 / 0.3), 0 24px 48px rgba(0,0,0,0.6)",
        }}
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        {/* Top glow accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.6 0.25 280), transparent)",
          }}
        />

        <div className="p-7 flex flex-col items-center text-center gap-5">
          {/* Skip */}
          <button
            type="button"
            data-ocid="tutorial.cancel_button"
            onClick={finish}
            className="absolute top-4 right-4 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
            style={{
              color: "oklch(0.75 0.1 280)",
              minHeight: 44,
              minWidth: 44,
            }}
          >
            {t("tutorial.skip")}
          </button>

          {/* Emoji */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="text-6xl"
            >
              {current.emoji}
            </motion.div>
          </AnimatePresence>

          {/* Title + Desc */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-3"
            >
              <h2
                className="text-xl font-bold leading-tight"
                style={{
                  color: "oklch(0.92 0.08 280)",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {t(current.titleKey)}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.72 0.06 280)" }}
              >
                {t(current.descKey)}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Step dots */}
          <div className="flex gap-2 mt-1">
            {steps.map((s, i) => (
              <motion.div
                key={s.id}
                animate={{
                  width: i === step ? 20 : 8,
                  background:
                    i === step ? "oklch(0.65 0.25 280)" : "oklch(0.35 0.1 280)",
                }}
                className="h-2 rounded-full"
                transition={{ duration: 0.25 }}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            type="button"
            data-ocid={
              step === steps.length - 1
                ? "tutorial.confirm_button"
                : "tutorial.primary_button"
            }
            onClick={next}
            className="w-full py-3.5 rounded-xl font-bold text-base transition-all active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.5 0.28 280), oklch(0.45 0.28 310))",
              color: "oklch(0.97 0.03 280)",
              boxShadow: "0 4px 20px oklch(0.5 0.28 280 / 0.4)",
              minHeight: 52,
            }}
          >
            {step === steps.length - 1
              ? t("tutorial.play")
              : t("tutorial.next")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
