"use client";

import { useEffect, useRef } from "react";

import SettingsBar from "@/app/(main)/components/SettingsBar";
import Tooltip from "@/components/interface/Tooltip";
import { useDesktopStore } from "@/stores/desktop.store";

export default function TooltipCheck() {
  const setTheme = useDesktopStore((state) => state.setTheme);
  const theme = useDesktopStore((state) => state.theme);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.location.search.includes("dark")) setTheme("dark");
    else setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      rootRef.current?.querySelectorAll(".tooltip-anchor").forEach((anchor) => {
        anchor.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [theme]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0b1020 0%, #2a1a4a 100%)"
            : "linear-gradient(135deg, #cbd5e1 0%, #f8fafc 100%)",
      }}
    >
      <SettingsBar />

      {/* hard against the right edge: exercises the viewport clamp */}
      <div style={{ position: "absolute", top: 150, right: 4 }}>
        <Tooltip content="Battery: 62% charging" delay={0}>
          <span
            style={{ display: "block", width: 20, height: 20, background: "#94a3b8" }}
          />
        </Tooltip>
      </div>

      {/* bottom edge: tail underneath */}
      <div style={{ position: "absolute", top: 320, left: 40 }}>
        <Tooltip content="Internet: excellent" delay={0} placement="top">
          <span
            style={{ display: "block", width: 20, height: 20, background: "#94a3b8" }}
          />
        </Tooltip>
      </div>
    </div>
  );
}
