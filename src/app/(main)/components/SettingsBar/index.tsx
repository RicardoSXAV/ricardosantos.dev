"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import logoIcon from "@/assets/icons/logo.svg";
import batteryChargingIcon from "@/assets/icons/interface/battery-charging.svg";
import batteryIcon from "@/assets/icons/interface/battery.svg";
import wifiLowIcon from "@/assets/icons/interface/wifi-low.svg";
import wifiOffIcon from "@/assets/icons/interface/wifi-off.svg";
import wifiIcon from "@/assets/icons/interface/wifi.svg";
import Box from "@/components/interface/Box";
import Icon from "@/components/interface/Icon";
import { useLocaleStore } from "@/stores/locale.store";
import { useDesktopStore } from "@/stores/desktop.store";
import { STATIC_APP_NAMES } from "@/stores/data/desktop.data";

import "./index.styles.scss";

type BatteryManagerLike = EventTarget & {
  level: number;
  charging: boolean;
  addEventListener: (
    type: "levelchange" | "chargingchange",
    listener: EventListenerOrEventListenerObject,
  ) => void;
  removeEventListener: (
    type: "levelchange" | "chargingchange",
    listener: EventListenerOrEventListenerObject,
  ) => void;
};

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<BatteryManagerLike>;
};

type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g" | string;

type NetworkInformationLike = EventTarget & {
  effectiveType?: EffectiveConnectionType;
  addEventListener?: (
    type: "change",
    listener: EventListenerOrEventListenerObject,
  ) => void;
  removeEventListener?: (
    type: "change",
    listener: EventListenerOrEventListenerObject,
  ) => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
};

export default function SettingsBar() {
  const locale = useLocaleStore((state) => state.locale);
  const { navApps, windows, activeWindowId } = useDesktopStore();

  const [now, setNow] = useState(() => new Date());
  const [isHydrated, setIsHydrated] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [effectiveConnectionType, setEffectiveConnectionType] =
    useState<EffectiveConnectionType | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;
    if (!nav.getBattery) return;

    let batteryManager: BatteryManagerLike | null = null;
    let isMounted = true;

    const syncBattery = () => {
      if (!batteryManager || !isMounted) return;
      setBatteryLevel(Math.round(batteryManager.level * 100));
      setIsCharging(batteryManager.charging);
    };

    void nav
      .getBattery()
      .then((manager) => {
        if (!isMounted) return;
        batteryManager = manager;
        syncBattery();

        batteryManager.addEventListener("levelchange", syncBattery);
        batteryManager.addEventListener("chargingchange", syncBattery);
      })
      .catch(() => {
        setBatteryLevel(null);
        setIsCharging(null);
      });

    return () => {
      isMounted = false;
      if (!batteryManager) return;
      batteryManager.removeEventListener("levelchange", syncBattery);
      batteryManager.removeEventListener("chargingchange", syncBattery);
    };
  }, []);

  useEffect(() => {
    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

    const syncConnection = () => {
      setIsOnline(navigator.onLine);
      setEffectiveConnectionType(connection?.effectiveType ?? null);
    };

    syncConnection();
    window.addEventListener("online", syncConnection);
    window.addEventListener("offline", syncConnection);
    connection?.addEventListener?.("change", syncConnection);

    return () => {
      window.removeEventListener("online", syncConnection);
      window.removeEventListener("offline", syncConnection);
      connection?.removeEventListener?.("change", syncConnection);
    };
  }, []);

  const localeTag = locale === "pt" ? "pt-BR" : "en-US";

  const formattedDateTime = useMemo(() => {
    if (!isHydrated) return "--";

    if (locale === "pt") {
      const weekday = new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
      }).format(now);
      const day = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
      }).format(now);
      const month = new Intl.DateTimeFormat("pt-BR", {
        month: "short",
      }).format(now);
      const time = new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);

      return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${day} de ${month} ${time}`;
    }

    return new Intl.DateTimeFormat(localeTag, {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
  }, [isHydrated, locale, localeTag, now]);

  const focusedAppName = useMemo(() => {
    if (!activeWindowId) return null;

    const focusedWindow = windows.find(
      (window) => window.appId === activeWindowId && !window.minimized,
    );
    if (!focusedWindow) return null;

    return (
      navApps.find((app) => app.id === focusedWindow.appId)?.name ??
      STATIC_APP_NAMES[focusedWindow.appId] ??
      focusedWindow.appId
    );
  }, [activeWindowId, navApps, windows]);

  const batteryValue = useMemo(() => {
    if (batteryLevel === null) {
      return locale === "pt" ? "indisponível" : "unavailable";
    }

    const levelLabel = `${batteryLevel}%`;
    if (!isCharging) return levelLabel;
    return locale === "pt" ? `${levelLabel} carregando` : `${levelLabel} charging`;
  }, [batteryLevel, isCharging, locale]);

  const internetValue = useMemo(() => {
    if (!isOnline) return locale === "pt" ? "offline" : "offline";

    switch (effectiveConnectionType) {
      case "4g":
        return locale === "pt" ? "excelente" : "excellent";
      case "3g":
        return locale === "pt" ? "boa" : "good";
      case "2g":
      case "slow-2g":
        return locale === "pt" ? "fraca" : "weak";
      default:
        return locale === "pt" ? "online" : "online";
    }
  }, [effectiveConnectionType, isOnline, locale]);

  const batteryStatusIcon = isCharging ? batteryChargingIcon : batteryIcon;
  const internetStatusIcon =
    !isOnline ||
    effectiveConnectionType === "slow-2g" ||
    effectiveConnectionType === "2g"
    ? !isOnline
      ? wifiOffIcon
      : wifiLowIcon
    : wifiIcon;
  const batteryStatusLabel =
    locale === "pt" ? `Bateria: ${batteryValue}` : `Battery: ${batteryValue}`;
  const internetStatusLabel = `Internet: ${internetValue}`;

  return (
    <Box
      className="settings-bar"
      variant="glass"
      blur={30}
      borderRadius={0}
      initial={false}
      role="toolbar"
      aria-label="System settings bar"
    >
      <div className="settings-left">
        <div className="settings-logo" aria-label="Home">
          <Image src={logoIcon} alt="Logo" width={16} height={16} priority />
        </div>
        {focusedAppName && (
          <span className="settings-focused-app">{focusedAppName}</span>
        )}
      </div>

      <div className="settings-right">
        <span
          className="settings-item settings-item-status"
          role="img"
          aria-label={batteryStatusLabel}
          title={batteryStatusLabel}
        >
          <Icon src={batteryStatusIcon.src} size={20} className="settings-status-icon" />
        </span>
        <span
          className="settings-item settings-item-status settings-item-internet"
          role="img"
          aria-label={internetStatusLabel}
          title={internetStatusLabel}
        >
          <Icon src={internetStatusIcon.src} size={18} className="settings-status-icon" />
        </span>
        <span className="settings-item settings-item-clock">{formattedDateTime}</span>
      </div>
    </Box>
  );
}
