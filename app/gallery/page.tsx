"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import galleryData from "@/data/gallery.json";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  active: boolean;
};

type GalleryData = {
  hero: {
    kicker: string;
    title: string;
    text: string;
  };
  images: GalleryImage[];
};

export default function GalleryPage() {
  const data = galleryData as GalleryData;

  const activeImages = useMemo(() => {
    return (data.images || []).filter((image) => image.active);
  }, [data.images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const safeActiveIndex =
    activeImages.length === 0
      ? 0
      : Math.min(activeIndex, activeImages.length - 1);

  const featuredImage = activeImages[safeActiveIndex];

  const scrollLeft = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <main className="site-shell lotus-gallery-page">
      <Header />

      <section className="lotus-gallery-hero">
        <div className="container-main">
          <div className="lotus-gallery-hero-grid">
            <div className="lotus-gallery-hero-head">
              <span className="lotus-gallery-kicker">
                {data.hero.kicker}
              </span>

              <h1 className="lotus-gallery-title">
                {data.hero.title}
              </h1>

              <p className="lotus-gallery-text">
                {data.hero.text}
              </p>
            </div>

            <div className="lotus-gallery-featured-card">
              {featuredImage ? (
                <Image
                  src={featuredImage.src}
                  alt={featuredImage.alt}
                  width={1600}
                  height={900}
                  priority
                  className="lotus-gallery-featured-image"
                />
              ) : (
                <div className="lotus-gallery-empty">
                  Henüz galeri görseli bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {activeImages.length > 0 ? (
        <section className="lotus-gallery-content-section">
          <div className="container-main">
            <div className="lotus-gallery-slider-wrapper">
              <button
                type="button"
                className="lotus-gallery-arrow lotus-gallery-arrow-left"
                onClick={scrollLeft}
                aria-label="Görselleri sola kaydır"
              >
                ‹
              </button>

              <div className="lotus-gallery-thumbs-track" ref={sliderRef}>
                {activeImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`lotus-gallery-thumb-item ${
                      safeActiveIndex === index ? "is-active" : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveIndex(index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Görseli aç: ${image.alt}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={320}
                      height={180}
                      className="lotus-gallery-thumb-image"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="lotus-gallery-arrow lotus-gallery-arrow-right"
                onClick={scrollRight}
                aria-label="Görselleri sağa kaydır"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}