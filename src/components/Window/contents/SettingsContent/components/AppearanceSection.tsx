"use client";

import Select, { SelectOption } from "@/components/interface/Select";
import { useTranslation, T } from "@/hooks/useTranslation";
import {
  useDesktopStore,
  NavigatorOrientation,
  ThemeVariant,
} from "@/stores/desktop.store";
import BackgroundImageSelector from "./BackgroundImageSelector";
import arrowDown from "@/assets/icons/interface/arrow-down.svg";
import arrowUp from "@/assets/icons/interface/arrow-up.svg";
import arrowLeft from "@/assets/icons/interface/arrow-left.svg";
import arrowRight from "@/assets/icons/interface/arrow-right.svg";
import sunIcon from "@/assets/icons/interface/sun.svg";
import moonIcon from "@/assets/icons/interface/moon.svg";
import Icon from "@/components/interface/Icon";

export default function AppearanceSection() {
  const { t } = useTranslation();
  const {
    navigatorOrientation,
    setNavigatorOrientation,
    theme,
    setTheme,
  } = useDesktopStore();

  const themeOptions: SelectOption[] = [
    { 
      value: "light", 
      label: t("appearance.themeLight"),
      description: "Clean and bright interface",
      icon: <Icon src={sunIcon.src} color="#ff9f0f" size={16} /> 
    },
    { 
      value: "dark", 
      label: t("appearance.themeDark"),
      description: "Easy on the eyes in low light",
      icon: <Icon src={moonIcon.src} darkColor="#fdf17e" lightColor="#ffe600ff" size={16} />
    },
  ];

  const navigationOrientationOptions: SelectOption[] = [
    { 
      value: "bottom", 
      label: t("appearance.navigationBottom"), 
      icon: <Icon src={arrowDown.src} darkColor="#ffffff" size={16} /> 
    },
    { 
      value: "top", 
      label: t("appearance.navigationTop"), 
      icon: <Icon src={arrowUp.src} darkColor="#ffffff" size={16} /> 
    },
    { 
      value: "left", 
      label: t("appearance.navigationLeft"), 
      icon: <Icon src={arrowLeft.src} darkColor="#ffffff" size={16} /> 
    },
    { 
      value: "right", 
      label: t("appearance.navigationRight"), 
      icon: <Icon src={arrowRight.src} darkColor="#ffffff" size={16} /> 
    },
  ];

  const handleNavigationOrientationChange = (newOrientation: string) => {
    setNavigatorOrientation(newOrientation as NavigatorOrientation);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as ThemeVariant);
  };

  return (
    <div className="settings-section">
      <div className="section-group">
        <T k="appearance.theme" as="h3" className="section-title" />
        <div className="section-item">
          <div className="item-info">
            <T k="appearance.themeMode" as="label" className="item-label" />
            <T
              k="appearance.themeModeDescription"
              as="p"
              className="item-description"
            />
          </div>
          <div className="item-control">
            <Select
              options={themeOptions}
              value={theme}
              onChange={handleThemeChange}
              variant="primary"
            />
          </div>
        </div>
        <div className="section-item">
          <div className="item-info">
            <T k="appearance.backgroundImage" as="label" className="item-label" />
            <T k="appearance.backgroundImageDescription" as="p" className="item-description" />
          </div>
          <div className="item-control">
            <BackgroundImageSelector />
          </div>
        </div>
      </div>
      <div className="section-group">
        <T k="appearance.navigation" as="h3" className="section-title" />
        <div className="section-item">
          <div className="item-info">
            <T k="appearance.navigationOrientation" as="label" className="item-label" />
            <T k="appearance.navigationOrientationDescription" as="p" className="item-description" />
          </div>
          <div className="item-control">
            <Select
              options={navigationOrientationOptions}
              value={navigatorOrientation}
              onChange={handleNavigationOrientationChange}
              variant="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
