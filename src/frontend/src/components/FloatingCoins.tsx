import { AnimatePresence, motion } from "motion/react";

interface FloatingCoinsProps {
  active: boolean;
  amount: number;
}

export function FloatingCoins({ active, amount }: FloatingCoinsProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="floating-coins"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -60, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="absolute left-1/2 bottom-24 -translate-x-1/2 z-[60] pointer-events-none"
        >
          <div className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-candy-gold/40 rounded-full px-4 py-2 shadow-xl">
            <span className="text-lg">🪙</span>
            <span className="font-display font-extrabold text-candy-gold text-xl">
              +{amount}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
