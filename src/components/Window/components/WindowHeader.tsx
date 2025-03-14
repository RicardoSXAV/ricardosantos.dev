import Image from "next/image";
import { useDragControls } from "framer-motion";
import appIcons from "@/assets/icons/apps";
import { useDesktopStore } from "@/stores/desktop.store";

interface WindowHeaderProps {
  appId: string;
  appName?: string;
  dragControls: ReturnType<typeof useDragControls>;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export default function WindowHeader({
  appId,
  dragControls,
  onClose,
  onMinimize,
  onMaximize,
}: WindowHeaderProps) {
  const { navApps } = useDesktopStore();
  const appName = navApps.find((app) => app.id === appId)?.name;

  return (
    <div
      className="window-header"
      onPointerDown={(e) => {
        e.stopPropagation();
        dragControls.start(e);
      }}
      onDoubleClick={onMaximize}
    >
      <div className="window-title">
        <Image
          className="window-icon"
          src={appIcons[appId as keyof typeof appIcons]}
          alt={appId}
          width={24}
          height={24}
        />
        {appName}
      </div>
      <div className="window-controls">
        <button
          className="close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
        <button
          className="minimize"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
        />
        <button
          className="maximize"
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
        />
      </div>
    </div>
  );
}
