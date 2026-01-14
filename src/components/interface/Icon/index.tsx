"use client";

import React from "react";

interface IconProps {
  src: string;
  color?: string;
  size?: number | string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  src,
  color = "currentColor",
  size = 18,
  className = "",
}) => {
  return (
    <div
      className={`icon-component ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
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
