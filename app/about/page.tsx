"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import aboutData from "@/data/about.json";

type AboutFeatureItem = {
  icon: string;
  title: string;
  text: string;
};

type AboutContent = {
  hero: {
    kicker: string;
    title: string;
    texts: string[];
    images: string[];
  };
  purpose: {
    title: string;
    paragraphs: string[];
  };
  features: {
    title: string;
    description: string;
    items: AboutFeatureItem[];
  };
};

export default function AboutPage() {
  const data = aboutData as AboutContent;
  const aboutImages = data.hero.images || [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!aboutImages.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aboutImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [aboutImages.length]);

  return (
    <main className="site-shell about-page">
      <Header />

      <section className="about-hero">
        <div className="container-main">
          <div className="about-hero-grid">
            <div className="about-hero-content">
              <span className="about-hero-kicker">{data.hero.kicker}</span>

              <h1 className="about-hero-title">{data.hero.title}</h1>

              {data.hero.texts.map((text, index) => (
                <p key={index} className="about-hero-text">
                  {text}
                </p>
              ))}
            </div>

            <div className="about-hero-slider">
              {aboutImages.map((image, index) => (
                <div
                  key={index}
                  className={`about-slide ${
                    index === currentSlide ? "active" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Lotus Coffee House Hakkımızda ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="about-slide-image"
                    priority={index === 0}
                  />
                </div>
              ))}

              {aboutImages.length > 1 ? (
                <div className="about-slider-dots">
                  {aboutImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`about-dot ${
                        index === currentSlide ? "active" : ""
                      }`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Slayt ${index + 1}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="about-purpose-section">
        <div className="container-main">
          <h2 className="about-section-title">{data.purpose.title}</h2>

          <div className="about-purpose-text">
            {data.purpose.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="about-features-section">
        <div className="container-main">
          <div className="about-features-head">
            <h2>{data.features.title}</h2>
            <p>{data.features.description}</p>
          </div>

          <div className="about-features-grid">
            {data.features.items.map((item, index) => (
              <article key={index} className="about-feature-card">
                <div className="about-feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}