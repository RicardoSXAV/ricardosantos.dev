"use client";

import { useRef, useState, useEffect } from "react";
import { saveBackgroundImage } from "@/lib/indexeddb";
import { useBackgroundImageStore } from "@/stores/backgroundImage.store";
import "./BackgroundImageSelector.styles.scss";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function BackgroundImageSelector() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const backgroundImage = useBackgroundImageStore((state) => state.backgroundImageUrl);
  const setBackgroundImageUrl = useBackgroundImageStore((state) => state.setBackgroundImageUrl);
  const loadBackgroundImage = useBackgroundImageStore((state) => state.loadBackgroundImage);

  // Load background image on mount
  useEffect(() => {
    loadBackgroundImage();
  }, [loadBackgroundImage]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Invalid file type. Please use JPEG, PNG, WebP, or SVG.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    try {
      // Save the file directly to IndexedDB without compression
      await saveBackgroundImage(file);

      // Create an object URL for preview and update store
      const objectUrl = URL.createObjectURL(file);
      setBackgroundImageUrl(objectUrl);
    } catch (err) {
      setError("Failed to save background image. Please try again.");
      console.error(err);
    }

    // Reset file input
    event.target.value = "";
  };

  const clearBackgroundImage = useBackgroundImageStore((state) => state.clearBackgroundImage);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await clearBackgroundImage();
      setError(null);
    } catch (err) {
      setError("Failed to remove background image.");
      console.error(err);
    }
  };

  return (
    <div className="background-image-selector">
      <div className="selector-preview" onClick={handleClick}>
        {backgroundImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={backgroundImage} alt="Current background" className="preview-image" />
        ) : (
          <div className="preview-placeholder">
            <span className="placeholder-icon">🖼️</span>
            <span className="placeholder-text">No background</span>
          </div>
        )}
      </div>
      <button
        type="button"
        className="selector-button"
        onClick={handleClick}
        title="Click to select background image"
      >
        Change
      </button>
      {backgroundImage && (
        <button
          type="button"
          className="selector-remove-button"
          onClick={handleRemove}
          title="Remove background image"
        >
          Remove
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      {error && <p className="selector-error">{error}</p>}
    </div>
  );
}
