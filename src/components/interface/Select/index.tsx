"use client";

import { useState, useRef, useEffect } from "react";
import Portal from "../Portal";
import { AnimatePresence, motion } from "framer-motion";
import "./index.styles.scss";
import { useDesktopStore } from "@/stores/desktop.store";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

interface DropdownPosition {
  top: number;
  left: number;
  maxHeight?: number;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  variant = "primary",
  fullWidth = false,
  size = "md"
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const theme = useDesktopStore((state) => state.theme);

  const selectedOption = options.find((opt) => opt.value === value);

  // Calculate dropdown position when opened or window resized
  useEffect(() => {
    if (!isOpen || !selectRef.current) return;

    const calculatePosition = () => {
      const triggerRect = selectRef.current!.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - triggerRect.bottom - 20;

      setDropdownPosition({
        top: triggerRect.bottom + 8,
        left: triggerRect.left,
        maxHeight: spaceBelow > 150 ? spaceBelow : 300,
      });
    };

    const handleScroll = (event: Event) => {
      // If the scroll happened inside our dropdown, don't close it!
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", handleScroll, true);
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

  // Sync focused index with selected value when opening
  useEffect(() => {
    if (isOpen) {
      const activeIndex = options.findIndex((opt) => opt.value === value);
      setFocusedIndex(activeIndex >= 0 ? activeIndex : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, options, value]);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const optionsContainer = dropdownRef.current.querySelector(
        ".select-options",
      );
      const focusedOption = optionsContainer?.children[
        focusedIndex
      ] as HTMLElement;

      if (focusedOption && optionsContainer) {
        const containerRect = optionsContainer.getBoundingClientRect();
        const optionRect = focusedOption.getBoundingClientRect();

        if (optionRect.bottom > containerRect.bottom) {
          optionsContainer.scrollTop +=
            optionRect.bottom - containerRect.bottom + 8; // +8 for padding
        } else if (optionRect.top < containerRect.top) {
          optionsContainer.scrollTop -=
            containerRect.top - optionRect.top + 8; // +8 for padding
        }
      }
    }
  }, [focusedIndex, isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Enter" ||
        e.key === " "
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      className={`select-container select-variant-${variant} select-theme-${theme} select-size-${size} ${disabled ? "disabled" : ""} ${fullWidth ? "full-width" : ""}`}
      ref={selectRef}
    >
      <button
        className={`select-trigger ${isOpen ? "open" : ""}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
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

      <AnimatePresence>
        {isOpen && (
          <Portal
            position={dropdownPosition}
            className="select-dropdown-portal"
          >
            <motion.div
              className={`select-dropdown select-theme-${theme}`}
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "max-content",
                minWidth: selectRef.current?.offsetWidth,
                maxWidth: "400px",
                maxHeight: dropdownPosition.maxHeight,
              }}
            >
              <div className="select-options">
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    className={`select-option ${
                      value === option.value ? "selected" : ""
                    } ${focusedIndex === index ? "focused" : ""} ${
                      option.description ? "has-description" : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    type="button"
                  >
                    <div className="option-main">
                      {option.icon && (
                        <div className="option-icon-container">
                          {option.icon}
                        </div>
                      )}
                      <div className="option-text">
                        <span className="option-label">{option.label}</span>
                        {option.description && (
                          <span className="option-description">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* {value === option.value && (
                      <span className="option-check">
                        <svg
                          width="12"
                          height="10"
                          viewBox="0 0 12 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 5.2L4.2 8.4L11 1.6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )} */}
                  </button>
                ))}
              </div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}
