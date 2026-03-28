"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type AnnouncementItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  active: boolean;
};

type AnnouncementsData = {
  hero: {
    kicker: string;
    title: string;
    description: string;
  };
  items: AnnouncementItem[];
};

type ListedFile = {
  name: string;
  url: string;
};

type ImagePickerProps = {
  value: string;
  onSelect: (url: string) => void;
};

function DuyuruImagePicker({ value, onSelect }: ImagePickerProps) {
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function fetchFiles() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/list?folder=duyurular");
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
      formData.append("folder", "duyurular");

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

      const uploadedPath =
        json.filePath || json.fileUrl || json.path || "";

      if (uploadedPath) {
        onSelect(uploadedPath);
      }
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
          placeholder="/uploads/duyurular/ornek.jpg"
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
            <p className="text-sm font-medium">Duyuru görselleri</p>

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
              Duyurular klasöründe görsel bulunamadı.
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

type EditingAnnouncement = {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  active: boolean;
};

type AddingAnnouncement = {
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  active: boolean;
};

type DeletingAnnouncement = {
  id: string;
  title: string;
};

export default function AdminAnnouncementsPanel() {
  const [data, setData] = useState<AnnouncementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [editingItem, setEditingItem] = useState<EditingAnnouncement | null>(
    null
  );
  const [addingItem, setAddingItem] = useState<AddingAnnouncement | null>(null);
  const [deletingItem, setDeletingItem] = useState<DeletingAnnouncement | null>(
    null
  );

  async function fetchAnnouncements() {
    setLoading(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/announcements");
      const json = await res.json();

      if (!res.ok) {
        setError("Duyurular alınamadı.");
        return;
      }

      setData(json);
    } catch {
      setError("Duyurular alınırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const items = useMemo(() => {
    return [...(data?.items || [])].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [data]);

  function openAddModal() {
    setAddingItem({
      title: "",
      date: new Date().toISOString().slice(0, 10),
      image: "",
      excerpt: "",
      content: "",
      active: true,
    });
  }

  function closeAddModal() {
    setAddingItem(null);
  }

  function openEditModal(item: AnnouncementItem) {
    setEditingItem({
      id: item.id,
      title: item.title || "",
      date: item.date || "",
      image: item.image || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      active: !!item.active,
    });
  }

  function closeEditModal() {
    setEditingItem(null);
  }

  function openDeleteModal(item: AnnouncementItem) {
    setDeletingItem({
      id: item.id,
      title: item.title,
    });
  }

  function closeDeleteModal() {
    setDeletingItem(null);
  }

  async function handleAdd() {
    if (!addingItem) return;

    if (!addingItem.title.trim()) {
      setError("Duyuru başlığı zorunludur.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addingItem),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Duyuru eklenemedi.");
        return;
      }

      setSaveMessage("Yeni duyuru eklendi.");
      closeAddModal();
      await fetchAnnouncements();
    } catch {
      setError("Duyuru eklenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSave() {
    if (!editingItem) return;

    if (!editingItem.title.trim()) {
      setError("Duyuru başlığı zorunludur.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingItem),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Duyuru güncellenemedi.");
        return;
      }

      setSaveMessage("Duyuru güncellendi.");
      closeEditModal();
      await fetchAnnouncements();
    } catch {
      setError("Duyuru güncellenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deletingItem.id }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Duyuru silinemedi.");
        return;
      }

      setSaveMessage("Duyuru silindi.");
      closeDeleteModal();
      await fetchAnnouncements();
    } catch {
      setError("Duyuru silinirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="mb-1 text-2xl font-semibold">Duyurular</h2>
            <p className="text-neutral-600">
              Duyuruları buradan ekleyebilir, düzenleyebilir ve silebilirsin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-green-700 px-4 py-2 text-sm text-white"
            >
              + Yeni Duyuru
            </button>

            <button
              type="button"
              onClick={fetchAnnouncements}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm"
            >
              Yenile
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-neutral-600">Duyurular yükleniyor...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="space-y-6">
            {saveMessage ? (
              <p className="text-sm text-green-700">{saveMessage}</p>
            ) : null}

            {items.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Henüz duyuru bulunmuyor.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-neutral-200 p-4"
                  >
                    <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="text-xs font-semibold text-green-800">
                      {item.date}
                    </div>

                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>

                    <p className="mt-2 text-sm text-neutral-600">
                      {item.excerpt}
                    </p>

                    <div className="mt-3 text-xs text-neutral-500">
                      Durum: {item.active ? "Aktif" : "Pasif"}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(item)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {addingItem ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Yeni Duyuru Ekle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Yeni bir duyuru oluşturabilirsin.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddModal}
                className="text-2xl leading-none text-neutral-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Başlık</label>
                <input
                  type="text"
                  value={addingItem.title}
                  onChange={(e) =>
                    setAddingItem({ ...addingItem, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Tarih</label>
                <input
                  type="date"
                  value={addingItem.date}
                  onChange={(e) =>
                    setAddingItem({ ...addingItem, date: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Görsel</label>
                <DuyuruImagePicker
                  value={addingItem.image}
                  onSelect={(url) =>
                    setAddingItem({ ...addingItem, image: url })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Kısa Açıklama</label>
                <textarea
                  rows={3}
                  value={addingItem.excerpt}
                  onChange={(e) =>
                    setAddingItem({ ...addingItem, excerpt: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Detay Metni</label>
                <textarea
                  rows={5}
                  value={addingItem.content}
                  onChange={(e) =>
                    setAddingItem({ ...addingItem, content: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={addingItem.active}
                  onChange={(e) =>
                    setAddingItem({ ...addingItem, active: e.target.checked })
                  }
                />
                Aktif olsun
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeAddModal}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleAdd}
                disabled={saving}
                className="rounded-xl bg-green-700 px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Duyuruyu Kaydet"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingItem ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Duyuru Düzenle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Duyurunun tüm detaylarını buradan güncelleyebilirsin.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="text-2xl leading-none text-neutral-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Başlık</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Tarih</label>
                <input
                  type="date"
                  value={editingItem.date}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, date: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Görsel</label>
                <DuyuruImagePicker
                  value={editingItem.image}
                  onSelect={(url) =>
                    setEditingItem({ ...editingItem, image: url })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Kısa Açıklama</label>
                <textarea
                  rows={3}
                  value={editingItem.excerpt}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, excerpt: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Detay Metni</label>
                <textarea
                  rows={5}
                  value={editingItem.content}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, content: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editingItem.active}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      active: e.target.checked,
                    })
                  }
                />
                Aktif olsun
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleEditSave}
                disabled={saving}
                className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deletingItem ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-3 text-2xl font-semibold">Duyuruyu Sil</h3>
            <p className="mb-6 text-sm text-neutral-600">
              <strong>{deletingItem.title}</strong> başlıklı duyuruyu silmek
              istediğine emin misin?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-xl bg-red-700 px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}