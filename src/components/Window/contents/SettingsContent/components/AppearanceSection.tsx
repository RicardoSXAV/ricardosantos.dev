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
import eclipseIcon from "@/assets/icons/interface/eclipse.svg";
import paintBrushIcon from "@/assets/icons/interface/paint-brush.svg";
import Icon from "@/components/interface/Icon";
import Box from "@/components/interface/Box";
import { ACCENT_COLOR_OPTIONS, AccentColor } from "@/theme/accentColors";
import "./AppearanceSection.styles.scss";

export default function AppearanceSection() {
  const { t } = useTranslation();
  const {
    navigatorOrientation,
    setNavigatorOrientation,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
  } = useDesktopStore();

  const themeOptions: SelectOption[] = [
    {
      value: "light",
      label: t("appearance.themeLight"),
      description: "Clean and bright interface",
      icon: <Icon src={sunIcon.src} color="#ff9f0f" size={16} />,
    },
    {
      value: "dark",
      label: t("appearance.themeDark"),
      description: "Easy on the eyes in low light",
      icon: (
        <Icon
          src={moonIcon.src}
          darkColor="#fdf17e"
          lightColor="#ffe600ff"
          size={16}
        />
      ),
    },
  ];

  const colorOptions: SelectOption[] = ACCENT_COLOR_OPTIONS.map((colorOption) => ({
    value: colorOption.value,
    label: t(colorOption.labelKey),
    icon: (
      <span
        className="appearance-color-swatch"
        style={{ backgroundColor: colorOption.swatch }}
      />
    ),
    iconVariant: "swatch",
  }));

  const navigationOrientationOptions: SelectOption[] = [
    {
      value: "bottom",
      label: t("appearance.navigationBottom"),
      icon: <Icon src={arrowDown.src} darkColor="#ffffff" size={16} />,
    },
    {
      value: "top",
      label: t("appearance.navigationTop"),
      icon: <Icon src={arrowUp.src} darkColor="#ffffff" size={16} />,
    },
    {
      value: "left",
      label: t("appearance.navigationLeft"),
      icon: <Icon src={arrowLeft.src} darkColor="#ffffff" size={16} />,
    },
    {
      value: "right",
      label: t("appearance.navigationRight"),
      icon: <Icon src={arrowRight.src} darkColor="#ffffff" size={16} />,
    },
  ];

  const handleNavigationOrientationChange = (newOrientation: string) => {
    setNavigatorOrientation(newOrientation as NavigatorOrientation);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as ThemeVariant);
  };

  const handleAccentColorChange = (newAccentColor: string) => {
    setAccentColor(newAccentColor as AccentColor);
  };

  return (
    <div className="settings-section appearance-section">
      <div className="appearance-grid">
        <Box
          variant="glass"
          borderRadius="16px"
          className="appearance-box"
        >
          <div className="appearance-box-header">
            <Icon src={eclipseIcon.src} />
            <T k="appearance.theme" as="h3" className="appearance-box-title" />
          </div>
          <div className="appearance-box-content">
            <div className="section-item">
              <div className="item-info">
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
          </div>
        </Box>

        <Box
          variant="glass"
          borderRadius="16px"
          className="appearance-box"
        >
          <div className="appearance-box-header">
            <Icon src={paintBrushIcon.src} />
            <T k="appearance.color" as="h3" className="appearance-box-title" />
          </div>
          <div className="appearance-box-content">
            <div className="section-item">
              <div className="item-info">
                <T k="appearance.colorDescription" as="p" className="item-description" />
              </div>
              <div className="item-control">
                <Select
                  options={colorOptions}
                  value={accentColor}
                  onChange={handleAccentColorChange}
                  variant="primary"
                  showSelectedIcon
                />
              </div>
            </div>
          </div>
        </Box>

        <Box
          variant="glass"
          borderRadius="16px"
          className="appearance-box"
        >
          <div className="appearance-box-header">
            <span className="appearance-box-icon">🧭</span>
            <T k="appearance.navigation" as="h3" className="appearance-box-title" />
          </div>
          <div className="appearance-box-content">
            <div className="section-item">
              <div className="item-info">
                <T
                  k="appearance.navigationOrientationDescription"
                  as="p"
                  className="item-description"
                />
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
        </Box>
      </div>

      <div className="section-group background-section">
        <div className="section-item">
          <div className="item-info">
            <T k="appearance.backgroundImage" as="label" className="item-label" />
            <T
              k="appearance.backgroundImageDescription"
              as="p"
              className="item-description"
            />
          </div>
          <div className="item-control">
            <BackgroundImageSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
