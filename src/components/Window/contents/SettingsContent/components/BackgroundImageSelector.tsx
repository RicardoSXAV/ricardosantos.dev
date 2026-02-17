"use client";

import { useState, useEffect, useMemo } from "react";
import { saveBackgroundImage, deleteBackgroundImage } from "@/lib/indexeddb";
import { useBackgroundImageStore } from "@/stores/backgroundImage.store";
import { useTranslation, T } from "@/hooks/useTranslation";
import FileSelect from "@/components/interface/FileSelect";
import Card from "@/components/interface/Card";
import deepGradient from "@/assets/backgrounds/deep-gradient.svg";
import starryNight from "@/assets/backgrounds/starry-night.svg";
import liquidAura from "@/assets/backgrounds/liquid-aura.png";
import arcticPeaks from "@/assets/backgrounds/arctic-peaks.svg";
import fileUp from "@/assets/icons/interface/file-up.svg";
import Icon from "@/components/interface/Icon";
import "./BackgroundImageSelector.styles.scss";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const SYSTEM_BACKGROUNDS = [
  {
    id: "deep-gradient",
    title: "Deep Gradient",
    subtitle: "Abstract - 5K",
    src: deepGradient.src,
  },
  {
    id: "starry-night",
    title: "Starry Night",
    subtitle: "Nature - 4K",
    src: starryNight.src,
  },
  {
    id: "liquid-aura",
    title: "Liquid Aura",
    subtitle: "Abstract - 8K",
    src: liquidAura.src,
  },
  {
    id: "arctic-peaks",
    title: "Arctic Peaks",
    subtitle: "Nature - 4K",
    src: arcticPeaks.src,
  },
];

const DEFAULT_BACKGROUND_ID = "deep-gradient";

export default function BackgroundImageSelector() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | null>(
    DEFAULT_BACKGROUND_ID,
  );
  const [now, setNow] = useState(() => new Date());

  const backgroundImage = useBackgroundImageStore(
    (state) => state.backgroundImageUrl,
  );
  const setBackgroundImageUrl = useBackgroundImageStore(
    (state) => state.setBackgroundImageUrl,
  );
  const setSystemBackgroundId = useBackgroundImageStore(
    (state) => state.setSystemBackgroundId,
  );
  const loadBackgroundImage = useBackgroundImageStore(
    (state) => state.loadBackgroundImage,
  );

  useEffect(() => {
    loadBackgroundImage();
  }, [loadBackgroundImage]);

  useEffect(() => {
    if (!backgroundImage) {
      setSelectedBackgroundId(DEFAULT_BACKGROUND_ID);
      return;
    }

    const matched = SYSTEM_BACKGROUNDS.find(
      (background) => background.src === backgroundImage,
    );

    setSelectedBackgroundId(matched ? matched.id : null);
  }, [backgroundImage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const timeLabel = useMemo(
    () =>
      now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [now],
  );

  const dateLabel = useMemo(
    () =>
      now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [now],
  );

  const handleFilesSelected = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Invalid file type. Please use JPEG, PNG, WebP, or SVG.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    try {
      await saveBackgroundImage(file);
      const objectUrl = URL.createObjectURL(file);
      setSelectedBackgroundId(null);
      setBackgroundImageUrl(objectUrl);
    } catch (err) {
      setError("Failed to save background image. Please try again.");
      console.error(err);
    }
  };

  const handleSystemBackgroundSelect = async (backgroundId: string) => {
    const selected = SYSTEM_BACKGROUNDS.find(
      (background) => background.id === backgroundId,
    );
    if (!selected) return;

    setError(null);
    setSelectedBackgroundId(backgroundId);
    setSystemBackgroundId(backgroundId);
    try {
      await deleteBackgroundImage();
    } catch (err) {
      console.error(err);
    }
    setBackgroundImageUrl(selected.src);
  };

  const previewImage = backgroundImage ?? deepGradient.src;

  return (
    <div className="background-image-selector">
      <div className="background-preview-section">
        <div className="background-section-title">
          <span className="background-section-dot" />
          <T k="appearance.currentWallpaper" as="span" />
        </div>
        <div
          className="background-preview"
          style={{ backgroundImage: `url(${previewImage})` }}
        >
          <div className="background-preview-overlay">
            <span className="background-preview-time">{timeLabel}</span>
            <span className="background-preview-date">{dateLabel}</span>
          </div>
        </div>
      </div>

      <div className="system-backgrounds-header">
        <div className="background-section-title">
          <span className="background-section-dot" />
          <T k="appearance.systemBackgrounds" as="span" />
        </div>
        <FileSelect
          label={t("appearance.chooseFromFiles")}
          onFilesSelected={handleFilesSelected}
          icon={<Icon src={fileUp.src} size={16} />}
        />
      </div>

      <div className="system-backgrounds-grid">
        {SYSTEM_BACKGROUNDS.map((background) => (
          <Card
            key={background.id}
            title={background.title}
            subtitle={background.subtitle}
            imageSrc={background.src}
            selected={selectedBackgroundId === background.id}
            onClick={() => void handleSystemBackgroundSelect(background.id)}
          />
        ))}
      </div>

      {error && <p className="background-error">{error}</p>}
    </div>
  );
}
