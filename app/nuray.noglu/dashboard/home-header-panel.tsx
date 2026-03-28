"use client";

import { useEffect, useState } from "react";

type NavItem = {
  id: number;
  label: string;
  href: string;
  active: boolean;
};

type ActionItem = {
  id: number;
  label: string;
  href: string;
  active: boolean;
  style: "outline" | "highlight";
};

type HeaderData = {
  success: boolean;
  navigation: NavItem[];
  actions: ActionItem[];
};

export default function HomeHeaderPanel() {
  const [loading, setLoading] = useState(true);
  const [savingNav, setSavingNav] = useState(false);
  const [savingActions, setSavingActions] = useState(false);

  const [navigation, setNavigation] = useState<NavItem[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);

  async function loadData() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/header");
      const data: HeaderData = await res.json();

      if (data.success) {
        setNavigation(data.navigation || []);
        setActions(data.actions || []);
      }
    } catch {
      alert("Header verileri alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveNavigation() {
    setSavingNav(true);

    try {
      await fetch("/api/admin/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "navigation",
          items: navigation,
        }),
      });

      alert("Menü linkleri güncellendi.");
    } catch {
      alert("Menü linkleri kaydedilemedi.");
    } finally {
      setSavingNav(false);
    }
  }

  async function saveActions() {
    setSavingActions(true);

    try {
      await fetch("/api/admin/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "actions",
          items: actions,
        }),
      });

      alert("Header butonları güncellendi.");
    } catch {
      alert("Header butonları kaydedilemedi.");
    } finally {
      setSavingActions(false);
    }
  }

  function updateNavItem(id: number, field: keyof NavItem, value: string | boolean) {
    setNavigation((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function updateActionItem(
    id: number,
    field: keyof ActionItem,
    value: string | boolean
  ) {
    setActions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  if (loading) {
    return <p>Header verileri yükleniyor...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Header Menü Linkleri</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Üst menüde görünen sayfa linklerini buradan düzenleyebilirsin.
          </p>
        </div>

        <div className="space-y-4">
          {navigation.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm">Başlık</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      updateNavItem(item.id, "label", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Link</label>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) =>
                      updateNavItem(item.id, "href", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) =>
                        updateNavItem(item.id, "active", e.target.checked)
                      }
                    />
                    Aktif olsun
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveNavigation}
              disabled={savingNav}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {savingNav ? "Kaydediliyor..." : "Menü Linklerini Kaydet"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Header Aksiyon Butonları</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Sağ tarafta görünen butonları buradan düzenleyebilirsin.
          </p>
        </div>

        <div className="space-y-4">
          {actions.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm">Buton Adı</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      updateActionItem(item.id, "label", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Link</label>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) =>
                      updateActionItem(item.id, "href", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Stil</label>
                  <select
                    value={item.style}
                    onChange={(e) =>
                      updateActionItem(
                        item.id,
                        "style",
                        e.target.value as "outline" | "highlight"
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  >
                    <option value="outline">Outline</option>
                    <option value="highlight">Highlight</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) =>
                        updateActionItem(item.id, "active", e.target.checked)
                      }
                    />
                    Aktif olsun
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveActions}
              disabled={savingActions}
              className="rounded-xl bg-black px-6 py-3 text-white"
            >
              {savingActions ? "Kaydediliyor..." : "Butonları Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}