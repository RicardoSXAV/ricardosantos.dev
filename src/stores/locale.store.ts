import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "en" | "pt";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: "locale-storage",
    }
  )
);
