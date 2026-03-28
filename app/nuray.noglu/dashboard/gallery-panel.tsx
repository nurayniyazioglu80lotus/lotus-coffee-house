"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  active: boolean;
};

type GalleryData = {
  hero: {
    kicker: string;
    title: string;
    text: string;
  };
  images: GalleryImage[];
};

type ListedFile = {
  name: string;
  url: string;
};

function GalleryImagePicker({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (url: string) => void;
}) {
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickerError, setPickerError] = useState("");

  async function fetchFiles() {
    setLoading(true);
    setPickerError("");

    try {
      const res = await fetch("/api/admin/list?folder=gallery", {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFiles([]);
        setPickerError(data.message || "Galeri görselleri alınamadı.");
        return;
      }

      setFiles(data.files || []);
    } catch {
      setFiles([]);
      setPickerError("Galeri görselleri alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    setPickerError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setPickerError(json.message || "Görsel yüklenemedi.");
        return;
      }

      await fetchFiles();

      const uploadedPath = json.filePath || json.fileUrl || json.path || "";
      if (uploadedPath) {
        onSelect(uploadedPath);
      }
    } catch {
      setPickerError("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3"
          placeholder="/uploads/gallery/ornek.jpg"
        />

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl border border-neutral-300 px-4 py-3 text-sm"
        >
          {open ? "Gizle" : "Seç"}
        </button>
      </div>

      {pickerError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pickerError}
        </div>
      ) : null}

      {open ? (
        <div className="rounded-xl border border-neutral-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Galeri görselleri</p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchFiles}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs"
              >
                Yenile
              </button>

              <label className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-1.5 text-xs">
                {uploading ? "Yükleniyor..." : "Görsel Yükle"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await handleUpload(file);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-neutral-500">Görseller yükleniyor...</p>
          ) : files.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Galeri klasöründe görsel bulunamadı.
            </p>
          ) : (
            <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-3">
              {files.map((file) => {
                const isSelected = value === file.url;

                return (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => {
                      onSelect(file.url);
                      setOpen(false);
                    }}
                    className={`rounded-xl border p-2 text-left ${
                      isSelected
                        ? "border-green-700 ring-2 ring-green-200"
                        : "border-neutral-200"
                    }`}
                  >
                    <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg">
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <p className="break-words text-xs text-neutral-700">
                      {file.name}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function GalleryPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savingHero, setSavingHero] = useState(false);
  const [savingImages, setSavingImages] = useState(false);

  const [heroKicker, setHeroKicker] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroText, setHeroText] = useState("");
  const [images, setImages] = useState<GalleryImage[]>([]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/gallery", {
        cache: "no-store",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Galeri verileri alınamadı.");
        return;
      }

      const data: GalleryData = json.data ?? json;

      setHeroKicker(data?.hero?.kicker || "");
      setHeroTitle(data?.hero?.title || "");
      setHeroText(data?.hero?.text || "");
      setImages(Array.isArray(data?.images) ? data.images : []);
    } catch {
      setError("Galeri verileri alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateImage(
    index: number,
    field: keyof GalleryImage,
    value: string | boolean
  ) {
    setImages((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addImageItem() {
    setImages((prev) => [
      ...prev,
      {
        id: `gallery-${Date.now()}`,
        src: "",
        alt: "",
        active: true,
      },
    ]);
  }

  function removeImageItem(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveHero() {
    setSavingHero(true);
    setError("");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "hero",
          kicker: heroKicker,
          title: heroTitle,
          text: heroText,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Galeri hero alanı kaydedilemedi.");
      }
    } catch {
      setError("Galeri hero alanı kaydedilemedi.");
    } finally {
      setSavingHero(false);
    }
  }

  async function saveImages() {
    setSavingImages(true);
    setError("");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "images",
          images,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Galeri görselleri kaydedilemedi.");
      }
    } catch {
      setError("Galeri görselleri kaydedilemedi.");
    } finally {
      setSavingImages(false);
    }
  }

  if (loading) {
    return <p>Galeri verileri yükleniyor...</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Galeri Hero Yönetimi</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Galeri sayfasının üst başlık alanını buradan düzenleyebilirsin.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={heroKicker}
            onChange={(e) => setHeroKicker(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Kicker"
          />

          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Başlık"
          />

          <textarea
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            rows={4}
            placeholder="Açıklama metni"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveHero}
              disabled={savingHero}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {savingHero ? "Kaydediliyor..." : "Hero Alanını Kaydet"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Galeri Görselleri</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Görselleri ekleyebilir, seçebilir, açıklama yazabilir ve aktif/pasif yapabilirsin.
            </p>
          </div>

          <button
            type="button"
            onClick={addImageItem}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            + Görsel Ekle
          </button>
        </div>

        <div className="space-y-4">
          {images.map((item, index) => (
            <div key={item.id} className="rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Görsel {index + 1}</p>

                <button
                  type="button"
                  onClick={() => removeImageItem(index)}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600"
                >
                  Sil
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm">Görsel</label>
                  <GalleryImagePicker
                    value={item.src}
                    onSelect={(url) => updateImage(index, "src", url)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Alt Metin</label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) =>
                      updateImage(index, "alt", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(e) =>
                      updateImage(index, "active", e.target.checked)
                    }
                  />
                  Aktif olsun
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveImages}
              disabled={savingImages}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {savingImages ? "Kaydediliyor..." : "Görselleri Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}