"use client";

import Select, { SelectOption } from "@/components/interface/Select";
import { useTranslation, T } from "@/hooks/useTranslation";
import { useDesktopStore, NavigatorOrientation } from "@/stores/desktop.store";

export default function AppearanceSection() {
  const { t } = useTranslation();
  const { navigatorOrientation, setNavigatorOrientation } = useDesktopStore();

  const navigationOrientationOptions: SelectOption[] = [
    { value: "bottom", label: t("appearance.navigationBottom") },
    { value: "top", label: t("appearance.navigationTop") },
    { value: "left", label: t("appearance.navigationLeft") },
    { value: "right", label: t("appearance.navigationRight") },
  ];

  const handleNavigationOrientationChange = (newOrientation: string) => {
    setNavigatorOrientation(newOrientation as NavigatorOrientation);
  };

  return (
    <div className="settings-section">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
