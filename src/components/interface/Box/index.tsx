"use client";

import { useDesktopStore } from "@/stores/desktop.store";
import { motion, HTMLMotionProps } from "framer-motion";
import React, { useId, forwardRef } from "react";
import "./index.styles.scss";

interface BoxProps extends HTMLMotionProps<"div"> {
  fluidGlass?: boolean;
  blur?: number | string;
  variant?: "primary" | "secondary" | "gradient" | "glass" | "transparent";
  gradient?: string;
  padding?: string | number;
  borderRadius?: string | number;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      children,
      fluidGlass = false,
      blur,
      variant = "transparent",
      gradient,
      padding,
      borderRadius,
      className = "",
      style,
      ...props
    },
    ref,
  ) => {
    const filterId = useId().replace(/:/g, "");
    const theme = useDesktopStore((state) => state.theme);

    const mergedStyle: any = {
      ...style,
      backdropFilter: blur ? `blur(${typeof blur === "number" ? `${blur}px` : blur})` : undefined,
      WebkitBackdropFilter: blur ? `blur(${typeof blur === "number" ? `${blur}px` : blur})` : undefined,
      padding: padding,
      borderRadius: borderRadius,
    };

    if (gradient) {
      mergedStyle.background = gradient;
    }

    return (
      <motion.div
        ref={ref}
        className={`box-container box-theme-${theme} box-variant-${variant} ${fluidGlass ? "fluid-glass" : ""} ${className}`}
        style={mergedStyle}
        {...props}
      >
        {fluidGlass && (
          <div className="glass-background">
            <svg
              className="glass-filter-svg"
              style={{
                visibility: "hidden",
                position: "absolute",
                width: 0,
                height: 0,
              }}
            >
              <filter
                id={`glass-distortion-${filterId}`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
                filterUnits="objectBoundingBox"
                primitiveUnits="userSpaceOnUse"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.01 0.01"
                  numOctaves="1"
                  seed="5"
                  result="turbulence"
                ></feTurbulence>
                <feComponentTransfer in="turbulence" result="mapped">
                  <feFuncR
                    type="gamma"
                    amplitude="1"
                    exponent="10"
                    offset="0.5"
                  ></feFuncR>
                  <feFuncG type="gamma" amplitude="0" exponent="1" offset="0"></feFuncG>
                  <feFuncB
                    type="gamma"
                    amplitude="0"
                    exponent="1"
                    offset="0.5"
                  ></feFuncB>
                </feComponentTransfer>
                <feGaussianBlur
                  in="turbulence"
                  stdDeviation="3"
                  result="softMap"
                ></feGaussianBlur>
                <feSpecularLighting
                  in="softMap"
                  surfaceScale="15"
                  specularConstant="1.2"
                  specularExponent="100"
                  lightingColor="white"
                  result="specLight"
                >
                  <fePointLight x="-200" y="-200" z="300"></fePointLight>
                </feSpecularLighting>
                <feComposite
                  in="specLight"
                  operator="arithmetic"
                  k1="0"
                  k2="1"
                  k3="1"
                  k4="0"
                  result="litImage"
                ></feComposite>
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="softMap"
                  scale="50"
                  xChannelSelector="R"
                  yChannelSelector="G"
                ></feDisplacementMap>
              </filter>
            </svg>
            <div
              className="glass-layer-1"
              style={{ filter: `url(#glass-distortion-${filterId})` }}
            ></div>
            <div className="glass-layer-2"></div>
          </div>
        )}
        {children as React.ReactNode}
      </motion.div>
    );
  },
);

Box.displayName = "Box";

export default Box;
