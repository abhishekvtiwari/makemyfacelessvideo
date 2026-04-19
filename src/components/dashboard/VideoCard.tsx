// src/components/dashboard/VideoCard.tsx

type VideoStatus = "pending" | "processing" | "done" | "failed";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  status: VideoStatus;
  createdAt: string;
  onClick?: () => void;
}

const STATUS_STYLES: Record<VideoStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#ff9f0a", bg: "rgba(255,159,10,0.12)" },
  processing: { label: "Processing", color: "#bf5af2", bg: "rgba(191,90,242,0.12)" },
  done: { label: "Done", color: "#30d158", bg: "rgba(48,209,88,0.12)" },
  failed: { label: "Failed", color: "#ff453a", bg: "rgba(255,69,58,0.12)" },
};

export default function VideoCard({
  title,
  thumbnailUrl,
  status,
  createdAt,
  onClick,
}: VideoCardProps) {
  const s = STATUS_STYLES[status];

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-4 text-left transition-all duration-200 hover:border-[rgba(255,255,255,0.15)] hover:bg-[#141420]"
    >
      {/* Thumbnail */}
      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-[#1a1a24]">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
              <path d="M8 7.5l4 2.5-4 2.5V7.5Z" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>
        )}
        {status === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <svg className="h-5 w-5 animate-spin text-[#bf5af2]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-medium text-[#e8e8f0]">{title}</p>
        <p className="mt-0.5 font-body text-xs text-[#6b6b80]">{createdAt}</p>
      </div>

      {/* Status badge */}
      <span
        className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
        style={{ color: s.color, backgroundColor: s.bg }}
      >
        {s.label}
      </span>
    </button>
  );
}
