"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HomeData = {
  signature: {
    title: string;
    text: string;
    image: string;
  };
};

type ListedFile = {
  name: string;
  url: string;
};

function SignatureImagePicker({
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
                      className="rounded-lg object-cover"
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

export default function HomeSignaturePanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  async function loadData() {
    const res = await fetch("/api/admin/home");
    const data: HomeData = await res.json();

    setTitle(data.signature.title);
    setText(data.signature.text);
    setImage(data.signature.image);

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
        type: "signature",
        title,
        text,
        image,
      }),
    });

    setSaving(false);
    alert("Signature Banner güncellendi.");
  }

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="rounded-2xl border bg-white p-8">
      <h2 className="mb-6 text-xl font-semibold">
        Signature Banner Yönetimi
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block">Başlık</label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            rows={3}
          />
        </div>

        <div>
          <label className="mb-2 block">Açıklama Metni</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-2 block">Banner Görseli</label>
          <SignatureImagePicker value={image} onSelect={setImage} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-black px-6 py-3 text-white"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}