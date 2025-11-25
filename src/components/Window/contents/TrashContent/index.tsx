"use client";

import Image from "next/image";

import "./index.styles.scss";

import appIcons from "@/assets/icons/apps";
import { T } from "@/hooks/useTranslation";
import { useDesktopStore } from "@/stores/desktop.store";

export default function TrashContent() {
  const {
    trashedApps,
    navApps,
    setNavApps,
    setTrashedApps,
  } = useDesktopStore();

  const hasTrashedApps = trashedApps.length > 0;

  const handleRestore = (appId: string) => {
    const appToRestore = trashedApps.find((app) => app.id === appId);
    if (!appToRestore) return;

    if (!navApps.some((app) => app.id === appId)) {
      setNavApps([...navApps, appToRestore]);
    }

    setTrashedApps(trashedApps.filter((app) => app.id !== appId));
  };

  const handleRestoreAll = () => {
    if (!trashedApps.length) return;

    const appsToRestore = trashedApps.filter(
      (app) => !navApps.some((navApp) => navApp.id === app.id)
    );

    if (appsToRestore.length) {
      setNavApps([...navApps, ...appsToRestore]);
    }

    setTrashedApps([]);
  };

  return (
    <div className="trash-content">
      <div className="trash-header">
        <T k="trash.title" as="h2" className="trash-title" />
        <T k="trash.description" as="p" className="trash-description" />
        <button
          type="button"
          className="restore-all"
          onClick={handleRestoreAll}
          disabled={!hasTrashedApps}
        >
          <T k="trash.restoreAll" as="span" />
        </button>
      </div>

      {hasTrashedApps ? (
        <ul className="trashed-app-list">
          {trashedApps.map((app) => {
            const icon = appIcons[app.id as keyof typeof appIcons];
            return (
              <li key={app.id} className="trashed-app-item">
                <div className="app-info">
                  {icon ? (
                    <Image
                      src={icon}
                      alt={app.name}
                      width={32}
                      height={32}
                      className="app-icon"
                    />
                  ) : (
                    <div className="app-icon placeholder">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="app-name">{app.name}</span>
                </div>
                <button
                  type="button"
                  className="restore-button"
                  onClick={() => handleRestore(app.id)}
                >
                  <T k="trash.restore" as="span" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="trash-empty-state">
          <T k="trash.emptyTitle" as="h3" className="empty-title" />
          <T
            k="trash.emptyDescription"
            as="p"
            className="empty-description"
          />
        </div>
      )}
    </div>
  );
}

