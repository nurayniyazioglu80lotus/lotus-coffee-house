import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import announcementsData from "@/data/announcements.json";

type AnnouncementItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  active: boolean;
};

type AnnouncementsData = {
  hero: {
    kicker: string;
    title: string;
    description: string;
  };
  items: AnnouncementItem[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function AnnouncementsPage() {
  const data = announcementsData as AnnouncementsData;

  const activeItems = [...data.items]
    .filter((item) => item.active)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <main className="site-shell announcements-page">
      <Header />

      <section className="announcements-hero">
        <div className="container-main">
          <div className="announcements-hero-content">
            <span className="announcements-hero-kicker">
              {data.hero.kicker}
            </span>

            <h1 className="announcements-hero-title">
              {data.hero.title}
            </h1>

            <p className="announcements-hero-text">
              {data.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="announcements-list-section">
        <div className="container-main">
          {activeItems.length === 0 ? (
            <div className="announcements-empty">
              <h2>Henüz duyuru bulunmuyor</h2>
              <p>Yeni gelişmeler ve etkinlikler yakında burada paylaşılacak.</p>
            </div>
          ) : (
            <div className="announcements-grid">
              {activeItems.map((item) => (
                <article key={item.id} className="announcement-card">
                  <div className="announcement-card-image-wrap">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="announcement-card-image"
                      />
                    ) : (
                      <div className="announcement-card-placeholder">
                        Görsel yok
                      </div>
                    )}
                  </div>

                  <div className="announcement-card-body">
                    <div className="announcement-card-date">
                      {formatDate(item.date)}
                    </div>

                    <h2 className="announcement-card-title">
                      {item.title}
                    </h2>

                    <p className="announcement-card-excerpt">
                      {item.excerpt}
                    </p>

                    <div className="announcement-card-footer">
                      <Link
                        href={`/announcements/${item.id}`}
                        className="announcement-card-link"
                      >
                        Detayı Gör
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}