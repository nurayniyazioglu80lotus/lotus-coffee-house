import Link from "next/link";
import Image from "next/image";

import navigationData from "@/data/navigation.json";
import headerActionsData from "@/data/header-actions.json";

type NavItem = {
  id: number;
  label: string;
  href: string;
  active: boolean;
};

type HeaderAction = {
  id: number;
  label: string;
  href: string;
  active: boolean;
  style: "outline" | "highlight";
};

function isExternalLink(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function Header() {
  const navItems = (navigationData as NavItem[]).filter((item) => item.active);
  const actionItems = (headerActionsData as HeaderAction[]).filter(
    (item) => item.active
  );

  return (
    <header className="header-absolute">
      <div className="container-main">
        <div className="header-inner">
          <Link href="/" className="logo-wrap" aria-label="Lotus Coffee House">
            <Image
              src="/images/logo/lotus-logo.png"
              alt="Lotus Coffee House Logo"
              width={72}
              height={72}
              priority
            />

            <div>
              <div className="logo-text-top">LOTUS</div>
              <div className="logo-text-bottom">COFFEE HOUSE</div>
            </div>
          </Link>

          <nav className="nav-center" aria-label="Ana menü">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            {actionItems.map((item) => {
              const className =
                item.style === "highlight" ? "btn-gold" : "btn-soft";

              if (isExternalLink(item.href)) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link key={item.id} href={item.href} className={className}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}