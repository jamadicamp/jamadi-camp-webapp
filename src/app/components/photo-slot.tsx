import Image from "next/image";

interface PhotoSlotProps {
  url?: string;
  alt: string;
  className: string;
}

export function PhotoSlot({ url, alt, className }: PhotoSlotProps) {
  if (url) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image fill src={url} alt={alt} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`bg-neutral-800 flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <svg
        className="w-8 h-8 text-white/20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-white/30 text-xs uppercase tracking-widest">
        Foto próximamente
      </span>
    </div>
  );
}
