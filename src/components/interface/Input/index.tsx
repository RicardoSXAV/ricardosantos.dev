"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import "./index.styles.scss";
import { useDesktopStore } from "@/stores/desktop.store";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: React.ReactNode;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leftIcon,
      variant = "primary",
      fullWidth = false,
      size = "md",
      className = "",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const theme = useDesktopStore((state) => state.theme);

    return (
      <div
        className={`input-container input-variant-${variant} input-theme-${theme} input-size-${size} ${disabled ? "disabled" : ""} ${fullWidth ? "full-width" : ""} ${className}`}
      >
        {leftIcon && <div className="input-left-icon">{leftIcon}</div>}
        <input
          ref={ref}
          className="input-field"
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
