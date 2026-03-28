"use client";

import { useEffect, useState } from "react";

type ContactData = {
  hero: {
    kicker: string;
    title: string;
    text: string;
  };
  map: {
    link: string;
    image: string;
  };
  info: {
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phone: string;
    phoneHref: string;
    whatsappLabel: string;
    whatsappText: string;
    whatsappHref: string;
    hoursLabel: string;
    hours: string;
    instagramLabel: string;
    instagramText: string;
    instagramHref: string;
    instagramQr: string;
  };
  actions: {
    callText: string;
    callHref: string;
    whatsappText: string;
    whatsappHref: string;
  };
  invite: {
    title: string;
    text: string;
  };
};

export default function ContactPanel() {
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingMap, setSavingMap] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingActions, setSavingActions] = useState(false);
  const [savingInvite, setSavingInvite] = useState(false);
  const [error, setError] = useState("");

  const [heroKicker, setHeroKicker] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroText, setHeroText] = useState("");

  const [mapLink, setMapLink] = useState("");
  const [mapImage, setMapImage] = useState("");

  const [addressLabel, setAddressLabel] = useState("");
  const [address, setAddress] = useState("");
  const [phoneLabel, setPhoneLabel] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneHref, setPhoneHref] = useState("");
  const [whatsappLabel, setWhatsappLabel] = useState("");
  const [whatsappText, setWhatsappText] = useState("");
  const [whatsappHref, setWhatsappHref] = useState("");
  const [hoursLabel, setHoursLabel] = useState("");
  const [hours, setHours] = useState("");
  const [instagramLabel, setInstagramLabel] = useState("");
  const [instagramText, setInstagramText] = useState("");
  const [instagramHref, setInstagramHref] = useState("");
  const [instagramQr, setInstagramQr] = useState("");

  const [callText, setCallText] = useState("");
  const [callHref, setCallHref] = useState("");
  const [actionWhatsappText, setActionWhatsappText] = useState("");
  const [actionWhatsappHref, setActionWhatsappHref] = useState("");

  const [inviteTitle, setInviteTitle] = useState("");
  const [inviteText, setInviteText] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/contact", {
        cache: "no-store",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || "İletişim verileri alınamadı.");
        return;
      }

      const data: ContactData = json.data ?? json;

      setHeroKicker(data.hero?.kicker || "");
      setHeroTitle(data.hero?.title || "");
      setHeroText(data.hero?.text || "");

      setMapLink(data.map?.link || "");
      setMapImage(data.map?.image || "");

      setAddressLabel(data.info?.addressLabel || "");
      setAddress(data.info?.address || "");
      setPhoneLabel(data.info?.phoneLabel || "");
      setPhone(data.info?.phone || "");
      setPhoneHref(data.info?.phoneHref || "");
      setWhatsappLabel(data.info?.whatsappLabel || "");
      setWhatsappText(data.info?.whatsappText || "");
      setWhatsappHref(data.info?.whatsappHref || "");
      setHoursLabel(data.info?.hoursLabel || "");
      setHours(data.info?.hours || "");
      setInstagramLabel(data.info?.instagramLabel || "");
      setInstagramText(data.info?.instagramText || "");
      setInstagramHref(data.info?.instagramHref || "");
      setInstagramQr(data.info?.instagramQr || "");

      setCallText(data.actions?.callText || "");
      setCallHref(data.actions?.callHref || "");
      setActionWhatsappText(data.actions?.whatsappText || "");
      setActionWhatsappHref(data.actions?.whatsappHref || "");

      setInviteTitle(data.invite?.title || "");
      setInviteText(data.invite?.text || "");
    } catch {
      setError("İletişim verileri alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveHero() {
    setSavingHero(true);
    try {
      await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hero",
          kicker: heroKicker,
          title: heroTitle,
          text: heroText,
        }),
      });
    } finally {
      setSavingHero(false);
    }
  }

  async function saveMap() {
    setSavingMap(true);
    try {
      await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "map",
          link: mapLink,
          image: mapImage,
        }),
      });
    } finally {
      setSavingMap(false);
    }
  }

  async function saveInfo() {
    setSavingInfo(true);
    try {
      await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "info",
          addressLabel,
          address,
          phoneLabel,
          phone,
          phoneHref,
          whatsappLabel,
          whatsappText,
          whatsappHref,
          hoursLabel,
          hours,
          instagramLabel,
          instagramText,
          instagramHref,
          instagramQr,
        }),
      });
    } finally {
      setSavingInfo(false);
    }
  }

  async function saveActions() {
    setSavingActions(true);
    try {
      await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "actions",
          callText,
          callHref,
          whatsappText: actionWhatsappText,
          whatsappHref: actionWhatsappHref,
        }),
      });
    } finally {
      setSavingActions(false);
    }
  }

  async function saveInvite() {
    setSavingInvite(true);
    try {
      await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "invite",
          title: inviteTitle,
          text: inviteText,
        }),
      });
    } finally {
      setSavingInvite(false);
    }
  }

  if (loading) {
    return <p>İletişim verileri yükleniyor...</p>;
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
        <h2 className="mb-6 text-xl font-semibold">Hero Yönetimi</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={heroKicker}
            onChange={(e) => setHeroKicker(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Kicker"
          />
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Başlık"
          />
          <textarea
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            rows={4}
            placeholder="Hero metni"
          />
          <button
            onClick={saveHero}
            disabled={savingHero}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {savingHero ? "Kaydediliyor..." : "Hero Kaydet"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <h2 className="mb-6 text-xl font-semibold">Harita Yönetimi</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Harita linki"
          />
          <input
            type="text"
            value={mapImage}
            onChange={(e) => setMapImage(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Harita görsel yolu"
          />
          <button
            onClick={saveMap}
            disabled={savingMap}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {savingMap ? "Kaydediliyor..." : "Harita Kaydet"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <h2 className="mb-6 text-xl font-semibold">İletişim Bilgileri</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={addressLabel}
            onChange={(e) => setAddressLabel(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Adres etiketi"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Adres"
          />

          <input
            type="text"
            value={phoneLabel}
            onChange={(e) => setPhoneLabel(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Telefon etiketi"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Telefon"
          />

          <input
            type="text"
            value={phoneHref}
            onChange={(e) => setPhoneHref(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="tel:..."
          />
          <input
            type="text"
            value={whatsappLabel}
            onChange={(e) => setWhatsappLabel(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="WhatsApp etiketi"
          />

          <input
            type="text"
            value={whatsappText}
            onChange={(e) => setWhatsappText(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="WhatsApp metni"
          />
          <input
            type="text"
            value={whatsappHref}
            onChange={(e) => setWhatsappHref(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="WhatsApp linki"
          />

          <input
            type="text"
            value={hoursLabel}
            onChange={(e) => setHoursLabel(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Saat etiketi"
          />
          <input
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Çalışma saatleri"
          />

          <input
            type="text"
            value={instagramLabel}
            onChange={(e) => setInstagramLabel(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Instagram etiketi"
          />
          <input
            type="text"
            value={instagramText}
            onChange={(e) => setInstagramText(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Instagram metni"
          />

          <input
            type="text"
            value={instagramHref}
            onChange={(e) => setInstagramHref(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Instagram linki"
          />
          <input
            type="text"
            value={instagramQr}
            onChange={(e) => setInstagramQr(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Instagram QR görsel yolu"
          />
        </div>

        <div className="mt-5">
          <button
            onClick={saveInfo}
            disabled={savingInfo}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {savingInfo ? "Kaydediliyor..." : "Bilgileri Kaydet"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <h2 className="mb-6 text-xl font-semibold">Aksiyon Butonları</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={callText}
            onChange={(e) => setCallText(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Ara buton metni"
          />
          <input
            type="text"
            value={callHref}
            onChange={(e) => setCallHref(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="Ara linki"
          />
          <input
            type="text"
            value={actionWhatsappText}
            onChange={(e) => setActionWhatsappText(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="WhatsApp buton metni"
          />
          <input
            type="text"
            value={actionWhatsappHref}
            onChange={(e) => setActionWhatsappHref(e.target.value)}
            className="rounded-xl border px-4 py-3"
            placeholder="WhatsApp buton linki"
          />
        </div>

        <div className="mt-5">
          <button
            onClick={saveActions}
            disabled={savingActions}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {savingActions ? "Kaydediliyor..." : "Butonları Kaydet"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <h2 className="mb-6 text-xl font-semibold">Alt Davet Alanı</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={inviteTitle}
            onChange={(e) => setInviteTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Davet başlığı"
          />
          <textarea
            value={inviteText}
            onChange={(e) => setInviteText(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            rows={4}
            placeholder="Davet metni"
          />
          <button
            onClick={saveInvite}
            disabled={savingInvite}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {savingInvite ? "Kaydediliyor..." : "Davet Alanını Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}