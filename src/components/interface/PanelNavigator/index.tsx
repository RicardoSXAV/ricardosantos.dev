"use client";

import React from "react";
import Box from "../Box";
import "./index.styles.scss";
import Button from "../Button";

export interface PanelNavigatorItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface PanelNavigatorProps {
  items: PanelNavigatorItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

export default function PanelNavigator({
  items,
  activeId,
  onChange,
  className = "",
  header,
  footer,
}: PanelNavigatorProps) {
  return (
    <Box
      variant="glass"
      blur={30}
      className={`panel-navigator ${className}`}
      borderRadius="32px"
      padding="0"
    >
      <div className="panel-container">
        {header && <div className="panel-header">{header}</div>}
        
        <div className="panel-items">
          {items.map((item) => (
            <Button
              key={item.id}
              icon={item.icon}
              variant="ghost"
              onClick={() => onChange(item.id)}
              type="button"
              active={activeId === item.id}
              fullWidth
            >
              {item.label}
            </Button>
          ))}
        </div>

        {footer && <div className="panel-footer">{footer}</div>}
      </div>
    </Box>
  );
}
