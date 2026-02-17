"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import "./index.styles.scss";
import { useDesktopStore } from "@/stores/desktop.store";

interface FileSelectProps {
  label?: string;
  helperText?: string;
  icon?: ReactNode;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onFilesSelected?: (files: FileList) => void;
}

export default function FileSelect({
  label = "Choose from Files",
  helperText,
  icon,
  accept = "image/*",
  multiple = false,
  disabled = false,
  fullWidth = false,
  className = "",
  onFilesSelected,
}: FileSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useDesktopStore((state) => state.theme);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesSelected?.(event.target.files);
    }

    // Reset input so the same file can be selected again
    event.target.value = "";
  };

  return (
    <div
      className={`file-select file-select-theme-${theme} ${fullWidth ? "full-width" : ""} ${disabled ? "disabled" : ""} ${className}`}
    >
      <button
        type="button"
        className="file-select-button"
        onClick={handleClick}
        disabled={disabled}
      >
        {icon && <span className="file-select-icon">{icon}</span>}
        <span className="file-select-label">{label}</span>
      </button>
      {helperText && <span className="file-select-helper">{helperText}</span>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="file-select-input"
        tabIndex={-1}
      />
    </div>
  );
}
