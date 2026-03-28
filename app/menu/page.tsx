"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import menuData from "@/data/menu.json";

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

export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <main className="site-shell menu-page">
      <Header />

      <section className="menu-hero">
        <div className="container-main">
          <div className="menu-hero-grid">
            <div className="menu-hero-content">
              <span className="menu-hero-kicker">LOTUS COFFEE HOUSE</span>
              <h1 className="menu-hero-title">Menü</h1>
              <p className="menu-hero-text">
                Lotus Coffee House’ta kahve, tatlı ve huzurlu anlar bir araya gelir.
                Sade, özenli ve keyifli seçimlerle hazırlanan menümüzü keşfedin.
              </p>
            </div>

            <div className="menu-hero-image-box">
              <Image
                src="/images/menu/menu-hero.jpg"
                alt="Lotus Coffee House Menü Hero"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="menu-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="menu-content-section">
        <div className="container-main">
          <div className="menu-sections">
            {menuData.categories.map((group: MenuCategory) => (
              <section key={group.name} className="menu-group">
                <div className="menu-group-head">
                  <h2>{group.name}</h2>
                </div>

                <div className="menu-grid">
                  <article className="menu-category-visual">
                    <Image
                      src={group.image}
                      alt={group.name || "menu görseli"}
                      width={400}
                      height={260}
                      className="menu-category-image"
                    />
                  </article>

                  <article className="menu-card">
                    <ul className="menu-list">
                      {group.items.map((item: MenuItem) => (
                        <li key={item.name} className="menu-item-line">
                          <button
                            type="button"
                            className="menu-item-button"
                            onClick={() => setSelectedItem(item)}
                          >
                            <span className="menu-item-name">{item.name}</span>
                          </button>

                          {item.price ? (
                            <span className="menu-item-price">{item.price}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </section>
            ))}

            {menuData.extras?.length ? (
              <section className="menu-group">
                <div className="menu-group-head">
                  <h2>Ek Seçenekler</h2>
                </div>

                <article className="menu-card menu-extra-card">
                  <ul className="menu-list menu-list-single">
                    {menuData.extras.map((extra: MenuExtra) => (
                      <li key={extra.name} className="menu-item-line">
                        <span className="menu-item-name">{extra.name}</span>
                        <span className="menu-item-price">{extra.price}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </section>
            ) : null}

            {menuData.note ? (
              <section className="menu-note-box">
                <p>{menuData.note}</p>
              </section>
            ) : null}
          </div>
        </div>
      </section>

      {selectedItem ? (
        <div
          className="menu-modal-overlay"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="menu-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="menu-modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Popup kapat"
            >
              ×
            </button>

            <h3 className="menu-modal-title">{selectedItem.name}</h3>

            {selectedItem.price ? (
              <p className="menu-modal-price">{selectedItem.price}</p>
            ) : null}

            <p className="menu-modal-description">
              {selectedItem.description || "Bu ürün için henüz açıklama eklenmedi."}
            </p>
          </div>
        </div>
      ) : null}

      <Footer />
    </main>
  );
}