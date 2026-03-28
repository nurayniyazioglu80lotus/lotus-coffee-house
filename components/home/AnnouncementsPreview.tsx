import Link from "next/link";
import Image from "next/image";
import announcementsData from "@/data/announcements.json";

type AnnouncementItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
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
    month: "short",
  }).format(date);
}

export default function AnnouncementsPreview() {
  const data = announcementsData as AnnouncementsData;

  const items = [...(data.items || [])]
    .filter((item) => item.active)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="home-announcements-section">
      <div className="container-main">
        <div className="home-announcements-header">
          <div>
            <span className="home-announcements-kicker">
              LOTUS COFFEE HOUSE
            </span>

            <h2 className="home-announcements-title">
              Son Duyurular
            </h2>
          </div>

          <Link
            href="/announcements"
            className="home-announcements-all-link"
          >
            Tüm Duyurular →
          </Link>
        </div>

        <div className="home-announcements-grid">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/announcements/${item.id}`}
              className="home-announcement-card"
            >
              <div className="home-announcement-image-wrap">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="home-announcement-image"
                  />
                ) : (
                  <div className="home-announcement-placeholder">
                    Görsel yok
                  </div>
                )}
              </div>

              <div className="home-announcement-body">
                <div className="home-announcement-date">
                  {formatDate(item.date)}
                </div>

                <h3 className="home-announcement-card-title">
                  {item.title}
                </h3>

                <p className="home-announcement-excerpt">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}