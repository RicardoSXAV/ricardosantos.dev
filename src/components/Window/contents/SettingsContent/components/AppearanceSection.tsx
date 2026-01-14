"use client";

import Select, { SelectOption } from "@/components/interface/Select";
import { useTranslation, T } from "@/hooks/useTranslation";
import {
  useDesktopStore,
  NavigatorOrientation,
  ThemeVariant,
} from "@/stores/desktop.store";
import BackgroundImageSelector from "./BackgroundImageSelector";

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
      icon: "☀️" 
    },
    { 
      value: "dark", 
      label: t("appearance.themeDark"),
      description: "Easy on the eyes in low light",
      icon: "🌙" 
    },
  ];

  const navigationOrientationOptions: SelectOption[] = [
    { value: "bottom", label: t("appearance.navigationBottom"), icon: "⬇️" },
    { value: "top", label: t("appearance.navigationTop"), icon: "⬆️" },
    { value: "left", label: t("appearance.navigationLeft"), icon: "⬅️" },
    { value: "right", label: t("appearance.navigationRight"), icon: "➡️" },
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
