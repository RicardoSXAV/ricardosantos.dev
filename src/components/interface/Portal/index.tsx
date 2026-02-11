"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  position?: {
    top: number;
    left: number;
  };
  className?: string;
}

export default function Portal({ children, position, className }: PortalProps) {
  const portalRoot = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let root = document.getElementById("portal-root") as HTMLDivElement;
    if (!root) {
      root = document.createElement("div");
      root.id = "portal-root";
      document.body.appendChild(root);
    }
    portalRoot.current = root;

    return () => {
      if (root && root.children.length === 0) {
        root.remove();
      }
    };
  }, []);

  if (!portalRoot.current) return null;

  const content = (
    <div
      className={className}
      style={{
        position: "fixed",
        top: position?.top,
        left: position?.left,
      }}
    >
      {children}
    </div>
  );

  return createPortal(content, portalRoot.current);
}
