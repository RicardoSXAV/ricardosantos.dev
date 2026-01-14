"use client";

import { useState } from "react";
import "./index.styles.scss";
import Image from "next/image";
import Button from "@/components/interface/Button";

import searchIcon from "@/assets/icons/interface/lu-search.svg";
import LanguageSection from "./components/LanguageSection";
import AppearanceSection from "./components/AppearanceSection";
import { useTranslation, T } from "@/hooks/useTranslation";
import type en from "../../../../../messages/en.json";

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
  icon: string;
}

const settingsCategories: SettingsOption[] = [
  { id: "general", labelKey: "settings.general", icon: "⚙️" },
  { id: "language-and-region", labelKey: "settings.languageAndRegion", icon: "🌐" },
  { id: "appearance", labelKey: "settings.appearance", icon: "🎨" },
];

export default function SettingsContent() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("general");

  const currentCategory = settingsCategories.find((cat) => cat.id === selectedCategory);

  const categoryContentMap: Record<string, React.ReactNode> = {
    "language-and-region": <LanguageSection />,
    general: (
      <div className="settings-section">
        <p>
          <T k="settings.version" />: 0.0.1
        </p>
      </div>
    ),
    appearance: <AppearanceSection />,
  };

  return (
    <div className="settings-content">
      <div className="settings-sidebar">
        <div className="settings-search">
          <span className="search-icon">
            <Image src={searchIcon} alt="Search" />
          </span>
          <input type="text" placeholder={t("settings.search")} />
        </div>

        <div className="settings-nav">
          {settingsCategories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              icon={category.icon}
              className="settings-nav-button"
              fullWidth
            >
              <T k={category.labelKey} />
            </Button>
          ))}
        </div>
      </div>

      <div className="settings-panel">
        <div className="settings-header">
          <div className="settings-icon">{currentCategory?.icon}</div>
          {currentCategory && (
            <T 
              k={currentCategory.labelKey} 
              as="h2" 
              className="settings-title" 
              key={currentCategory.id}
            />
          )}
          {selectedCategory === "general" && (
            <T 
              k="settings.generalDescription" 
              as="p" 
              className="settings-description" 
              key="general-description"
            />
          )}
          {selectedCategory === "language-and-region" && (
            <T 
              k="settings.languageAndRegionDescription" 
              as="p" 
              className="settings-description" 
              key="language-and-region-description"
            />
          )}
          {selectedCategory === "appearance" && (
            <T 
              k="settings.appearanceDescription" 
              as="p" 
              className="settings-description" 
              key="appearance-description"
            />
          )}
        </div>

        <div className="settings-options">{categoryContentMap[selectedCategory]}</div>
      </div>
    </div>
  );
}
