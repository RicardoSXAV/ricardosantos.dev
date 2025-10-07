"use client";

import { useState } from "react";
import "./index.styles.scss";
import Image from "next/image";

import searchIcon from "@/assets/icons/interface/lu-search.svg";

interface SettingsOption {
  id: string;
  label: string;
  icon: string;
}

const settingsCategories: SettingsOption[] = [
  { id: "general", label: "General", icon: "⚙️" },
  { id: "language-and-region", label: "Language and Region", icon: "🌐" },
  { id: "appearance", label: "Appearance", icon: "🎨" },
];

export default function SettingsContent() {
  const [selectedCategory, setSelectedCategory] = useState("general");

  return (
    <div className="settings-content">
      <div className="settings-sidebar">
        <div className="settings-search">
          <span className="search-icon">
            <Image src={searchIcon} alt="Search" />
          </span>
          <input type="text" placeholder="Search" />
        </div>

        <div className="settings-nav">
          {settingsCategories.map((category) => (
            <button
              key={category.id}
              className={`settings-nav-item ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="nav-icon">{category.icon}</span>
              <span className="nav-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-panel">
        <div className="settings-header">
          <div className="settings-icon">{settingsCategories[0].icon}</div>
          <h2 className="settings-title">General</h2>
          <p className="settings-description">
            Manage general configurations and preferences, including language,
            app navigator location, and theme settings.
          </p>
        </div>

        <div className="settings-options">
          <p>Version: 0.0.1</p>
        </div>
      </div>
    </div>
  );
}
