"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HomeData = {
  hero: {
    text: string;
    image: string;
  };
};

type ListedFile = {
  name: string;
  url: string;
};

function HomeHeroImagePicker({
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

  async function fetchFiles() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/list?folder=slider");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFiles([]);
        return;
      }

      setFiles(data.files || []);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "slider");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.message || "Görsel yüklenemedi.");
        return;
      }

      await fetchFiles();

      const uploadedPath = json.filePath || json.fileUrl || json.path || "";
      if (uploadedPath) onSelect(uploadedPath);
    } catch {
      alert("Görsel yüklenirken hata oluştu.");
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
          placeholder="/uploads/slider/hero.jpg"
        />

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="shrink-0 rounded-xl border border-neutral-300 px-4 py-3 text-sm"
        >
          {open ? "Gizle" : "Seç"}
        </button>
      </div>

      {open ? (
        <div className="rounded-xl border border-neutral-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Hero görselleri</p>

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
              Slider klasöründe görsel bulunamadı.
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

export default function HomeHeroPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchHomeData() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/home");
      const data = (await res.json()) as HomeData;

      setText(data.hero?.text || "");
      setImage(data.hero?.image || "");
    } catch {
      setError("Hero verisi alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHomeData();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "hero",
          text,
          image,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Hero kaydedilemedi.");
        return;
      }

      setMessage("Hero alanı güncellendi.");
    } catch {
      setError("Hero alanı kaydedilirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-md">
      <div className="mb-6">
        <h2 className="mb-1 text-2xl font-semibold">Hero Yönetimi</h2>
        <p className="text-neutral-600">
          Ana sayfadaki hero görseli ve alt şerit metnini buradan düzenleyebilirsin.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-600">Hero verisi yükleniyor...</p>
      ) : (
        <div className="space-y-5">
          {message ? <p className="text-sm text-green-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div>
            <label className="mb-2 block text-sm">Hero Görseli</label>
            <HomeHeroImagePicker value={image} onSelect={setImage} />
          </div>

          <div>
            <label className="mb-2 block text-sm">Alt Şerit Metni</label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}