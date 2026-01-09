"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useBackgroundImageStore } from "@/stores/backgroundImage.store";

import "./page.styles.scss";
import SettingsBar from "./components/SettingsBar";
import WindowManager from "./components/WindowManager";

const AppNavigator = dynamic(() => import("./components/AppNavigator"), {
  ssr: false,
});

export default function Home() {
  const backgroundImage = useBackgroundImageStore((state) => state.backgroundImageUrl);
  const loadBackgroundImage = useBackgroundImageStore((state) => state.loadBackgroundImage);

  useEffect(() => {
    loadBackgroundImage();
  }, [loadBackgroundImage]);

  const mainContentStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <div className="home-wrapper">
      <header>
        <SettingsBar />
      </header>
      <main className="main-content" style={mainContentStyle}>
        <WindowManager />
      </main>

      <AppNavigator />
    </div>
  );
}
