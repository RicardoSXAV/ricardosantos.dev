"use client";

import dynamic from "next/dynamic";

import "./page.styles.scss";
import SettingsBar from "./components/SettingsBar";
import WindowManager from "./components/WindowManager";

const AppNavigator = dynamic(() => import("./components/AppNavigator"), {
  ssr: false,
});

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
