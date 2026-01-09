"use client";

import { useState, useRef, useEffect } from "react";
import Portal from "../Portal";
import "./index.styles.scss";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface DropdownPosition {
  top: number;
  left: number;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Calculate dropdown position when opened or window resized
  useEffect(() => {
    if (!isOpen || !selectRef.current) return;

    const calculatePosition = () => {
      const triggerRect = selectRef.current!.getBoundingClientRect();
      const newPosition: DropdownPosition = {
        top: triggerRect.bottom + 4, // 4px gap below trigger
        left: triggerRect.left,
      };
      setDropdownPosition(newPosition);
    };

    calculatePosition();
    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition, true);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        selectRef.current &&
        !selectRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      className={`select-container ${disabled ? "disabled" : ""}`}
      ref={selectRef}
    >
      <button
        className={`select-trigger ${isOpen ? "open" : ""}`}
        onClick={handleToggle}
        disabled={disabled}
        type="button"
      >
        <span className="select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`select-arrow ${isOpen ? "open" : ""}`}>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <Portal
          position={dropdownPosition}
          className="select-dropdown-portal"
        >
          <div
            className="select-dropdown"
            ref={dropdownRef}
            style={{
              width: selectRef.current?.offsetWidth,
            }}
          >
            <div className="select-options">
              {options.map((option) => (
                <button
                  key={option.value}
                  className={`select-option ${
                    value === option.value ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                  type="button"
                >
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
