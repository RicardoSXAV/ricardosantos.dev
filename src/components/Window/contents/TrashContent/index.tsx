"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import "./index.styles.scss";

import appIcons from "@/assets/icons/apps";
import { T } from "@/hooks/useTranslation";
import { useDesktopStore } from "@/stores/desktop.store";
import Box from "@/components/interface/Box";
import Button from "@/components/interface/Button";
import Icon from "@/components/interface/Icon";
import trashIcon from "@/assets/icons/interface/trash.svg";
import fileUpIcon from "@/assets/icons/interface/file-up.svg";

const ITEM_TRANSITION = { duration: 0.12, ease: "easeOut" as const };

export default function TrashContent() {
  const { trashedApps, navApps, setNavApps, setTrashedApps } = useDesktopStore();

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
    <Box className="trash-content" padding="16px" borderRadius="0">
      <Box
        variant="primary"
        className="trash-main-panel"
        blur={20}
        borderRadius="32px"
      >
        <div className="trash-scroll-area">
          <div className="trash-header">
            <div className="trash-icon">
              <Icon src={trashIcon.src} size={32} />
            </div>
            <div className="trash-header-text">
              <T k="trash.title" as="h2" className="trash-title" />
              <T k="trash.description" as="p" className="trash-description" />
            </div>
            <div className="trash-header-actions">
              <Button
                variant="primary"
                size="sm"
                icon={<Icon src={fileUpIcon.src} size={14} />}
                onClick={handleRestoreAll}
                disabled={!hasTrashedApps}
              >
                <T k="trash.restoreAll" as="span" />
              </Button>
            </div>
          </div>

          <div className="trash-options-container">
            <AnimatePresence mode="popLayout" initial={false}>
              {hasTrashedApps ? (
                <motion.ul layout className="trashed-app-list">
                  {trashedApps.map((app) => {
                    const icon = appIcons[app.id as keyof typeof appIcons];
                    return (
                      <motion.li
                        key={app.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={ITEM_TRANSITION}
                      >
                        <Box
                          variant="glass"
                          borderRadius="16px"
                          className="trashed-app-item"
                        >
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(app.id)}
                          >
                            <T k="trash.restore" as="span" />
                          </Button>
                        </Box>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={ITEM_TRANSITION}
                  className="trash-empty-state"
                >
                  <div className="trash-empty-icon">
                    <Icon src={trashIcon.src} size={28} />
                  </div>
                  <T k="trash.emptyTitle" as="h3" className="empty-title" />
                  <T
                    k="trash.emptyDescription"
                    as="p"
                    className="empty-description"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Box>
    </Box>
  );
}
