"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type FeaturedProduct = {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  active: boolean;
};

type FeaturedProductsData = {
  sectionTitle: string;
  buttonText: string;
  buttonLink: string;
  items: FeaturedProduct[];
};

type ListedFile = {
  name: string;
  url: string;
};

type ImagePickerProps = {
  value: string;
  onSelect: (url: string) => void;
};

function FeaturedImagePicker({ value, onSelect }: ImagePickerProps) {
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function fetchFiles() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/list?folder=menu");
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
      formData.append("folder", "menu");

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
          placeholder="/uploads/menu/ornek.jpg"
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
            <p className="text-sm font-medium">Öne çıkan ürün görselleri</p>

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
              Menü klasöründe görsel bulunamadı.
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

type EditingFeatured = {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  active: boolean;
};

type AddingFeatured = {
  title: string;
  price: string;
  image: string;
  description: string;
  active: boolean;
};

type DeletingFeatured = {
  id: string;
  title: string;
};

export default function AdminFeaturedProductsPanel() {
  const [data, setData] = useState<FeaturedProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [editingSection, setEditingSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  const [editingItem, setEditingItem] = useState<EditingFeatured | null>(null);
  const [addingItem, setAddingItem] = useState<AddingFeatured | null>(null);
  const [deletingItem, setDeletingItem] = useState<DeletingFeatured | null>(
    null
  );

  async function fetchFeaturedProducts() {
    setLoading(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/featured-products");
      const json = await res.json();

      if (!res.ok) {
        setError("Öne çıkan ürünler alınamadı.");
        return;
      }

      setData(json);
      setSectionTitle(json.sectionTitle || "");
      setButtonText(json.buttonText || "");
      setButtonLink(json.buttonLink || "");
    } catch {
      setError("Öne çıkan ürünler alınırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const items = useMemo(() => {
    return [...(data?.items || [])];
  }, [data]);

  function openAddModal() {
    setAddingItem({
      title: "",
      price: "",
      image: "",
      description: "",
      active: true,
    });
  }

  function closeAddModal() {
    setAddingItem(null);
  }

  function openEditModal(item: FeaturedProduct) {
    setEditingItem({
      id: item.id,
      title: item.title || "",
      price: item.price || "",
      image: item.image || "",
      description: item.description || "",
      active: !!item.active,
    });
  }

  function closeEditModal() {
    setEditingItem(null);
  }

  function openDeleteModal(item: FeaturedProduct) {
    setDeletingItem({
      id: item.id,
      title: item.title,
    });
  }

  function closeDeleteModal() {
    setDeletingItem(null);
  }

  async function handleSaveSection() {
    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/featured-products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "section",
          sectionTitle,
          buttonText,
          buttonLink,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Bölüm ayarları kaydedilemedi.");
        return;
      }

      setSaveMessage("Bölüm ayarları güncellendi.");
      setEditingSection(false);
      await fetchFeaturedProducts();
    } catch {
      setError("Bölüm ayarları kaydedilirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd() {
    if (!addingItem) return;

    if (!addingItem.title.trim()) {
      setError("Ürün adı zorunludur.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/featured-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addingItem),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Ürün eklenemedi.");
        return;
      }

      setSaveMessage("Yeni ürün eklendi.");
      closeAddModal();
      await fetchFeaturedProducts();
    } catch {
      setError("Ürün eklenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSave() {
    if (!editingItem) return;

    if (!editingItem.title.trim()) {
      setError("Ürün adı zorunludur.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/featured-products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingItem),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Ürün güncellenemedi.");
        return;
      }

      setSaveMessage("Ürün güncellendi.");
      closeEditModal();
      await fetchFeaturedProducts();
    } catch {
      setError("Ürün güncellenirken hata oluştu.");
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
      const res = await fetch("/api/admin/featured-products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deletingItem.id }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "Ürün silinemedi.");
        return;
      }

      setSaveMessage("Ürün silindi.");
      closeDeleteModal();
      await fetchFeaturedProducts();
    } catch {
      setError("Ürün silinirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="mb-1 text-2xl font-semibold">Öne Çıkan Lezzetler</h2>
            <p className="text-neutral-600">
              Ana sayfadaki öne çıkan ürünleri ve bölüm ayarlarını buradan
              yönetebilirsin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditingSection(true)}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm"
            >
              Bölüm Ayarları
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-green-700 px-4 py-2 text-sm text-white"
            >
              + Yeni Ürün
            </button>

            <button
              type="button"
              onClick={fetchFeaturedProducts}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm"
            >
              Yenile
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-neutral-600">
            Öne çıkan ürünler yükleniyor...
          </p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="space-y-6">
            {saveMessage ? (
              <p className="text-sm text-green-700">{saveMessage}</p>
            ) : null}

            {items.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Henüz öne çıkan ürün bulunmuyor.
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

                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>

                    <div className="mt-2 text-sm text-neutral-700">
                      Fiyat: {item.price || "-"}
                    </div>

                    <p className="mt-2 text-sm text-neutral-600">
                      {item.description}
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

      {editingSection ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Bölüm Ayarları</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Başlık ve buton ayarlarını buradan düzenleyebilirsin.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingSection(false)}
                className="text-2xl leading-none text-neutral-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Bölüm Başlığı</label>
                <input
                  type="text"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Buton Metni</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Buton Linki</label>
                <input
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                  placeholder="/menu"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingSection(false)}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleSaveSection}
                disabled={saving}
                className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {addingItem ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Yeni Ürün Ekle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Ana sayfada öne çıkacak yeni ürün ekleyebilirsin.
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
                <label className="mb-2 block text-sm">Ürün Adı</label>
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
                <label className="mb-2 block text-sm">Fiyat</label>
                <input
                  type="text"
                  value={addingItem.price}
                  onChange={(e) =>
                    setAddingItem({ ...addingItem, price: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Görsel</label>
                <FeaturedImagePicker
                  value={addingItem.image}
                  onSelect={(url) =>
                    setAddingItem({ ...addingItem, image: url })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Açıklama</label>
                <textarea
                  rows={4}
                  value={addingItem.description}
                  onChange={(e) =>
                    setAddingItem({
                      ...addingItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={addingItem.active}
                  onChange={(e) =>
                    setAddingItem({
                      ...addingItem,
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
                {saving ? "Kaydediliyor..." : "Ürünü Kaydet"}
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
                <h3 className="text-2xl font-semibold">Ürün Düzenle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Ürün bilgilerini buradan güncelleyebilirsin.
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
                <label className="mb-2 block text-sm">Ürün Adı</label>
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
                <label className="mb-2 block text-sm">Fiyat</label>
                <input
                  type="text"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, price: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Görsel</label>
                <FeaturedImagePicker
                  value={editingItem.image}
                  onSelect={(url) =>
                    setEditingItem({ ...editingItem, image: url })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Açıklama</label>
                <textarea
                  rows={4}
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
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
            <h3 className="mb-3 text-2xl font-semibold">Ürünü Sil</h3>
            <p className="mb-6 text-sm text-neutral-600">
              <strong>{deletingItem.title}</strong> adlı ürünü silmek istediğine
              emin misin?
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