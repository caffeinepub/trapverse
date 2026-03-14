import { createContext, useContext, useEffect, useState } from "react";
import {
  LANGUAGES,
  type Lang,
  RTL_LANGS,
  translations,
} from "../i18n/translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  isRTL: boolean;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function loadLang(): Lang {
  try {
    const v = localStorage.getItem("trapverse_lang");
    if (v && translations[v as Lang]) return v as Lang;
  } catch {
    /* ignore */
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("trapverse_lang", l);
    } catch {
      /* ignore */
    }
  };

  const isRTL = RTL_LANGS.includes(lang);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const dict = translations[lang] ?? translations.en;
    let text = dict[key] ?? translations.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{{${k}}}`, String(v));
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t, isRTL, languages: LANGUAGES }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
