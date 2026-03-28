"use client";

import { useMemo, useState } from "react";
import AdminUploadPanel from "./upload-panel";
import AdminMenuPanel from "./menu-panel";
import AdminAnnouncementsPanel from "./announcements-panel";
import AdminFeaturedProductsPanel from "./featured-products-panel";
import HomeHeroPanel from "./home-hero-panel";
import HomeExperiencePanel from "./home-experience-panel";
import HomeSignaturePanel from "./home-signature-panel";
import HomeHeaderPanel from "./home-header-panel";
import HomeFooterPanel from "./home-footer-panel";
import AboutPanel from "./about-panel";
import ContactPanel from "./contact-panel";
import GalleryPanel from "./gallery-panel";

type SectionKey =
  | "home"
  | "menu"
  | "about"
  | "gallery"
  | "announcements"
  | "contact";

type HomeTabKey =
  | "header"
  | "hero"
  | "experience"
  | "featured"
  | "signature"
  | "footer";

const sections: {
  key: SectionKey;
  title: string;
  description: string;
}[] = [
  {
    key: "home",
    title: "Ana Sayfa",
    description: "Header, hero, deneyim alanı, öne çıkan lezzetler, banner, footer",
  },
  {
    key: "menu",
    title: "Menü",
    description: "Menü içerikleri, fiyatlar, ürünler ve menü görselleri",
  },
  {
    key: "about",
    title: "Hakkımızda",
    description: "Hero slider, metinler, amacımız ve alt kartlar",
  },
  {
    key: "gallery",
    title: "Galeri",
    description: "Galeri görselleri ve galeri sayfası düzeni",
  },
  {
    key: "announcements",
    title: "Duyurular",
    description: "Duyuru kartları, detaylar ve duyuru görselleri",
  },
  {
    key: "contact",
    title: "İletişim",
    description: "Adres, telefon, sosyal medya, harita ve iletişim alanları",
  },
];

const homeTabs: {
  key: HomeTabKey;
  title: string;
}[] = [
  { key: "header", title: "Header" },
  { key: "hero", title: "Hero" },
  { key: "experience", title: "Deneyim Alanı" },
  { key: "featured", title: "Öne Çıkan Lezzetler" },
  { key: "signature", title: "Signature Banner" },
  { key: "footer", title: "Footer" },
];

export default function AdminDashboardShell() {
  const [activeSection, setActiveSection] = useState<SectionKey>("home");
  const [activeHomeTab, setActiveHomeTab] = useState<HomeTabKey>("hero");

  const activeTitle = useMemo(() => {
    return sections.find((item) => item.key === activeSection)?.title || "";
  }, [activeSection]);

  return (
    <main className="min-h-screen bg-[#f7f3ee] p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-md">
          <h1 className="mb-3 text-3xl font-semibold">Admin Panel</h1>
          <p className="mb-8 text-neutral-600">
            Bölüm seçerek ilgili sayfanın içerik ve görsel yönetimini kendi alanı
            içinde yapabilirsin.
          </p>

          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const isActive = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    isActive
                      ? "border-[#073c1f] bg-[#eef4ef] shadow-sm"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <h2 className="mb-2 text-lg font-semibold">{section.title}</h2>
                  <p className="text-sm text-neutral-600">
                    {section.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mb-6 rounded-2xl border border-neutral-200 bg-[#faf8f5] p-5">
            <h2 className="text-xl font-semibold">{activeTitle}</h2>
          </div>

          {activeSection === "home" ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {homeTabs.map((tab) => {
                  const isActive = activeHomeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveHomeTab(tab.key)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-[#073c1f] bg-[#073c1f] text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      {tab.title}
                    </button>
                  );
                })}
              </div>

              {activeHomeTab === "header" ? <HomeHeaderPanel /> : null}

              {activeHomeTab === "hero" ? <HomeHeroPanel /> : null}

              {activeHomeTab === "experience" ? (
                <HomeExperiencePanel />
              ) : null}

              {activeHomeTab === "featured" ? (
                <AdminFeaturedProductsPanel />
              ) : null}

              {activeHomeTab === "signature" ? <HomeSignaturePanel /> : null}

              {activeHomeTab === "footer" ? <HomeFooterPanel /> : null}
            </div>
          ) : null}

          {activeSection === "menu" ? (
            <div className="space-y-6">
              <AdminMenuPanel />
            </div>
          ) : null}

          {activeSection === "about" ? <AboutPanel /> : null}

          {activeSection === "gallery" ? <GalleryPanel /> : null}

          {activeSection === "announcements" ? (
            <div className="space-y-6">
              <AdminAnnouncementsPanel />
            </div>
          ) : null}

          {activeSection === "contact" ? <ContactPanel /> : null}

          <form action="/api/admin/logout" method="post" className="mt-8">
            <button className="rounded-xl border border-black px-5 py-3 font-medium transition hover:bg-black hover:text-white">
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}