"use client";

import { useDesktopStore } from "@/stores/desktop.store";
import React from "react";

interface IconProps {
  src: string;
  color?: string;
  darkColor?: string;
  lightColor?: string;
  size?: number | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  src,
  color,
  darkColor,
  lightColor,
  size = 18,
  className = "",
}) => {
  const theme = useDesktopStore((state) => state.theme);
  const activeColor = (theme === 'dark' ? darkColor : lightColor) ?? color;

  return (
    <div
      className={`icon-component ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: activeColor || 'currentColor',
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
};

export default Icon;
