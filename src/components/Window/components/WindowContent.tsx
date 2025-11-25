import SettingsContent from "../contents/SettingsContent";
import TrashContent from "../contents/TrashContent";

interface WindowContentProps {
  appId: string;
  children?: React.ReactNode;
}

const contentMap: Record<string, React.ReactNode> = {
  settings: <SettingsContent />,
  trash: <TrashContent />,
};

export default function WindowContent({ appId, children }: WindowContentProps) {
  return (
    <div className="window-content">
      {children || contentMap[appId] || `Content for window ${appId}`}
    </div>
  );
}
