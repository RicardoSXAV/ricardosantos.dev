interface WindowContentProps {
  appId: string;
  children?: React.ReactNode;
}

export default function WindowContent({ appId, children }: WindowContentProps) {
  return (
    <div className="window-content">
      {children || `Content for window ${appId}`}
    </div>
  );
}
