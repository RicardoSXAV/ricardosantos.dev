"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocaleStore } from "@/stores/locale.store";
import en from "../../messages/en.json";
import pt from "../../messages/pt.json";

const translations = { en, pt };

type TranslationKeys = typeof en;
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

function translate(locale: "en" | "pt", key: NestedKeyOf<TranslationKeys>): string {
  const keys = key.split(".");
  let value: string | Record<string, unknown> = translations[locale];

  for (const k of keys) {
    if (typeof value === "object" && value !== null && k in value) {
      value = value[k] as string | Record<string, unknown>;
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}

const componentMap = {
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  label: motion.label,
  div: motion.div,
};

export function T({
  k,
  as = "span",
  className,
}: {
  k: NestedKeyOf<TranslationKeys>;
  as?: keyof typeof componentMap;
  className?: string;
}) {
  const locale = useLocaleStore((state) => state.locale);
  const text = translate(locale, k);
  const MotionComponent = componentMap[as];
  const previousLocale = useRef(locale);
  const hasLocaleChanged = previousLocale.current !== locale;

  previousLocale.current = locale;

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        key={locale}
        initial={hasLocaleChanged ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={className}
      >
        {text}
      </MotionComponent>
    </AnimatePresence>
  );
}

export function useTranslation() {
  const locale = useLocaleStore((state) => state.locale);

  const t = (key: NestedKeyOf<TranslationKeys>): string => {
    return translate(locale, key);
  };

  return { t, locale };
}
