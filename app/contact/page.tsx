"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import contactData from "@/data/contact.json";

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

export default function ContactPage() {
  const data = contactData as ContactData;

  return (
    <main className="site-shell contact-page">
      <Header />

      <section className="contact-hero">
        <div className="container-main">
          <div className="contact-hero-grid">
            <div className="contact-hero-content">
              <span className="contact-hero-kicker">
                {data.hero.kicker}
              </span>

              <h1 className="contact-hero-title">
                {data.hero.title}
              </h1>

              <p className="contact-hero-text">
                {data.hero.text}
              </p>

              <div className="contact-map-card contact-map-card--hero">
                <a
                  href={data.map.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-link"
                >
                  <Image
                    src={data.map.image}
                    alt="Lotus Coffee House konum"
                    width={1600}
                    height={900}
                    className="contact-map-image"
                  />

                  <div className="contact-map-overlay">
                    <span>Haritada Aç</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <span className="contact-info-label">
                    {data.info.addressLabel}
                  </span>

                  <p>{data.info.address}</p>
                </div>

                <div className="contact-info-item">
                  <span className="contact-info-label">
                    {data.info.phoneLabel}
                  </span>

                  <a href={data.info.phoneHref}>
                    {data.info.phone}
                  </a>
                </div>

                <div className="contact-info-item">
                  <span className="contact-info-label">
                    {data.info.whatsappLabel}
                  </span>

                  <a
                    href={data.info.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.info.whatsappText}
                  </a>
                </div>

                <div className="contact-info-item">
                  <span className="contact-info-label">
                    {data.info.hoursLabel}
                  </span>

                  <p>{data.info.hours}</p>
                </div>

                <div className="contact-info-item contact-instagram-item">
                  <div className="contact-instagram-text">
                    <span className="contact-info-label">
                      {data.info.instagramLabel}
                    </span>

                    <a
                      href={data.info.instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.info.instagramText}
                    </a>
                  </div>

                  <div className="contact-instagram-qr">
                    <Image
                      src={data.info.instagramQr}
                      alt="Instagram QR Kod"
                      width={110}
                      height={110}
                    />
                  </div>
                </div>
              </div>

              <div className="contact-actions">
                <a
                  className="contact-action-btn"
                  href={data.actions.callHref}
                >
                  {data.actions.callText}
                </a>

                <a
                  className="contact-action-btn contact-action-btn--whatsapp"
                  href={data.actions.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.actions.whatsappText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-invite">
        <div className="container-main">
          <div className="contact-invite-box">
            <h2>{data.invite.title}</h2>
            <p>{data.invite.text}</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}