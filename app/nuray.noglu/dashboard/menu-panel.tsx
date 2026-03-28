"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type MenuItem = {
  name: string;
  price?: string;
  description?: string;
};

type MenuCategory = {
  name: string;
  image: string;
  items: MenuItem[];
};

type MenuExtra = {
  name: string;
  price: string;
};

type MenuData = {
  categories: MenuCategory[];
  extras?: MenuExtra[];
  note?: string;
};

type EditingState = {
  categoryIndex: number;
  itemIndex: number;
  categoryName: string;
  categoryImage: string;
  itemName: string;
  itemPrice: string;
  itemDescription: string;
};

type AddingState = {
  categoryIndex: number;
  name: string;
  price: string;
  description: string;
};

type DeletingState = {
  categoryIndex: number;
  itemIndex: number;
  itemName: string;
};

type AddingCategoryState = {
  name: string;
  image: string;
};

type DeletingCategoryState = {
  categoryIndex: number;
  categoryName: string;
};

type EditingExtraState = {
  extraIndex: number;
  name: string;
  price: string;
};

type AddingExtraState = {
  name: string;
  price: string;
};

type DeletingExtraState = {
  extraIndex: number;
  extraName: string;
};

type ListedFile = {
  name: string;
  url: string;
};

type MenuImagePickerProps = {
  value: string;
  onSelect: (url: string) => void;
};

function MenuImagePicker({ value, onSelect }: MenuImagePickerProps) {
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

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
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Menü görselleri</p>

            <button
              type="button"
              onClick={fetchFiles}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs"
            >
              Yenile
            </button>
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

export default function AdminMenuPanel() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingItem, setEditingItem] = useState<EditingState | null>(null);
  const [addingItem, setAddingItem] = useState<AddingState | null>(null);
  const [deletingItem, setDeletingItem] = useState<DeletingState | null>(null);
  const [addingCategory, setAddingCategory] =
    useState<AddingCategoryState | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<DeletingCategoryState | null>(null);

  const [editingExtra, setEditingExtra] = useState<EditingExtraState | null>(
    null
  );
  const [addingExtra, setAddingExtra] = useState<AddingExtraState | null>(null);
  const [deletingExtra, setDeletingExtra] =
    useState<DeletingExtraState | null>(null);

  async function fetchMenu() {
    setLoading(true);
    setError("");
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Menü verisi alınamadı.");
        return;
      }

      setMenuData(data.data);
    } catch {
      setError("Menü verisi alınırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  const hasCategories = useMemo(
    () => !!menuData?.categories?.length,
    [menuData]
  );

  function cloneMenuData() {
    return JSON.parse(JSON.stringify(menuData)) as MenuData;
  }

  async function saveMenuData(updatedMenuData: MenuData, successText: string) {
    const res = await fetch("/api/admin/menu/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        menuData: updatedMenuData,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Menü güncellenemedi.");
    }

    setMenuData(updatedMenuData);
    setSaveMessage(successText);
  }

  function openEditModal(categoryIndex: number, itemIndex: number) {
    if (!menuData) return;

    const category = menuData.categories[categoryIndex];
    const item = category.items[itemIndex];

    setEditingItem({
      categoryIndex,
      itemIndex,
      categoryName: category.name || "",
      categoryImage: category.image || "",
      itemName: item.name || "",
      itemPrice: item.price || "",
      itemDescription: item.description || "",
    });
  }

  function closeEditModal() {
    setEditingItem(null);
  }

  function updateEditingField(
    field: keyof EditingState,
    value: string | number
  ) {
    if (!editingItem) return;

    setEditingItem({
      ...editingItem,
      [field]: value,
    });
  }

  async function handleSaveEdit() {
    if (!menuData || !editingItem) return;

    setSaving(true);
    setSaveMessage("");
    setError("");

    try {
      const updatedMenuData = cloneMenuData();

      const category = updatedMenuData.categories[editingItem.categoryIndex];
      const item = category.items[editingItem.itemIndex];

      category.name = editingItem.categoryName.trim();
      category.image = editingItem.categoryImage.trim();
      item.name = editingItem.itemName.trim();
      item.price = editingItem.itemPrice.trim();
      item.description = editingItem.itemDescription.trim();

      await saveMenuData(updatedMenuData, "Ürün başarıyla güncellendi.");
      closeEditModal();
    } catch (err: any) {
      setError(err.message || "Kaydetme sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function openAddModal(categoryIndex: number) {
    setAddingItem({
      categoryIndex,
      name: "",
      price: "",
      description: "",
    });
  }

  function closeAddModal() {
    setAddingItem(null);
  }

  function updateAddingField(field: keyof AddingState, value: string | number) {
    if (!addingItem) return;

    setAddingItem({
      ...addingItem,
      [field]: value,
    });
  }

  async function handleAddNewItem() {
    if (!menuData || !addingItem) return;

    const newName = addingItem.name.trim();

    if (!newName) {
      setError("Yeni ürün için ürün adı zorunludur.");
      return;
    }

    setSaving(true);
    setSaveMessage("");
    setError("");

    try {
      const updatedMenuData = cloneMenuData();

      updatedMenuData.categories[addingItem.categoryIndex].items.push({
        name: newName,
        price: addingItem.price.trim(),
        description: addingItem.description.trim(),
      });

      await saveMenuData(updatedMenuData, "Yeni ürün eklendi.");
      setAddingItem(null);
    } catch (err: any) {
      setError(err.message || "Ürün eklenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteModal(
    categoryIndex: number,
    itemIndex: number,
    itemName: string
  ) {
    setDeletingItem({
      categoryIndex,
      itemIndex,
      itemName,
    });
  }

  function closeDeleteModal() {
    setDeletingItem(null);
  }

  async function handleDeleteItem() {
    if (!menuData || !deletingItem) return;

    setSaving(true);
    setSaveMessage("");
    setError("");

    try {
      const updatedMenuData = cloneMenuData();

      updatedMenuData.categories[deletingItem.categoryIndex].items.splice(
        deletingItem.itemIndex,
        1
      );

      await saveMenuData(updatedMenuData, "Ürün silindi.");
      closeDeleteModal();
    } catch (err: any) {
      setError(err.message || "Ürün silinirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function openAddCategoryModal() {
    setAddingCategory({
      name: "",
      image: "/uploads/menu/yeni-kategori.jpg",
    });
  }

  function closeAddCategoryModal() {
    setAddingCategory(null);
  }

  function updateCategoryField(
    field: keyof AddingCategoryState,
    value: string
  ) {
    if (!addingCategory) return;

    setAddingCategory({
      ...addingCategory,
      [field]: value,
    });
  }

  async function handleAddCategory() {
    if (!menuData || !addingCategory) return;

    const newName = addingCategory.name.trim();
    const newImage = addingCategory.image.trim();

    if (!newName) {
      setError("Kategori adı zorunludur.");
      return;
    }

    if (!newImage) {
      setError("Kategori görsel yolu zorunludur.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const updatedMenuData = cloneMenuData();

      updatedMenuData.categories.push({
        name: newName,
        image: newImage,
        items: [],
      });

      await saveMenuData(updatedMenuData, "Yeni kategori eklendi.");
      setAddingCategory(null);
    } catch (err: any) {
      setError(err.message || "Kategori eklenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteCategoryModal(categoryIndex: number, categoryName: string) {
    setDeletingCategory({
      categoryIndex,
      categoryName,
    });
  }

  function closeDeleteCategoryModal() {
    setDeletingCategory(null);
  }

  async function handleDeleteCategory() {
    if (!menuData || !deletingCategory) return;

    setSaving(true);
    setSaveMessage("");
    setError("");

    try {
      const updatedMenuData = cloneMenuData();

      updatedMenuData.categories.splice(deletingCategory.categoryIndex, 1);

      await saveMenuData(updatedMenuData, "Kategori silindi.");
      closeDeleteCategoryModal();
    } catch (err: any) {
      setError(err.message || "Kategori silinirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function openAddExtraModal() {
    setAddingExtra({
      name: "",
      price: "",
    });
  }

  function closeAddExtraModal() {
    setAddingExtra(null);
  }

  function updateAddingExtraField(
    field: keyof AddingExtraState,
    value: string
  ) {
    if (!addingExtra) return;

    setAddingExtra({
      ...addingExtra,
      [field]: value,
    });
  }

  async function handleAddExtra() {
    if (!menuData || !addingExtra) return;

    const newName = addingExtra.name.trim();
    const newPrice = addingExtra.price.trim();

    if (!newName) {
      setError("Extra adı zorunludur.");
      return;
    }

    if (!newPrice) {
      setError("Extra fiyatı zorunludur.");
      return;
    }

    setSaving(true);
    setSaveMessage("");
    setError("");

    try {
      const updatedMenuData = cloneMenuData();

      if (!updatedMenuData.extras) {
        updatedMenuData.extras = [];
      }

      updatedMenuData.extras.push({
        name: newName,
        price: newPrice,
      });

      await saveMenuData(updatedMenuData, "Yeni extra eklendi.");
      closeAddExtraModal();
    } catch (err: any) {
      setError(err.message || "Extra eklenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function openEditExtraModal(extraIndex: number) {
    if (!menuData?.extras) return;

    const extra = menuData.extras[extraIndex];

    setEditingExtra({
      extraIndex,
      name: extra.name || "",
      price: extra.price || "",
    });
  }

  function closeEditExtraModal() {
    setEditingExtra(null);
  }

  function updateEditingExtraField(
    field: keyof EditingExtraState,
    value: string
  ) {
    if (!editingExtra) return;

    setEditingExtra({
      ...editingExtra,
      [field]: value,
    });
  }

  async function handleSaveExtraEdit() {
    if (!menuData || !editingExtra) return;

    setSaving(true);
    setSaveMessage("");
    setError("");

    try {
      const updatedMenuData = cloneMenuData();

      if (!updatedMenuData.extras) {
        updatedMenuData.extras = [];
      }

      updatedMenuData.extras[editingExtra.extraIndex] = {
        name: editingExtra.name.trim(),
        price: editingExtra.price.trim(),
      };

      await saveMenuData(updatedMenuData, "Extra güncellendi.");
      closeEditExtraModal();
    } catch (err: any) {
      setError(err.message || "Extra güncellenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteExtraModal(extraIndex: number, extraName: string) {
    setDeletingExtra({
      extraIndex,
      extraName,
    });
  }

  function closeDeleteExtraModal() {
    setDeletingExtra(null);
  }

  async function handleDeleteExtra() {
    if (!menuData || !deletingExtra) return;

    setSaving(true);
    setSaveMessage("");
    setError("");

    try {
      const updatedMenuData = cloneMenuData();

      if (!updatedMenuData.extras) {
        updatedMenuData.extras = [];
      }

      updatedMenuData.extras.splice(deletingExtra.extraIndex, 1);

      await saveMenuData(updatedMenuData, "Extra silindi.");
      closeDeleteExtraModal();
    } catch (err: any) {
      setError(err.message || "Extra silinirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl bg-white shadow-md border border-neutral-200 p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="mb-1 text-2xl font-semibold">Menü Verileri</h2>
            <p className="text-neutral-600">
              Ürünleri, kategorileri ve extras alanını buradan yönetebilirsin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddCategoryModal}
              className="rounded-xl bg-green-700 px-4 py-2 text-sm text-white"
            >
              + Yeni Kategori
            </button>

            <button
              type="button"
              onClick={fetchMenu}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm"
            >
              Yenile
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-neutral-600">Menü yükleniyor...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !menuData || !hasCategories ? (
          <p className="text-sm text-neutral-600">Menü verisi bulunamadı.</p>
        ) : (
          <div className="space-y-6">
            {saveMessage ? (
              <p className="text-sm text-green-700">{saveMessage}</p>
            ) : null}

            {menuData.categories.map((category, categoryIndex) => (
              <div
                key={`${category.name}-${categoryIndex}`}
                className="rounded-xl border border-neutral-200 p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="break-all text-sm text-neutral-500">
                      Görsel: {category.image}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openDeleteCategoryModal(categoryIndex, category.name)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                  >
                    Kategoriyi Sil
                  </button>
                </div>

                {!category.items?.length ? (
                  <p className="text-sm text-neutral-500">
                    Bu kategoride henüz ürün yok.
                  </p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={`${item.name}-${itemIndex}`}
                        className="rounded-lg border border-neutral-200 px-4 py-3"
                      >
                        <div className="font-medium">{item.name}</div>

                        {item.price ? (
                          <div className="mt-1 text-sm text-neutral-600">
                            Fiyat: {item.price}
                          </div>
                        ) : (
                          <div className="mt-1 text-sm text-neutral-400">
                            Fiyat yok.
                          </div>
                        )}

                        {item.description ? (
                          <div className="mt-1 text-sm text-neutral-500">
                            {item.description}
                          </div>
                        ) : (
                          <div className="mt-1 text-sm text-neutral-400">
                            Açıklama yok.
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(categoryIndex, itemIndex)
                            }
                            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                          >
                            Düzenle
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                categoryIndex,
                                itemIndex,
                                item.name
                              )
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => openAddModal(categoryIndex)}
                  className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm text-white"
                >
                  + Yeni Ürün Ekle
                </button>
              </div>
            ))}

            <div className="rounded-xl border border-neutral-200 p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Extra Seçenekler</h3>
                  <p className="text-sm text-neutral-500">
                    Bitkisel süt, laktozsuz süt gibi ek seçenekleri
                    yönetebilirsin.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddExtraModal}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white"
                >
                  + Yeni Extra
                </button>
              </div>

              {!menuData.extras?.length ? (
                <p className="text-sm text-neutral-500">
                  Henüz extra seçeneği yok.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {menuData.extras.map((extra, extraIndex) => (
                    <div
                      key={`${extra.name}-${extraIndex}`}
                      className="rounded-lg border border-neutral-200 px-4 py-3"
                    >
                      <div className="font-medium">{extra.name}</div>
                      <div className="mt-1 text-sm text-neutral-600">
                        Fiyat: {extra.price}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditExtraModal(extraIndex)}
                          className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                        >
                          Düzenle
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openDeleteExtraModal(extraIndex, extra.name)
                          }
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
          </div>
        )}
      </div>

      {editingItem ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Ürün Düzenle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Ürün ve kategori bilgilerini buradan güncelleyebilirsin.
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

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm">Kategori Adı</label>
                <input
                  type="text"
                  value={editingItem.categoryName}
                  onChange={(e) =>
                    updateEditingField("categoryName", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Kategori Görsel Yolu</label>
                <MenuImagePicker
                  value={editingItem.categoryImage}
                  onSelect={(url) => updateEditingField("categoryImage", url)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Ürün Adı</label>
                <input
                  type="text"
                  value={editingItem.itemName}
                  onChange={(e) =>
                    updateEditingField("itemName", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Fiyat</label>
                <input
                  type="text"
                  value={editingItem.itemPrice}
                  onChange={(e) =>
                    updateEditingField("itemPrice", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                  placeholder="Örn: 140₺"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm">Açıklama</label>
                <textarea
                  value={editingItem.itemDescription}
                  onChange={(e) =>
                    updateEditingField("itemDescription", e.target.value)
                  }
                  rows={5}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>
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
                onClick={handleSaveEdit}
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
          <div className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Yeni Ürün Ekle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Seçtiğin kategoriye yeni ürün ekleyebilirsin.
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
                  value={addingItem.name}
                  onChange={(e) =>
                    updateAddingField("name", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                  placeholder="Örn: Affogato"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Fiyat</label>
                <input
                  type="text"
                  value={addingItem.price}
                  onChange={(e) =>
                    updateAddingField("price", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                  placeholder="Örn: 190₺"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Açıklama</label>
                <textarea
                  value={addingItem.description}
                  onChange={(e) =>
                    updateAddingField("description", e.target.value)
                  }
                  rows={5}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                  placeholder="Ürün hakkında kısa açıklama"
                />
              </div>
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
                onClick={handleAddNewItem}
                disabled={saving}
                className="rounded-xl bg-green-700 px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Yeni Ürünü Kaydet"}
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
              <strong>{deletingItem.itemName}</strong> adlı ürünü silmek
              istediğine emin misin? Bu işlem kaydedildiğinde ürün menüden
              kaldırılacaktır.
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
                onClick={handleDeleteItem}
                disabled={saving}
                className="rounded-xl bg-red-600 px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {addingCategory ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Yeni Kategori Ekle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Menüye yeni bir kategori ekleyebilirsin.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddCategoryModal}
                className="text-2xl leading-none text-neutral-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Kategori Adı</label>
                <input
                  type="text"
                  value={addingCategory.name}
                  onChange={(e) =>
                    updateCategoryField("name", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                  placeholder="Örn: Smoothie"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Kategori Görsel Yolu</label>
                <MenuImagePicker
                  value={addingCategory.image}
                  onSelect={(url) => updateCategoryField("image", url)}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeAddCategoryModal}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleAddCategory}
                disabled={saving}
                className="rounded-xl bg-green-700 px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Yeni Kategoriyi Kaydet"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deletingCategory ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-3 text-2xl font-semibold">Kategoriyi Sil</h3>
            <p className="mb-6 text-sm text-neutral-600">
              <strong>{deletingCategory.categoryName}</strong> kategorisini
              silmek istediğine emin misin? Bu işlem kategori içindeki tüm
              ürünleri de kaldıracaktır.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteCategoryModal}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={saving}
                className="rounded-xl bg-red-700 px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Siliniyor..." : "Evet, Kategoriyi Sil"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {addingExtra ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Yeni Extra Ekle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Menüye yeni bir extra seçeneği ekleyebilirsin.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddExtraModal}
                className="text-2xl leading-none text-neutral-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Extra Adı</label>
                <input
                  type="text"
                  value={addingExtra.name}
                  onChange={(e) =>
                    updateAddingExtraField("name", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                  placeholder="Örn: Hindistan cevizi sütü"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Fiyat</label>
                <input
                  type="text"
                  value={addingExtra.price}
                  onChange={(e) =>
                    updateAddingExtraField("price", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                  placeholder="Örn: 50₺"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeAddExtraModal}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleAddExtra}
                disabled={saving}
                className="rounded-xl bg-green-700 px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Yeni Extra Kaydet"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingExtra ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Extra Düzenle</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Extra adını ve fiyatını güncelleyebilirsin.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditExtraModal}
                className="text-2xl leading-none text-neutral-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Extra Adı</label>
                <input
                  type="text"
                  value={editingExtra.name}
                  onChange={(e) =>
                    updateEditingExtraField("name", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Fiyat</label>
                <input
                  type="text"
                  value={editingExtra.price}
                  onChange={(e) =>
                    updateEditingExtraField("price", e.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeEditExtraModal}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleSaveExtraEdit}
                disabled={saving}
                className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deletingExtra ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-3 text-2xl font-semibold">Extra Sil</h3>
            <p className="mb-6 text-sm text-neutral-600">
              <strong>{deletingExtra.extraName}</strong> adlı extra seçeneğini
              silmek istediğine emin misin?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteExtraModal}
                className="rounded-xl border border-neutral-300 px-5 py-3"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleDeleteExtra}
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