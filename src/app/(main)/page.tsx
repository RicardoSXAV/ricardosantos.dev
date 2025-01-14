"use client";

import "./page.styles.scss";
import AppNavigator from "./components/AppNavigator";
import SettingsBar from "./components/SettingsBar";
import WindowManager from "./components/WindowManager";

export default function Home() {
  return (
    <div className="home-wrapper">
      <header>
        <SettingsBar />
      </header>
      <main className="main-content">
        <WindowManager />
      </main>

      <AppNavigator />
    </div>
  );
}
