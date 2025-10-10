"use client";

import Select, { SelectOption } from "@/components/interface/Select";
import { useTranslation, T } from "@/hooks/useTranslation";
import { useLocaleStore, Locale } from "@/stores/locale.store";

export default function LanguageAndRegion() {
  const { t, locale } = useTranslation();
  const setLocale = useLocaleStore((state) => state.setLocale);

  const languageOptions: SelectOption[] = [
    { value: "en", label: t("languageAndRegion.english") },
    { value: "pt", label: t("languageAndRegion.portuguese") },
  ];

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale as Locale);
  };

  return (
    <div className="settings-section">
      <div className="section-group">
        <T k="languageAndRegion.language" as="h3" className="section-title" />
        <div className="section-item">
          <div className="item-info">
            <T k="languageAndRegion.preferredLanguage" as="label" className="item-label" />
            <T k="languageAndRegion.selectLanguage" as="p" className="item-description" />
          </div>
          <div className="item-control">
            <Select
              options={languageOptions}
              value={locale}
              onChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
