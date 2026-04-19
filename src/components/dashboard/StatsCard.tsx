// src/components/dashboard/StatsCard.tsx

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  progress?: { current: number; total: number; danger?: boolean };
  action?: { label: string; href: string };
  accent?: "red" | "green" | "purple" | "gold";
}

export default function StatsCard({
  label,
  value,
  sub,
  progress,
  action,
  accent = "red",
}: StatsCardProps) {
  const accentColor = {
    red: "#ff2d55",
    green: "#30d158",
    purple: "#bf5af2",
    gold: "#ff9f0a",
  }[accent];

  const progressPct = progress
    ? Math.min((progress.current / progress.total) * 100, 100)
    : null;

  const progressColor =
    progress?.danger || (progressPct !== null && progressPct < 20)
      ? "#ff453a"
      : accentColor;

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-6">
      <p className="font-body text-xs uppercase tracking-widest text-[#6b6b80]">{label}</p>
      <p
        className="mt-2 font-display text-4xl leading-none tracking-wide"
        style={{ color: accentColor }}
      >
        {value}
      </p>
      {sub && <p className="mt-1 font-body text-sm text-[#6b6b80]">{sub}</p>}

      {progress && progressPct !== null && (
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.06)]">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: progressColor }}
            />
          </div>
          <p className="mt-1.5 font-body text-xs text-[#6b6b80]">
            {progress.current} / {progress.total} used
          </p>
        </div>
      )}

      {action && (
        <a
          href={action.href}
          className="mt-4 inline-block font-body text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: accentColor }}
        >
          {action.label} →
        </a>
      )}
    </div>
  );
}
