"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";

const MAX_WIDTH = 1200;
const JPEG_QUALITY = 0.8;

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          const outName = file.name.replace(/\.[^.]+$/, ".jpg");
          resolve(new File([blob], outName, { type: "image/jpeg" }));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };
    img.src = objectUrl;
  });
}

const PAGE_DEFINITIONS = [
  { slug: "campamentos", name: "Jamädi Campamentos" },
  { slug: "campamentos/camp", name: "Jamädi Camp" },
  { slug: "campamentos/camping", name: "Jamädi Camping" },
  { slug: "campamentos/san-jose", name: "Jamädi San José" },
  { slug: "organico", name: "Jamädi Orgánico" },
  { slug: "celebracion", name: "Jamädi Celebración" },
  { slug: "empresarial", name: "Jamädi Empresarial" },
  { slug: "natura", name: "Jamädi Natura" },
  { slug: "kids", name: "Jamädi Kids" },
  { slug: "experiencias", name: "Jamädi Experiencias" },
  { slug: "bienes-raices", name: "Jamädi Bienes Raíces" },
];

const SLOTS = [
  { key: "hero", label: "Hero" },
  { key: "feature", label: "Principal" },
  { key: "gallery_1", label: "Galería 1" },
  { key: "gallery_2", label: "Galería 2" },
  { key: "gallery_3", label: "Galería 3" },
] as const;

// Per-page slot overrides (replaces SLOTS for that page)
const PAGE_SLOTS: Record<string, { key: string; label: string }[]> = {
  "campamentos/camp": [
    { key: "hero", label: "Hero" },
    { key: "feature", label: "Principal" },
    { key: "gallery_1", label: "Galería 1" },
  ],
  "campamentos/san-jose": [
    { key: "hero", label: "Hero" },
    { key: "feature", label: "Principal" },
    { key: "gallery_1", label: "Galería 1" },
    { key: "gallery_2", label: "Galería 2" },
    { key: "gallery_3", label: "Galería 3" },
    { key: "gallery_4", label: "Galería 4" },
  ],
};

const CABIN_SLOTS = [
  { key: "cabin_1", label: "Cabaña 01" },
  { key: "cabin_2", label: "Cabaña 02" },
  { key: "cabin_3", label: "Cabaña 03" },
  { key: "cabin_4", label: "Cabaña 04" },
  { key: "cabin_5", label: "Cabaña 05" },
  { key: "cabin_6", label: "Cabaña 06" },
  { key: "cabin_7", label: "Cabaña 07" },
  { key: "cabin_8", label: "Cabaña 08" },
];

type SlotKey = string;

interface StoredPhoto {
  _id: string;
  pageSlug: string;
  slot: SlotKey;
  url: string;
  publicId: string;
}

// key: "pageSlug::slot"
type PhotoMap = Record<string, { url: string; id: string }>;

export default function PagePhotoManager() {
  const [photos, setPhotos] = useState<PhotoMap>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [phase, setPhase] = useState<"compressing" | "uploading" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingSlotRef = useRef<{ pageSlug: string; slot: SlotKey } | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/cms/page-photos")
      .then((r) => r.json())
      .then((data: StoredPhoto[]) => {
        const map: PhotoMap = {};
        for (const p of data) {
          map[`${p.pageSlug}::${p.slot}`] = { url: p.url, id: p._id };
        }
        setPhotos(map);
      })
      .catch(() => setError("Error cargando fotos"));
  }, []);

  const handleSlotClick = (pageSlug: string, slot: SlotKey) => {
    pendingSlotRef.current = { pageSlug, slot };
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingSlotRef.current) return;
    const { pageSlug, slot } = pendingSlotRef.current;
    const key = `${pageSlug}::${slot}`;
    setUploading(key);
    setPhase("compressing");
    setError(null);

    try {
      // 0. Compress image client-side before sending (avoids 413 on large photos)
      const compressed = await compressImage(file);
      setPhase("uploading");

      // 1. Upload to Cloudinary via existing endpoint
      const formData = new FormData();
      formData.append("file", compressed);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.error || `Error subiendo imagen (${uploadRes.status})`);
      }
      const { url, public_id } = await uploadRes.json();

      // 2. Save to DB
      const saveRes = await fetch("/api/cms/page-photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug, slot, url, publicId: public_id }),
      });
      if (!saveRes.ok) {
        const errData = await saveRes.json().catch(() => ({}));
        throw new Error(errData.error || `Error guardando foto (${saveRes.status})`);
      }
      const saved: StoredPhoto = await saveRes.json();

      setPhotos((prev) => ({
        ...prev,
        [key]: { url: saved.url, id: saved._id },
      }));

      // Show success confirmation
      setSuccess(key);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setUploading(null);
      setPhase(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (pageSlug: string, slot: SlotKey) => {
    const key = `${pageSlug}::${slot}`;
    const entry = photos[key];
    if (!entry) return;
    setUploading(key);
    setError(null);
    try {
      const deleteRes = await fetch(`/api/cms/page-photos/${entry.id}`, { method: "DELETE" });
      if (!deleteRes.ok) {
        const errData = await deleteRes.json().catch(() => ({}));
        throw new Error(errData.error || `Error eliminando foto (${deleteRes.status})`);
      }
      setPhotos((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando foto");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded flex items-start gap-2">
          <X className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Foto guardada correctamente</span>
        </div>
      )}

      {/* Hidden file input shared by all slots */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {PAGE_DEFINITIONS.map((page) => (
        <div key={page.slug} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">{page.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">/{page.slug}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-gray-100">
            {(PAGE_SLOTS[page.slug] ?? SLOTS).map((slot) => (
              <SlotCell
                key={slot.key}
                pageSlug={page.slug}
                pageName={page.name}
                slotKey={slot.key}
                slotLabel={slot.label}
                entry={photos[`${page.slug}::${slot.key}`]}
                isUploading={uploading === `${page.slug}::${slot.key}`}
                phase={phase}
                success={success}
                onUpload={handleSlotClick}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Extra cabin slots for Jamädi Camp */}
          {page.slug === "campamentos/camp" && (
            <>
              <div className="px-5 py-2 border-t border-gray-100 bg-orange-50">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Cabañas — Fotos para slideshow
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-px bg-gray-100">
                {CABIN_SLOTS.map((slot) => (
                  <SlotCell
                    key={slot.key}
                    pageSlug={page.slug}
                    pageName={page.name}
                    slotKey={slot.key}
                    slotLabel={slot.label}
                    entry={photos[`${page.slug}::${slot.key}`]}
                    isUploading={uploading === `${page.slug}::${slot.key}`}
                    phase={phase}
                    success={success}
                    onUpload={handleSlotClick}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

interface SlotCellProps {
  pageSlug: string;
  pageName: string;
  slotKey: string;
  slotLabel: string;
  entry?: { url: string; id: string };
  isUploading: boolean;
  phase: "compressing" | "uploading" | null;
  success: string | null;
  onUpload: (pageSlug: string, slot: SlotKey) => void;
  onDelete: (pageSlug: string, slot: SlotKey) => void;
}

function SlotCell({
  pageSlug, pageName, slotKey, slotLabel,
  entry, isUploading, phase, success,
  onUpload, onDelete,
}: SlotCellProps) {
  const key = `${pageSlug}::${slotKey}`;
  return (
    <div className="bg-white p-3 space-y-2">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {slotLabel}
      </p>
      <div className="relative aspect-[4/3] bg-gray-100 rounded overflow-hidden group">
        {entry ? (
          <>
            <Image fill src={entry.url} alt={`${pageName} — ${slotLabel}`} className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => onUpload(pageSlug, slotKey)} title="Reemplazar" className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100">
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(pageSlug, slotKey)} title="Eliminar" className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => onUpload(pageSlug, slotKey)}
            disabled={isUploading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-gray-400 hover:bg-gray-50 transition-colors w-full disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-[9px] text-blue-500 uppercase tracking-wide">
                  {phase === "compressing" ? "Comprimiendo..." : "Subiendo..."}
                </span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-wide">Subir foto</span>
              </>
            )}
          </button>
        )}
        {isUploading && entry && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-1">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-[9px] text-blue-500 uppercase tracking-wide">
              {phase === "compressing" ? "Comprimiendo..." : "Subiendo..."}
            </span>
          </div>
        )}
        {success === key && !isUploading && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none">
            <CheckCircle2 className="w-8 h-8 text-green-600 drop-shadow" />
          </div>
        )}
      </div>
    </div>
  );
}
