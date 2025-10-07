import SettingsContent from "../contents/SettingsContent";

interface WindowContentProps {
  appId: string;
  children?: React.ReactNode;
}

const contentMap: Record<string, React.ReactNode> = {
  settings: <SettingsContent />,
};

export default function WindowContent({ appId, children }: WindowContentProps) {
  return (
    <div className="window-content">
      {children || contentMap[appId] || `Content for window ${appId}`}
    </div>
  );
}
