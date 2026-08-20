interface BatteryStatusIconProps {
  level: number | null;
  charging: boolean;
  className?: string;
}

const MAX_FILL_WIDTH = 13.6;

export default function BatteryStatusIcon({
  level,
  charging,
  className,
}: BatteryStatusIconProps) {
  const normalizedLevel = Math.max(0, Math.min(level ?? 100, 100));
  const fillWidth = (normalizedLevel / 100) * MAX_FILL_WIDTH;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="19" height="13" x="1.5" y="5.5" rx="2.8" stroke="currentColor" strokeWidth="2.3" />
      <path d="M22.5 10v4" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      {fillWidth > 0 && (
        <rect
          className="settings-battery-fill"
          x="4.2"
          y="8.25"
          width={fillWidth}
          height="7.5"
          rx="1.15"
          fill="currentColor"
          fillOpacity={charging ? 0.38 : 1}
        />
      )}
      {charging && (
        <path
          className="settings-battery-bolt"
          d="m13.3 6.5-7.6 7h4.3l-1.1 5.3 7.5-7.8h-4l.6-4.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
