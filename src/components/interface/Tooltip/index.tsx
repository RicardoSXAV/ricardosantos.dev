"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import Portal from "@/components/interface/Portal";
import { useDesktopStore } from "@/stores/desktop.store";

import "./index.styles.scss";

type TooltipPlacement = "top" | "bottom";

interface TooltipPosition {
  top: number;
  left: number;
  arrowOffset: number;
}

interface TooltipSize {
  width: number;
  height: number;
}

interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  offset?: number;
  disabled?: boolean;
  children: React.ReactNode;
}

const VIEWPORT_MARGIN = 8;

/** Tail geometry. TAIL_HEIGHT must match `--tooltip-tail` in index.styles.scss. */
const TAIL_HEIGHT = 7;
const TAIL_HALF_BASE = 14;
/** How far the flank hugs the pill edge before it starts climbing. */
const TAIL_FILLET = 4;
/** How far the flank stays straight before the tip rounds off. */
const TAIL_GRIP = 5;
/** Radius of the tip. Small enough to read as a point, not a plateau. */
const TAIL_TIP_RADIUS = 2;
const STROKE_INSET = 0.5;

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Bubble and tail as one closed path, so the outline and the fill stay
 * continuous instead of two shapes meeting at a seam.
 *
 * The tail leaves the pill edge horizontally, blends into a straight diagonal
 * flank and closes on a rounded tip. `direction` walks the edge left-to-right
 * for a tail on top and right-to-left for one underneath, which makes the two
 * placements the same construction mirrored.
 */
function buildTail(
  cx: number,
  baseY: number,
  tipY: number,
  direction: 1 | -1,
): string[] {
  const rise = tipY - baseY;
  const length = Math.hypot(TAIL_HALF_BASE, rise);
  const ux = (TAIL_HALF_BASE / length) * direction;
  const uy = rise / length;

  // Circular fillet at the tip: tangent to both flanks, so the apex keeps a
  // tight, constant curvature instead of the wide plateau a quadratic leaves.
  // The bisector is vertical, which makes sin(half-angle) = |ux|.
  const slope = Math.abs(uy) / Math.abs(ux);
  const tangent = TAIL_TIP_RADIUS * slope;
  // Drop the theoretical corner so the arc itself peaks exactly at the tip.
  const cornerY =
    tipY + Math.sign(rise) * TAIL_TIP_RADIUS * (1 / Math.abs(ux) - 1);

  const apexX = tangent * ux;
  const apexY = cornerY - tangent * uy;

  const point = (x: number, y: number) => `${round(x)} ${round(y)}`;

  return [
    `L ${point(cx - TAIL_HALF_BASE * direction, baseY)}`,
    `C ${point(cx - (TAIL_HALF_BASE - TAIL_FILLET) * direction, baseY)} ${point(cx - apexX - TAIL_GRIP * ux, apexY - TAIL_GRIP * uy)} ${point(cx - apexX, apexY)}`,
    `A ${TAIL_TIP_RADIUS} ${TAIL_TIP_RADIUS} 0 0 1 ${point(cx + apexX, apexY)}`,
    `C ${point(cx + apexX + TAIL_GRIP * ux, apexY - TAIL_GRIP * uy)} ${point(cx + (TAIL_HALF_BASE - TAIL_FILLET) * direction, baseY)} ${point(cx + TAIL_HALF_BASE * direction, baseY)}`,
  ];
}

function buildTooltipPath(
  { width, height }: TooltipSize,
  arrowOffset: number,
  placement: TooltipPlacement,
): string {
  const isAbove = placement === "top";

  const x0 = STROKE_INSET;
  const x1 = width - STROKE_INSET;
  const pillTop = isAbove ? STROKE_INSET : TAIL_HEIGHT + STROKE_INSET;
  const pillBottom = isAbove
    ? height - TAIL_HEIGHT - STROKE_INSET
    : height - STROKE_INSET;

  const r = Math.min((pillBottom - pillTop) / 2, (x1 - x0) / 2);
  const tipY = isAbove ? height - STROKE_INSET : STROKE_INSET;

  const minCenter = x0 + r + TAIL_HALF_BASE;
  const maxCenter = x1 - r - TAIL_HALF_BASE;
  const cx =
    maxCenter <= minCenter
      ? width / 2
      : Math.min(Math.max(width / 2 + arrowOffset, minCenter), maxCenter);

  const arc = (x: number, y: number) =>
    `A ${round(r)} ${round(r)} 0 0 1 ${round(x)} ${round(y)}`;

  return [
    `M ${round(x0)} ${round(pillTop + r)}`,
    arc(x0 + r, pillTop),
    ...(isAbove ? [] : buildTail(cx, pillTop, tipY, 1)),
    `L ${round(x1 - r)} ${round(pillTop)}`,
    arc(x1, pillTop + r),
    `L ${round(x1)} ${round(pillBottom - r)}`,
    arc(x1 - r, pillBottom),
    ...(isAbove ? buildTail(cx, pillBottom, tipY, -1) : []),
    `L ${round(x0 + r)} ${round(pillBottom)}`,
    arc(x0, pillBottom - r),
    "Z",
  ].join(" ");
}

export default function Tooltip({
  content,
  placement = "bottom",
  delay = 350,
  offset = 10,
  disabled = false,
  children,
  className = "",
  ...props
}: TooltipProps) {
  const theme = useDesktopStore((state) => state.theme);
  const gradientId = useId().replace(/:/g, "");

  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const delayTimeout = useRef<number | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [size, setSize] = useState<TooltipSize | null>(null);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    arrowOffset: 0,
  });

  // Anchors the bubble to the trigger's center, then keeps it inside the
  // viewport by sliding it back and nudging the tail the same amount.
  const syncPosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();

    // Aim at the anchor's content, not its border box: trigger padding is
    // often asymmetric (the settings bar puts its divider gap on one side),
    // which would otherwise pull the tail off the icon it points at.
    const style = window.getComputedStyle(anchor);
    const padLeft = parseFloat(style.paddingLeft) || 0;
    const padRight = parseFloat(style.paddingRight) || 0;
    const anchorCenter =
      rect.left + padLeft + (rect.width - padLeft - padRight) / 2;

    const halfWidth = (tooltipRef.current?.offsetWidth ?? 0) / 2;

    const minLeft = VIEWPORT_MARGIN + halfWidth;
    const maxLeft = window.innerWidth - VIEWPORT_MARGIN - halfWidth;
    const left = halfWidth
      ? Math.min(Math.max(anchorCenter, minLeft), Math.max(maxLeft, minLeft))
      : anchorCenter;

    const next: TooltipPosition = {
      top: placement === "top" ? rect.top - offset : rect.bottom + offset,
      left,
      // Left as measured; buildTooltipPath clamps it to whatever room the
      // rounded corners actually leave, so a nudged bubble still points home.
      arrowOffset: anchorCenter - left,
    };

    setPosition((current) =>
      current.top === next.top &&
      current.left === next.left &&
      current.arrowOffset === next.arrowOffset
        ? current
        : next,
    );
  }, [offset, placement]);

  // offsetWidth/Height ignore the entrance transform, unlike a bounding rect.
  const syncSize = useCallback(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    setSize((current) =>
      current?.width === tooltip.offsetWidth &&
      current?.height === tooltip.offsetHeight
        ? current
        : { width: tooltip.offsetWidth, height: tooltip.offsetHeight },
    );
  }, []);

  /**
   * Measured from a ref callback rather than an effect: `Portal` renders null
   * on its first pass, so on the commit that reveals the tooltip an effect
   * would still see an unmounted node and the shape would never get a size.
   * The observer also catches later reflows, such as a web font landing.
   */
  const attachTooltip = useCallback(
    (node: HTMLDivElement | null) => {
      resizeObserver.current?.disconnect();
      resizeObserver.current = null;
      tooltipRef.current = node;

      if (!node) return;

      const measure = () => {
        syncSize();
        syncPosition();
      };

      measure();
      resizeObserver.current = new ResizeObserver(measure);
      resizeObserver.current.observe(node);
    },
    [syncPosition, syncSize],
  );

  const clearDelay = () => {
    if (delayTimeout.current === null) return;
    window.clearTimeout(delayTimeout.current);
    delayTimeout.current = null;
  };

  const show = useCallback(
    (immediate = false) => {
      if (disabled) return;

      clearDelay();
      syncPosition();

      if (immediate || delay <= 0) {
        setIsVisible(true);
        return;
      }

      delayTimeout.current = window.setTimeout(() => {
        syncPosition();
        setIsVisible(true);
      }, delay);
    },
    [delay, disabled, syncPosition],
  );

  const hide = useCallback(() => {
    clearDelay();
    setIsVisible(false);
  }, []);

  useEffect(() => clearDelay, []);

  useEffect(() => {
    if (disabled) hide();
  }, [disabled, hide]);

  useEffect(() => {
    if (!isVisible) return;

    const handleResize = () => {
      syncSize();
      syncPosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("blur", hide);
    };
  }, [hide, isVisible, syncPosition, syncSize]);

  const isAbove = placement === "top";
  const shapePath = size
    ? buildTooltipPath(size, position.arrowOffset, placement)
    : null;

  return (
    <>
      <span
        {...props}
        ref={anchorRef}
        className={`tooltip-anchor ${className}`}
        onMouseEnter={() => show()}
        onMouseLeave={hide}
        onFocus={() => show(true)}
        onBlur={hide}
        onPointerDown={hide}
      >
        {children}
      </span>

      <AnimatePresence>
        {isVisible && content && (
          <Portal
            position={{ top: position.top, left: position.left }}
            className="tooltip-portal"
          >
            <div className={`tooltip-shift tooltip-placement-${placement}`}>
              <motion.div
                ref={attachTooltip}
                role="tooltip"
                aria-hidden
                className={`tooltip tooltip-theme-${theme} tooltip-placement-${placement}`}
                initial={{ opacity: 0, scale: 0.94, y: isAbove ? 4 : -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: isAbove ? 2 : -2 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                {shapePath && size && (
                  <>
                    <div
                      className="tooltip-glass"
                      style={{
                        clipPath: `path("${shapePath}")`,
                        WebkitClipPath: `path("${shapePath}")`,
                      }}
                    />
                    <svg
                      className="tooltip-shape"
                      width={size.width}
                      height={size.height}
                      viewBox={`0 0 ${size.width} ${size.height}`}
                      aria-hidden
                    >
                      <defs>
                        <linearGradient
                          id={`tooltip-fill-${gradientId}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0"
                            style={{ stopColor: "var(--tooltip-surface-top)" }}
                          />
                          <stop
                            offset="1"
                            style={{
                              stopColor: "var(--tooltip-surface-bottom)",
                            }}
                          />
                        </linearGradient>
                        <linearGradient
                          id={`tooltip-edge-${gradientId}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0"
                            style={{ stopColor: "var(--tooltip-edge-top)" }}
                          />
                          <stop
                            offset="1"
                            style={{ stopColor: "var(--tooltip-edge-bottom)" }}
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d={shapePath}
                        fill={`url(#tooltip-fill-${gradientId})`}
                        stroke={`url(#tooltip-edge-${gradientId})`}
                        strokeWidth="1"
                      />
                    </svg>
                  </>
                )}
                <span className="tooltip-label">{content}</span>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
}
