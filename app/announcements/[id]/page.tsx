import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import announcementsData from "@/data/announcements.json";
import { notFound } from "next/navigation";

type AnnouncementItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  active: boolean;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { id } = await params;

  const item = announcementsData.items.find(
    (a: AnnouncementItem) => a.id === id && a.active
  );

  if (!item) {
    notFound();
  }

  return (
    <main className="site-shell announcement-detail-page">
      <Header />

      <section className="announcement-detail-hero">
        <div className="container-main">
          <div className="announcement-detail-hero-inner">
            <div className="announcement-detail-text">
              <span className="announcement-detail-kicker">
                LOTUS COFFEE HOUSE
              </span>

              <div className="announcement-detail-date">
                {formatDate(item.date)}
              </div>

              <h1 className="announcement-detail-title">{item.title}</h1>

              <p className="announcement-detail-excerpt">
                {item.excerpt}
              </p>
            </div>

            <div className="announcement-detail-image-wrap">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="announcement-detail-image"
                  priority
                />
              ) : (
                <div className="announcement-detail-placeholder">
                  Görsel yok
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="announcement-detail-content">
        <div className="container-main">
          <div className="announcement-detail-body">
            {item.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}