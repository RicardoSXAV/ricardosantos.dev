"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.styles.scss";
import Input from "@/components/interface/Input";

import searchIcon from "@/assets/icons/interface/search.svg";
import LanguageSection from "./components/LanguageSection";
import AppearanceSection from "./components/AppearanceSection";
import { useTranslation, T } from "@/hooks/useTranslation";
import type en from "../../../../../messages/en.json";
import Icon from "@/components/interface/Icon";
import Box from "@/components/interface/Box";
import PanelNavigator from "@/components/interface/PanelNavigator";
import settingsIcon from "@/assets/icons/interface/settings.svg";
import globeIcon from "@/assets/icons/interface/globe.svg";
import paletteIcon from "@/assets/icons/interface/palette.svg";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

interface SettingsOption {
  id: string;
  labelKey: NestedKeyOf<typeof en>;
  icon: React.ReactNode;
}

const settingsCategories: SettingsOption[] = [
  { id: "general", labelKey: "settings.general", icon: <Icon src={settingsIcon.src} /> },
  { id: "language-and-region", labelKey: "settings.languageAndRegion", icon: <Icon src={globeIcon.src} /> },
  { id: "appearance", labelKey: "settings.appearance", icon: <Icon src={paletteIcon.src} /> },
];

interface SearchableItem {
  id: string;
  categoryId: string;
  terms: string[];
}

const SEARCHABLE_ITEMS: SearchableItem[] = [
  { id: "theme", categoryId: "appearance", terms: ["theme", "light", "dark", "mode", "appearance", "experience", "bright"] },
  { id: "color", categoryId: "appearance", terms: ["color", "accent", "highlight", "blue", "purple", "pink", "orange", "green", "cyan", "silver", "controls"] },
  { id: "navigation", categoryId: "appearance", terms: ["navigation", "navigator", "orientation", "bottom", "top", "left", "right", "screen", "dock"] },
  { id: "background", categoryId: "appearance", terms: ["background", "wallpaper", "image", "custom", "backdrop"] },
  { id: "language", categoryId: "language-and-region", terms: ["language", "region", "english", "portuguese", "locale", "interface", "preferred"] },
];

export default function SettingsContent() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  const currentCategory = settingsCategories.find((cat) => cat.id === selectedCategory);

  const matchedItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return SEARCHABLE_ITEMS.filter((item) =>
      item.terms.some((term) => term.includes(q))
    );
  }, [searchQuery]);

  const isSearching = matchedItems !== null;
  const hasResults = isSearching && matchedItems.length > 0;

  const matchedAppearanceIds = matchedItems
    ?.filter((item) => item.categoryId === "appearance")
    .map((item) => item.id) ?? [];

  const matchedLanguageIds = matchedItems
    ?.filter((item) => item.categoryId === "language-and-region")
    .map((item) => item.id) ?? [];

  const categoryContentMap: Record<string, React.ReactNode> = {
    "language-and-region": <LanguageSection />,
    general: <div className="settings-section" />,
    appearance: <AppearanceSection />,
  };

  return (
    <Box
      className="settings-content"
      padding="16px"
      borderRadius="0"
    >
      <PanelNavigator
        items={settingsCategories.map((cat) => ({
          id: cat.id,
          label: t(cat.labelKey),
          icon: cat.icon,
        }))}
        activeId={selectedCategory}
        onChange={(id) => {
          setSelectedCategory(id);
          setSearchQuery("");
        }}
        header={
          <div className="settings-panel-header">
            <div className="settings-brand">
              <div className="brand-logo">Rx</div>
              <div className="brand-info">
                <h1>RxOS Settings</h1>
                <span>v1.0.0</span>
              </div>
            </div>
            <Input
              placeholder={t("settings.search")}
              fullWidth
              leftIcon={<Icon src={searchIcon.src} size={14} />}
              className="settings-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        }
      />

      <Box variant="primary" className="settings-main-panel" blur={20} borderRadius="32px">
        <div className="settings-scroll-area">
          <div className="settings-header">
            <div className="settings-icon">{currentCategory?.icon}</div>
            <div className="settings-header-text">
              {currentCategory && (
                <T
                  k={currentCategory.labelKey}
                  as="h2"
                  className="settings-title"
                  key={currentCategory.id}
                />
              )}
              {!isSearching && selectedCategory === "general" && (
                <T
                  k="settings.generalDescription"
                  as="p"
                  className="settings-description"
                  key="general-description"
                />
              )}
              {!isSearching && selectedCategory === "language-and-region" && (
                <T
                  k="settings.languageAndRegionDescription"
                  as="p"
                  className="settings-description"
                  key="language-and-region-description"
                />
              )}
              {!isSearching && selectedCategory === "appearance" && (
                <T
                  k="settings.appearanceDescription"
                  as="p"
                  className="settings-description"
                  key="appearance-description"
                />
              )}
            </div>
          </div>

          <div className="settings-options-container">
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  key="search-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="settings-options"
                >
                  {hasResults ? (
                    <div className="settings-section">
                      {matchedAppearanceIds.length > 0 && (
                        <AppearanceSection visibleIds={matchedAppearanceIds} />
                      )}
                      {matchedLanguageIds.length > 0 && (
                        <LanguageSection visibleIds={matchedLanguageIds} />
                      )}
                    </div>
                  ) : (
                    <p className="settings-search-empty">
                      No settings found for &ldquo;{searchQuery}&rdquo;
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="category"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="settings-options"
                >
                  {categoryContentMap[selectedCategory]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Box>
    </Box>
  );
}
