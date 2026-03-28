"use client";

import { useEffect, useState } from "react";

type FooterAction = {
  id: number;
  label: string;
  href: string;
  style: "soft" | "gold";
  active: boolean;
};

type HomeData = {
  footer: {
    brandTitle: string;
    text: string;
    actions: FooterAction[];
    copyright: string;
  };
};

export default function HomeFooterPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [brandTitle, setBrandTitle] = useState("");
  const [text, setText] = useState("");
  const [copyright, setCopyright] = useState("");
  const [actions, setActions] = useState<FooterAction[]>([]);

  async function loadData() {
    const res = await fetch("/api/admin/home");
    const data: HomeData = await res.json();

    setBrandTitle(data.footer.brandTitle || "");
    setText(data.footer.text || "");
    setCopyright(data.footer.copyright || "");
    setActions(data.footer.actions || []);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateAction(
    id: number,
    field: keyof FooterAction,
    value: string | boolean
  ) {
    setActions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  async function handleSave() {
    setSaving(true);

    await fetch("/api/admin/home", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "footer",
        brandTitle,
        text,
        actions,
        copyright,
      }),
    });

    setSaving(false);
    alert("Footer alanı güncellendi.");
  }

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="rounded-2xl border bg-white p-8">
      <h2 className="mb-6 text-xl font-semibold">Footer Yönetimi</h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block">Başlık</label>
          <input
            type="text"
            value={brandTitle}
            onChange={(e) => setBrandTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
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
          <label className="mb-3 block font-medium">Footer Butonları</label>

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
                        updateAction(item.id, "label", e.target.value)
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
                        updateAction(item.id, "href", e.target.value)
                      }
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Stil</label>
                    <select
                      value={item.style}
                      onChange={(e) =>
                        updateAction(
                          item.id,
                          "style",
                          e.target.value as "soft" | "gold"
                        )
                      }
                      className="w-full rounded-xl border px-4 py-3"
                    >
                      <option value="soft">Soft</option>
                      <option value="gold">Gold</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) =>
                          updateAction(item.id, "active", e.target.checked)
                        }
                      />
                      Aktif olsun
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block">Copyright</label>
          <input
            type="text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />
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