import Link from "next/link";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaUtensils,
} from "react-icons/fa";
import homeData from "@/data/home.json";

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

function isExternalLink(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function getFooterIcon(label: string) {
  const lower = label.toLowerCase();

  if (lower.includes("whatsapp")) return <FaWhatsapp />;
  if (lower.includes("yol")) return <FaMapMarkerAlt />;
  if (lower.includes("menü") || lower.includes("menu")) return <FaUtensils />;

  return <FaUtensils />;
}

export default function Footer() {
  const data = homeData as HomeData;
  const footer = data.footer;

  const activeActions = (footer.actions || []).filter((item) => item.active);

  return (
    <footer className="site-footer">
      <div className="container-main footer-inner">
        <div className="footer-brand">
          <h3>{footer.brandTitle}</h3>
          <p>{footer.text}</p>
        </div>

        <div className="footer-actions">
          {activeActions.map((item) => {
            const className =
              item.style === "gold"
                ? "footer-btn footer-btn-gold"
                : "footer-btn footer-btn-soft";

            const content = (
              <>
                {getFooterIcon(item.label)}
                <span>{item.label}</span>
              </>
            );

            if (isExternalLink(item.href)) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.id} href={item.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>

        <div className="footer-copy">
          <span>{footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}