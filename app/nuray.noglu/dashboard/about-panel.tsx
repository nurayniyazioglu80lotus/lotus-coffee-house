"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type AboutFeatureItem = {
  icon: string;
  title: string;
  text: string;
};

type AboutData = {
  hero: {
    kicker: string;
    title: string;
    texts: string[];
    images: string[];
  };
  purpose: {
    title: string;
    paragraphs: string[];
  };
  features: {
    title: string;
    description: string;
    items: AboutFeatureItem[];
  };
};

type ListedFile = {
  name: string;
  url: string;
};

function AboutHeroImagePicker({
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
      const res = await fetch("/api/admin/list?folder=slider", {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFiles([]);
        setPickerError(data.message || "Slider görselleri alınamadı.");
        return;
      }

      setFiles(data.files || []);
    } catch {
      setFiles([]);
      setPickerError("Slider görselleri alınamadı.");
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
      formData.append("folder", "slider");

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
          placeholder="/uploads/slider/ornek.jpg"
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
            <p className="text-sm font-medium">Slider görselleri</p>

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

export default function AboutPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savingHero, setSavingHero] = useState(false);
  const [savingPurpose, setSavingPurpose] = useState(false);
  const [savingFeatures, setSavingFeatures] = useState(false);

  const [heroKicker, setHeroKicker] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroTexts, setHeroTexts] = useState<string[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);

  const [purposeTitle, setPurposeTitle] = useState("");
  const [purposeParagraphs, setPurposeParagraphs] = useState<string[]>([]);

  const [featuresTitle, setFeaturesTitle] = useState("");
  const [featuresDescription, setFeaturesDescription] = useState("");
  const [featureItems, setFeatureItems] = useState<AboutFeatureItem[]>([]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/about", {
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || "Hakkımızda verileri alınamadı.");
        return;
      }

      const data: AboutData = json.data ?? json;

      setHeroKicker(data?.hero?.kicker || "");
      setHeroTitle(data?.hero?.title || "");
      setHeroTexts(Array.isArray(data?.hero?.texts) ? data.hero.texts : []);
      setHeroImages(Array.isArray(data?.hero?.images) ? data.hero.images : []);

      setPurposeTitle(data?.purpose?.title || "");
      setPurposeParagraphs(
        Array.isArray(data?.purpose?.paragraphs) ? data.purpose.paragraphs : []
      );

      setFeaturesTitle(data?.features?.title || "");
      setFeaturesDescription(data?.features?.description || "");
      setFeatureItems(
        Array.isArray(data?.features?.items) ? data.features.items : []
      );
    } catch {
      setError("Hakkımızda verileri alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateHeroText(index: number, value: string) {
    setHeroTexts((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function updateHeroImage(index: number, value: string) {
    setHeroImages((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  function addHeroText() {
    setHeroTexts((prev) => [...prev, ""]);
  }

  function removeHeroText(index: number) {
    setHeroTexts((prev) => prev.filter((_, i) => i !== index));
  }

  function addHeroImage() {
    setHeroImages((prev) => [...prev, ""]);
  }

  function removeHeroImage(index: number) {
    setHeroImages((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePurposeParagraph(index: number, value: string) {
    setPurposeParagraphs((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  function addPurposeParagraph() {
    setPurposeParagraphs((prev) => [...prev, ""]);
  }

  function removePurposeParagraph(index: number) {
    setPurposeParagraphs((prev) => prev.filter((_, i) => i !== index));
  }

  function updateFeatureItem(
    index: number,
    field: keyof AboutFeatureItem,
    value: string
  ) {
    setFeatureItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addFeatureItem() {
    setFeatureItems((prev) => [
      ...prev,
      {
        icon: "✨",
        title: "",
        text: "",
      },
    ]);
  }

  function removeFeatureItem(index: number) {
    setFeatureItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveHero() {
    setSavingHero(true);
    setError("");

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "hero",
          kicker: heroKicker,
          title: heroTitle,
          texts: heroTexts,
          images: heroImages,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Hero alanı kaydedilemedi.");
        return;
      }
    } catch {
      setError("Hero alanı kaydedilemedi.");
    } finally {
      setSavingHero(false);
    }
  }

  async function savePurpose() {
    setSavingPurpose(true);
    setError("");

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "purpose",
          title: purposeTitle,
          paragraphs: purposeParagraphs,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Amacımız alanı kaydedilemedi.");
        return;
      }
    } catch {
      setError("Amacımız alanı kaydedilemedi.");
    } finally {
      setSavingPurpose(false);
    }
  }

  async function saveFeatures() {
    setSavingFeatures(true);
    setError("");

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "features",
          title: featuresTitle,
          description: featuresDescription,
          items: featureItems,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Features alanı kaydedilemedi.");
        return;
      }
    } catch {
      setError("Features alanı kaydedilemedi.");
    } finally {
      setSavingFeatures(false);
    }
  }

  if (loading) {
    return <p>Hakkımızda verileri yükleniyor...</p>;
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
          <h2 className="text-xl font-semibold">Hakkımızda Hero Yönetimi</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Hero başlığı, metinleri ve slider görsellerini buradan
            düzenleyebilirsin.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm">Kicker</label>
            <input
              type="text"
              value={heroKicker}
              onChange={(e) => setHeroKicker(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Başlık</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm">Hero Metinleri</label>

              <button
                type="button"
                onClick={addHeroText}
                className="rounded-lg border px-3 py-1.5 text-xs"
              >
                + Metin Ekle
              </button>
            </div>

            {heroTexts.map((text, index) => (
              <div key={index} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Metin {index + 1}</p>

                  <button
                    type="button"
                    onClick={() => removeHeroText(index)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600"
                  >
                    Sil
                  </button>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => updateHeroText(index, e.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                  rows={3}
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm">Slider Görselleri</label>

              <button
                type="button"
                onClick={addHeroImage}
                className="rounded-lg border px-3 py-1.5 text-xs"
              >
                + Görsel Alanı Ekle
              </button>
            </div>

            {heroImages.map((image, index) => (
              <div key={index} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Görsel {index + 1}</p>

                  <button
                    type="button"
                    onClick={() => removeHeroImage(index)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600"
                  >
                    Sil
                  </button>
                </div>

                <AboutHeroImagePicker
                  value={image}
                  onSelect={(url) => updateHeroImage(index, url)}
                />
              </div>
            ))}
          </div>

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
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Amacımız Yönetimi</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Amacımız başlığı ve paragraf metinlerini buradan düzenleyebilirsin.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm">Başlık</label>
            <input
              type="text"
              value={purposeTitle}
              onChange={(e) => setPurposeTitle(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm">Paragraflar</label>

              <button
                type="button"
                onClick={addPurposeParagraph}
                className="rounded-lg border px-3 py-1.5 text-xs"
              >
                + Paragraf Ekle
              </button>
            </div>

            {purposeParagraphs.map((paragraph, index) => (
              <div key={index} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Paragraf {index + 1}</p>

                  <button
                    type="button"
                    onClick={() => removePurposeParagraph(index)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600"
                  >
                    Sil
                  </button>
                </div>

                <textarea
                  value={paragraph}
                  onChange={(e) =>
                    updatePurposeParagraph(index, e.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3"
                  rows={5}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={savePurpose}
              disabled={savingPurpose}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {savingPurpose ? "Kaydediliyor..." : "Amacımızı Kaydet"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Lotus’ta Neler Var? Yönetimi</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Alt bölüm başlığını, açıklamasını ve kart içeriklerini buradan
            düzenleyebilirsin.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm">Bölüm Başlığı</label>
            <input
              type="text"
              value={featuresTitle}
              onChange={(e) => setFeaturesTitle(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Açıklama Metni</label>
            <textarea
              value={featuresDescription}
              onChange={(e) => setFeaturesDescription(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm">Kartlar</label>

              <button
                type="button"
                onClick={addFeatureItem}
                className="rounded-lg border px-3 py-1.5 text-xs"
              >
                + Kart Ekle
              </button>
            </div>

            {featureItems.map((item, index) => (
              <div key={index} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Kart {index + 1}</p>

                  <button
                    type="button"
                    onClick={() => removeFeatureItem(index)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600"
                  >
                    Sil
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm">İkon</label>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) =>
                        updateFeatureItem(index, "icon", e.target.value)
                      }
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Başlık</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateFeatureItem(index, "title", e.target.value)
                      }
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="mb-2 block text-sm">Açıklama</label>
                    <textarea
                      value={item.text}
                      onChange={(e) =>
                        updateFeatureItem(index, "text", e.target.value)
                      }
                      className="w-full rounded-xl border px-4 py-3"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveFeatures}
              disabled={savingFeatures}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {savingFeatures ? "Kaydediliyor..." : "Özellikleri Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}