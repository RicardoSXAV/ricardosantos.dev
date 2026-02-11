"use client";

import React from "react";
import "./index.styles.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  active?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  active = false,
  fullWidth = false,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-size-${size} ${active ? "active" : ""} ${className} ${fullWidth ? "full-width" : ""}`}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-label">{children}</span>}
    </button>
  );
};

export default Button;
