"use client";

import { useId } from "react";
import { motion } from "framer-motion";

interface TrashIconProps {
  open?: boolean;
  className?: string;
}

// Right edge of the lid — the point it pivots around while opening
const HINGE_X = 103.5;
const HINGE_Y = 28.2;

// The can is a cone frustum: 40 wide at the rim (y 32), 26 at the base (y 110).
// Ribs run between these two heights and converge along the same taper.
const RIB_TOP_Y = 42;
const RIB_BOTTOM_Y = 108;
const RIB_TOP_SCALE = 0.9551;
const RIB_BOTTOM_SCALE = 0.659;

// Offset of each rib across the rim, and how lit it is — the light sits
// upper-left, so ribs fall off as they wrap toward the shaded right side.
const RIBS = [
  { offset: -27, opacity: 0.85 },
  { offset: -9, opacity: 1 },
  { offset: 9, opacity: 0.75 },
  { offset: 27, opacity: 0.5 },
];

export default function TrashIcon({ open = false, className }: TrashIconProps) {
  const uid = useId().replace(/:/g, "");
  const gid = (name: string) => `${name}-${uid}`;
  const paint = (name: string) => `url(#${gid(name)})`;

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Trash"
    >
      <defs>
        <linearGradient id={gid("body")} x1="20" y1="70" x2="100" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B695F6" />
          <stop offset="0.32" stopColor="#9569E9" />
          <stop offset="1" stopColor="#5F37A8" />
        </linearGradient>

        <linearGradient id={gid("bodyShade")} x1="60" y1="32" x2="60" y2="125" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2E1A5C" stopOpacity="0" />
          <stop offset="1" stopColor="#2E1A5C" stopOpacity="0.45" />
        </linearGradient>

        {/* Ribs fade in under the rim and out again into the base */}
        <linearGradient
          id={gid("ribLight")}
          x1="60"
          y1={RIB_TOP_Y}
          x2="60"
          y2={RIB_BOTTOM_Y}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.16" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="0.72" stopColor="#FFFFFF" stopOpacity="0.26" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <linearGradient
          id={gid("ribShadow")}
          x1="60"
          y1={RIB_TOP_Y}
          x2="60"
          y2={RIB_BOTTOM_Y}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2A1552" stopOpacity="0" />
          <stop offset="0.16" stopColor="#2A1552" stopOpacity="0.28" />
          <stop offset="0.72" stopColor="#2A1552" stopOpacity="0.2" />
          <stop offset="1" stopColor="#2A1552" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={gid("rim")} x1="20" y1="32" x2="100" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C7ABFA" />
          <stop offset="0.45" stopColor="#9E74EC" />
          <stop offset="1" stopColor="#6A40B6" />
        </linearGradient>

        <radialGradient
          id={gid("hole")}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(60 32) scale(35 7.8)"
        >
          <stop stopColor="#2A1552" />
          <stop offset="1" stopColor="#3E2278" />
        </radialGradient>

        <linearGradient id={gid("lidTop")} x1="16" y1="13" x2="104" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D3BEFC" />
          <stop offset="0.45" stopColor="#A681F0" />
          <stop offset="1" stopColor="#7048C4" />
        </linearGradient>

        {/* Lid side wall — mid purple, never near-black, so the closed lid
            never reads as a gap above the can */}
        <linearGradient id={gid("lidSide")} x1="16" y1="27" x2="104" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A98AEF" />
          <stop offset="1" stopColor="#6C46B8" />
        </linearGradient>

        <linearGradient id={gid("knobSide")} x1="52" y1="21" x2="68" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8259D2" />
          <stop offset="1" stopColor="#5B3AA0" />
        </linearGradient>

        <linearGradient id={gid("knob")} x1="52" y1="12" x2="68" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0D0FF" />
          <stop offset="1" stopColor="#9A74EB" />
        </linearGradient>
      </defs>

      {/* Can body */}
      <path d="M20 32 A40 10.5 0 0 0 100 32 L86 110 A26 7 0 0 1 34 110 Z" fill={paint("body")} />
      <path d="M20 32 A40 10.5 0 0 0 100 32 L86 110 A26 7 0 0 1 34 110 Z" fill={paint("bodyShade")} />

      {/* Moulded ribs — a lit edge and a shadowed edge per rib */}
      {RIBS.map(({ offset, opacity }) => {
        const topX = 60 + offset * RIB_TOP_SCALE;
        const bottomX = 60 + offset * RIB_BOTTOM_SCALE;
        // Ribs narrow as they wrap around the cylinder toward the silhouette
        const foreshorten = Math.sqrt(1 - (offset / 40) ** 2);
        const halfGap = (2.8 * foreshorten) / 2;

        return (
          <g key={offset} opacity={opacity}>
            <path
              d={`M${topX - halfGap} ${RIB_TOP_Y} L${bottomX - halfGap} ${RIB_BOTTOM_Y}`}
              stroke={paint("ribLight")}
              strokeWidth={3.4 * foreshorten}
            />
            <path
              d={`M${topX + halfGap} ${RIB_TOP_Y} L${bottomX + halfGap} ${RIB_BOTTOM_Y}`}
              stroke={paint("ribShadow")}
              strokeWidth={2.3 * foreshorten}
            />
          </g>
        );
      })}

      {/* Rim and the opening it exposes once the lid lifts */}
      <ellipse cx="60" cy="32" rx="40" ry="10.5" fill={paint("rim")} />
      <ellipse cx="60" cy="32" rx="35" ry="7.8" fill={paint("hole")} />

      {/* Lid — capped over the rim when closed, hinged on its right edge */}
      <g transform={`translate(${HINGE_X} ${HINGE_Y})`}>
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          initial={false}
          animate={{ rotate: open ? 18 : 0, y: open ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.6 }}
        >
          <g transform={`translate(${-HINGE_X} ${-HINGE_Y})`}>
            {/* Side wall of the cap — its underside sits below the opening's
                lower arc, so no part of the hole shows while closed */}
            <ellipse cx="60" cy="29.5" rx="43.5" ry="11.5" fill={paint("lidSide")} />
            {/* Cap surface */}
            <ellipse cx="60" cy="27" rx="43.5" ry="11.5" fill={paint("lidTop")} />
            <ellipse cx="41" cy="22.5" rx="17" ry="4.2" fill="#FFFFFF" opacity="0.24" />

            {/* Knob */}
            <ellipse cx="60" cy="25" rx="8" ry="3.8" fill={paint("knobSide")} />
            <rect x="52" y="16" width="16" height="9" fill={paint("knobSide")} />
            <ellipse cx="60" cy="16" rx="8" ry="3.8" fill={paint("knob")} />
          </g>
        </motion.g>
      </g>
    </svg>
  );
}
