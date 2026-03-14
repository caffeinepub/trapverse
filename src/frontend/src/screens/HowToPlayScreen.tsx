import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

interface HowToPlayScreenProps {
  onBack: () => void;
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

export function HowToPlayScreen({ onBack }: HowToPlayScreenProps) {
  const { t } = useLanguage();

  return (
    <div
      data-ocid="howtoplay.page"
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.1 0.06 280)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10"
        style={{
          background: "oklch(0.1 0.06 280 / 0.95)",
          borderBottom: "1px solid oklch(0.25 0.08 280 / 0.5)",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          data-ocid="howtoplay.close_button"
          type="button"
          onClick={onBack}
          className="flex items-center justify-center rounded-xl transition-all active:scale-95"
          style={{
            background: "oklch(0.2 0.08 280)",
            color: "oklch(0.8 0.15 280)",
            minWidth: 44,
            minHeight: 44,
            width: 44,
            height: 44,
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1
          className="text-lg font-bold"
          style={{
            color: "oklch(0.92 0.08 280)",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          {t("howToPlay.title")}
        </h1>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            data-ocid={`howtoplay.item.${i + 1}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="rounded-2xl p-5 flex gap-4 items-start"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.17 0.07 280), oklch(0.14 0.08 300))",
              border: "1px solid oklch(0.3 0.12 280 / 0.4)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: "oklch(0.22 0.1 280)" }}
            >
              {step.emoji}
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(0.45 0.2 280 / 0.3)",
                    color: "oklch(0.72 0.2 280)",
                  }}
                >
                  {i + 1}
                </span>
                <h3
                  className="font-bold text-base"
                  style={{
                    color: "oklch(0.92 0.08 280)",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  {t(step.titleKey)}
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.65 0.07 280)" }}
              >
                {t(step.descKey)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
