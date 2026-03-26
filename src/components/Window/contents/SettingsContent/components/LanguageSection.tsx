"use client";

import { motion, AnimatePresence } from "framer-motion";
import Select, { SelectOption } from "@/components/interface/Select";
import { useTranslation, T } from "@/hooks/useTranslation";
import { useLocaleStore, Locale } from "@/stores/locale.store";
import Box from "@/components/interface/Box";
import Icon from "@/components/interface/Icon";
import globeIcon from "@/assets/icons/interface/globe.svg";
import "@/components/Window/contents/SettingsContent/components/AppearanceSection.styles.scss";
import "./LanguageSection.styles.scss";

const CARD_TRANSITION = { duration: 0.12, ease: "easeOut" as const };

interface LanguageSectionProps {
  visibleIds?: string[];
}

export default function LanguageAndRegion({ visibleIds }: LanguageSectionProps) {
  const { t, locale } = useTranslation();
  const setLocale = useLocaleStore((state) => state.setLocale);

  const languageOptions: SelectOption[] = [
    { value: "en", label: t("languageAndRegion.english"), icon: "🇺🇸" },
    { value: "pt", label: t("languageAndRegion.portuguese"), icon: "🇧🇷" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale as Locale);
  };

  const isVisible = (id: string) => !visibleIds || visibleIds.includes(id);
  const shouldAnimate = !!visibleIds;

  return (
    <div className="settings-section">
      <motion.div layout className="appearance-grid language-grid">
        <AnimatePresence mode="popLayout">
          {isVisible("language") && (
            <motion.div
              key="language"
              layout
              initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : false}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={CARD_TRANSITION}
            >
              <Box variant="glass" borderRadius="16px" className="appearance-box">
                <div className="appearance-box-header">
                  <Icon src={globeIcon.src} size={24} />
                  <T k="languageAndRegion.language" as="h3" className="appearance-box-title" />
                </div>
                <div className="appearance-box-content">
                  <div className="section-item">
                    <div className="item-info">
                      <T
                        k="languageAndRegion.selectLanguage"
                        as="p"
                        className="item-description"
                      />
                    </div>
                    <div className="item-control">
                      <Select
                        options={languageOptions}
                        value={locale}
                        onChange={handleLanguageChange}
                        variant="primary"
                        showSelectedIcon
                      />
                    </div>
                  </div>
                </div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
