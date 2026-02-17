"use client";

import React from "react";
import "./index.styles.scss";

interface CardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  selected?: boolean;
}

export default function Card({
  title,
  subtitle,
  imageSrc,
  imageAlt = title,
  selected = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <button
      type="button"
      className={`interface-card ${selected ? "selected" : ""} ${className}`}
      {...props}
    >
      <div className="interface-card-image">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={imageAlt} />
        ) : (
          <div className="interface-card-image-placeholder" />
        )}
        {selected && (
          <span className="interface-card-selected" aria-hidden="true">
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5L4.2 8.2L11 1.6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
      <div className="interface-card-body">
        <span className="interface-card-title">{title}</span>
        {subtitle && <span className="interface-card-subtitle">{subtitle}</span>}
      </div>
    </button>
  );
}
