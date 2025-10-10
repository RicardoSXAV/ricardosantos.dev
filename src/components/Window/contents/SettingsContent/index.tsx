"use client";

import { useState } from "react";
import "./index.styles.scss";
import Image from "next/image";

import searchIcon from "@/assets/icons/interface/lu-search.svg";
import LanguageSection from "./components/LanguageSection";
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

  const currentCategory = settingsCategories.find(
    (cat) => cat.id === selectedCategory
  );

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case "language-and-region":
        return <LanguageSection />;
      case "general":
        return (
          <div className="settings-section">
            <p>
              <T k="settings.version" />: 0.0.1
            </p>
          </div>
        );
      case "appearance":
        return (
          <div className="settings-section">
            <T k="settings.appearanceComingSoon" as="p" />
          </div>
        );
      default:
        return null;
    }
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
            <button
              key={category.id}
              className={`settings-nav-item ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="nav-icon">{category.icon}</span>
              <T k={category.labelKey} as="span" className="nav-label" />
            </button>
          ))}
        </div>
      </div>

      <div className="settings-panel">
        <div className="settings-header">
          <div className="settings-icon">{currentCategory?.icon}</div>
          {currentCategory && (
            <T k={currentCategory.labelKey} as="h2" className="settings-title" />
          )}
          {selectedCategory === "general" && (
            <T k="settings.generalDescription" as="p" className="settings-description" />
          )}
          {selectedCategory === "language-and-region" && (
            <T k="settings.languageAndRegionDescription" as="p" className="settings-description" />
          )}
          {selectedCategory === "appearance" && (
            <T k="settings.appearanceDescription" as="p" className="settings-description" />
          )}
        </div>

        <div className="settings-options">{renderCategoryContent()}</div>
      </div>
    </div>
  );
}
