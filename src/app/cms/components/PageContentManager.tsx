"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

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

interface PageContentDoc {
  pageSlug: string;
  title: string;
  subtitle: string;
  description: string;
}

type ContentMap = Record<string, PageContentDoc>;

export default function PageContentManager() {
  const [contentMap, setContentMap] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(PAGE_DEFINITIONS[0].slug);
  const [draft, setDraft] = useState({ title: "", subtitle: "", description: "" });

  useEffect(() => {
    fetch("/api/cms/page-content")
      .then((r) => r.json())
      .then((docs: PageContentDoc[]) => {
        const map: ContentMap = {};
        for (const doc of docs) map[doc.pageSlug] = doc;
        setContentMap(map);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const existing = contentMap[selectedSlug];
    setDraft({
      title: existing?.title || "",
      subtitle: existing?.subtitle || "",
      description: existing?.description || "",
    });
  }, [selectedSlug, contentMap]);

  async function handleSave() {
    setSaving(selectedSlug);
    try {
      const res = await fetch("/api/cms/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug: selectedSlug, ...draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated: PageContentDoc = await res.json();
      setContentMap((prev) => ({ ...prev, [selectedSlug]: updated }));
      setSaved(selectedSlug);
      setTimeout(() => setSaved(null), 2500);
    } catch {
      alert("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-4">
        <Loader2 className="animate-spin w-4 h-4" />
        <span>Cargando contenido...</span>
      </div>
    );
  }

  const selectedPage = PAGE_DEFINITIONS.find((p) => p.slug === selectedSlug)!;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Page selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Página
        </label>
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="block w-full md:w-72 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {PAGE_DEFINITIONS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de página
          </label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder={`Ej: ${selectedPage.name}`}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            Deja vacío para usar el título predeterminado de la página.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtítulo / Tagline
          </label>
          <input
            type="text"
            value={draft.subtitle}
            onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
            placeholder="Ej: Una experiencia única en la naturaleza"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción principal
          </label>
          <textarea
            rows={5}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            placeholder="Descripción que aparecerá en la sección principal de la página..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving === selectedSlug}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {saving === selectedSlug ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : null}
            Guardar
          </button>
          {saved === selectedSlug && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Guardado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
