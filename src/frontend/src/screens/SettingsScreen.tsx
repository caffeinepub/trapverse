import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { t, lang, setLang, languages } = useLanguage();

  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => {
    return localStorage.getItem("trapverse_vibration_enabled") !== "false";
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem("trapverse_sound_enabled") !== "false";
  });

  useEffect(() => {
    localStorage.setItem(
      "trapverse_vibration_enabled",
      vibrationEnabled ? "true" : "false",
    );
  }, [vibrationEnabled]);

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("trapverse_sound_enabled", enabled ? "true" : "false");
    try {
      if (enabled) {
        (window as any).AndroidAudioBridge?.setVolume?.(1.0);
        (window as any).AndroidAudioBridge?.setSoundEnabled?.(true);
      } else {
        (window as any).AndroidAudioBridge?.setVolume?.(0.0);
        (window as any).AndroidAudioBridge?.setSoundEnabled?.(false);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen candy-bg flex flex-col px-5 py-10 gap-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="settings.secondary_button"
          onClick={onBack}
          className="flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-full text-muted-foreground hover:text-foreground transition-colors active:scale-95"
          style={{ minWidth: 44, minHeight: 44, width: 44, height: 44 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t("settings.title")}
        </h1>
      </div>

      {/* Vibration */}
      <div className="bg-card/60 rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">
              {t("settings.vibration")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">📳</p>
          </div>
          <Switch
            data-ocid="settings.vibration.switch"
            checked={vibrationEnabled}
            onCheckedChange={setVibrationEnabled}
          />
        </div>
      </div>

      {/* Sound */}
      <div className="bg-card/60 rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">
              {t("settings.sound")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {soundEnabled ? "🔊" : "🔇"}
            </p>
          </div>
          <Switch
            data-ocid="settings.sound.switch"
            checked={soundEnabled}
            onCheckedChange={handleSoundToggle}
          />
        </div>
      </div>

      {/* Language */}
      <div className="bg-card/60 rounded-2xl border border-border p-5">
        <p className="font-semibold text-foreground mb-4">
          🌐 {t("settings.language")}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              data-ocid="settings.button"
              onClick={() => setLang(l.code)}
              className={`flex flex-col items-center gap-1 rounded-xl p-2 border transition-all active:scale-95 ${
                lang === l.code
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/60"
              }`}
            >
              <span className="text-xl">{l.flag}</span>
              <span className="text-[9px] font-semibold leading-tight text-center">
                {l.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
