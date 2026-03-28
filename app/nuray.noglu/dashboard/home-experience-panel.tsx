"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HomeData = {
  experience: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    buttonText: string;
    image: string;
  };
};

type ListedFile = {
  name: string;
  url: string;
};

function ExperienceImagePicker({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (url: string) => void;
}) {
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function fetchFiles() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/list?folder=gallery");
      const data = await res.json();

      if (data.success) {
        setFiles(data.files || []);
      }
    } catch {}

    setLoading(false);
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-xl border px-4 py-3"
        />

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border px-4 py-3 text-sm"
        >
          Seç
        </button>
      </div>

      {open && (
        <div className="rounded-xl border p-4">
          {loading ? (
            <p>Yükleniyor...</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {files.map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => {
                    onSelect(file.url);
                    setOpen(false);
                  }}
                  className="rounded-lg border p-2"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomeExperiencePanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [image, setImage] = useState("");

  async function loadData() {
    const res = await fetch("/api/admin/home");
    const data: HomeData = await res.json();

    setTitle(data.experience.title);
    setParagraph1(data.experience.paragraph1);
    setParagraph2(data.experience.paragraph2);
    setButtonText(data.experience.buttonText);
    setImage(data.experience.image);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSave() {
    setSaving(true);

    await fetch("/api/admin/home", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "experience",
        title,
        paragraph1,
        paragraph2,
        buttonText,
        image,
      }),
    });

    setSaving(false);
    alert("Deneyim alanı güncellendi.");
  }

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="rounded-2xl border p-8 bg-white">
      <h2 className="text-xl font-semibold mb-6">
        Deneyim Alanı Yönetimi
      </h2>

      <div className="space-y-5">

        <div>
          <label className="block mb-2">
            Başlık
          </label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            rows={2}
          />
        </div>

        <div>
          <label className="block mb-2">
            1. Paragraf
          </label>
          <textarea
            value={paragraph1}
            onChange={(e) => setParagraph1(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-2">
            2. Paragraf
          </label>
          <textarea
            value={paragraph2}
            onChange={(e) => setParagraph2(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-2">
            Buton Yazısı
          </label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2">
            Görsel
          </label>

          <ExperienceImagePicker
            value={image}
            onSelect={setImage}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-black text-white px-6 py-3"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>

      </div>
    </div>
  );
}