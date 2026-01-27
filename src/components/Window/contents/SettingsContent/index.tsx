"use client";

import { useState } from "react";
import "./index.styles.scss";
import Image from "next/image";
import Button from "@/components/interface/Button";
import Input from "@/components/interface/Input";

import searchIcon from "@/assets/icons/interface/search.svg";
import LanguageSection from "./components/LanguageSection";
import AppearanceSection from "./components/AppearanceSection";
import { useTranslation, T } from "@/hooks/useTranslation";
import type en from "../../../../../messages/en.json";
import Icon from "@/components/interface/Icon";
import Box from "@/components/interface/Box";
import PanelNavigator from "@/components/interface/PanelNavigator";
import { useDesktopStore } from "@/stores/desktop.store";

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
  const windowGradient = useDesktopStore((state) => state.windowGradient);

  const currentCategory = settingsCategories.find((cat) => cat.id === selectedCategory);

  const getGradient = () => {
    if (windowGradient === "aurora") return "var(--gradient-aurora-soft)";
    return undefined; // Uses default from CSS
  };

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
    <Box 
      variant="gradient" 
      gradient={getGradient()}
      className="settings-content" 
      padding="16px" 
      borderRadius="0"
    >
      <PanelNavigator
        items={settingsCategories.map((cat) => ({
          id: cat.id,
          label: t(cat.labelKey),
          icon: <span style={{ fontSize: '18px' }}>{cat.icon}</span>,
        }))}
        activeId={selectedCategory}
        onChange={setSelectedCategory}
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
            />
          </div>
        }
        // footer={
        //   <div className="settings-user-profile">
        //     <div className="user-avatar">
        //       {/* <Image 
        //         src="https://github.com/github.png" 
        //         alt="User" 
        //         width={32} 
        //         height={32} 
        //       /> */}
        //     </div>
        //     <div className="user-info">
        //       <span className="user-name">Ricardo Santos</span>
        //       <span className="user-role">Administrator</span>
        //     </div>
        //   </div>
        // }
      />

      <Box variant="primary" className="settings-main-panel" blur={20} borderRadius="32px">
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
        </div>

        <div className="settings-options-container">
          <div className="settings-options">{categoryContentMap[selectedCategory]}</div>
        </div>
      </Box>
    </Box>
  );
}
