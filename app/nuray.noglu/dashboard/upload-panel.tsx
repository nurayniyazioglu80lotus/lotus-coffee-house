"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type FolderType = "menu" | "gallery" | "slider" | "duyurular";

type ListedFile = {
  name: string;
  url: string;
};

export default function AdminUploadPanel() {
  const [folder, setFolder] = useState<FolderType>("slider");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedPath, setUploadedPath] = useState("");
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [deletingFileName, setDeletingFileName] = useState<string | null>(null);

  async function fetchFiles(selectedFolder: FolderType) {
    setListLoading(true);

    try {
      const res = await fetch(`/api/admin/list?folder=${selectedFolder}`, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return;
      }

      setFiles(data.files || []);
    } catch {
      // sessiz geçiyoruz
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles(folder);
  }, [folder]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setMessage("Lütfen bir görsel seç.");
      return;
    }

    setLoading(true);
    setMessage("");
    setUploadedPath("");

    try {
      const formData = new FormData();
      formData.append("folder", folder);
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Yükleme başarısız.");
        return;
      }

      setMessage("Görsel başarıyla yüklendi.");
      setUploadedPath(data.filePath);
      setFile(null);

      await fetchFiles(folder);
    } catch {
      setMessage("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteImage(fileName: string) {
    const confirmed = window.confirm(
      `"${fileName}" görselini silmek istediğine emin misin?`
    );

    if (!confirmed) return;

    setDeletingFileName(fileName);
    setMessage("");

    try {
      const res = await fetch("/api/admin/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder,
          fileName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Görsel silinemedi.");
        return;
      }

      setMessage("Görsel silindi.");
      setUploadedPath("");

      await fetchFiles(folder);
    } catch {
      setMessage("Silme sırasında hata oluştu.");
    } finally {
      setDeletingFileName(null);
    }
  }

  return (
    <div className="rounded-2xl bg-white shadow-md border border-neutral-200 p-8">
      <h2 className="text-2xl font-semibold mb-2">Görsel Yükleme</h2>

      <p className="text-neutral-600 mb-6">
        Dosya seç, kategori belirle ve yüklenen görselleri altta görüntüle.
      </p>

      <form onSubmit={handleUpload} className="space-y-5">
        <div>
          <label className="block text-sm mb-2">Kategori</label>

          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value as FolderType)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3"
          >
            <option value="menu">Menü</option>
            <option value="gallery">Galeri</option>
            <option value="slider">Slider</option>
            <option value="duyurular">Duyurular</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Görsel Seç</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black text-white px-6 py-3 disabled:opacity-60"
        >
          {loading ? "Yükleniyor..." : "Görseli Yükle"}
        </button>
      </form>

      {message && <p className="mt-5 text-sm">{message}</p>}

      {uploadedPath && (
        <div className="mt-6 border p-4 rounded-xl">
          <p className="text-sm mb-3">
            <strong>Yüklenen yol:</strong>
            <br />
            {uploadedPath}
          </p>

          <div className="relative w-full max-w-md aspect-[4/3]">
            <Image
              src={uploadedPath}
              alt="Yüklenen görsel"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Yüklenen Görseller</h3>
          <button
            type="button"
            onClick={() => fetchFiles(folder)}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm"
          >
            Yenile
          </button>
        </div>

        {listLoading ? (
          <p className="text-sm text-neutral-600">Liste yükleniyor...</p>
        ) : files.length === 0 ? (
          <p className="text-sm text-neutral-600">
            Bu klasörde henüz görsel yok.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-neutral-200 p-3"
              >
                <div className="relative w-full aspect-[4/3] mb-3">
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <p className="text-sm break-words">{item.name}</p>
                <p className="text-xs text-neutral-500 mt-1 break-words">
                  {item.url}
                </p>

                <button
                  type="button"
                  onClick={() => handleDeleteImage(item.name)}
                  disabled={deletingFileName === item.name}
                  className="mt-3 rounded-lg bg-red-600 text-white px-4 py-2 text-sm disabled:opacity-60"
                >
                  {deletingFileName === item.name ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}