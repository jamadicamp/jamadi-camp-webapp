"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

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

type SlotKey = (typeof SLOTS)[number]["key"];

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
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingSlotRef = useRef<{ pageSlug: string; slot: SlotKey } | null>(null);

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
    setError(null);

    try {
      // 1. Upload to Cloudinary via existing endpoint
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Error subiendo imagen");
      const { url, public_id } = await uploadRes.json();

      // 2. Save to DB
      const saveRes = await fetch("/api/cms/page-photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug, slot, url, publicId: public_id }),
      });
      if (!saveRes.ok) throw new Error("Error guardando foto");
      const saved: StoredPhoto = await saveRes.json();

      setPhotos((prev) => ({
        ...prev,
        [key]: { url: saved.url, id: saved._id },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setUploading(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (pageSlug: string, slot: SlotKey) => {
    const key = `${pageSlug}::${slot}`;
    const entry = photos[key];
    if (!entry) return;
    setUploading(key);
    try {
      await fetch(`/api/cms/page-photos/${entry.id}`, { method: "DELETE" });
      setPhotos((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch {
      setError("Error eliminando foto");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
          {error}
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
            {SLOTS.map((slot) => {
              const key = `${page.slug}::${slot.key}`;
              const entry = photos[key];
              const isUploading = uploading === key;

              return (
                <div key={slot.key} className="bg-white p-3 space-y-2">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {slot.label}
                  </p>

                  {/* Photo preview or placeholder */}
                  <div className="relative aspect-[4/3] bg-gray-100 rounded overflow-hidden group">
                    {entry ? (
                      <>
                        <Image
                          fill
                          src={entry.url}
                          alt={`${page.name} — ${slot.label}`}
                          className="object-cover"
                        />
                        {/* Overlay with replace/delete on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => handleSlotClick(page.slug, slot.key)}
                            title="Reemplazar"
                            className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(page.slug, slot.key)}
                            title="Eliminar"
                            className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleSlotClick(page.slug, slot.key)}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-gray-400 hover:bg-gray-50 transition-colors w-full"
                      >
                        {isUploading ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            <span className="text-[10px] uppercase tracking-wide">Subir foto</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Uploading overlay over existing photo */}
                    {isUploading && entry && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
