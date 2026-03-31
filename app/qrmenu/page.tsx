import Image from "next/image";
import Link from "next/link";

const menuCards = [
  {
    title: "İçecekler",
    description: "Kahveler, serinleticiler ve özel içeceklerimizi inceleyin.",
    href: "/qrmenu/icecekler",
    icon: "☕",
  },
  {
    title: "Tatlılar",
    description: "Kahvenize eşlik eden özel tatlı seçeneklerimizi keşfedin.",
    href: "/qrmenu/tatlilar",
    icon: "🍰",
  },
];

export default function QrMenuPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#1f2f24]">
      {/* HEADER */}
      <section className="bg-[#073c1f] text-white">
        <div className="mx-auto max-w-4xl px-5 py-12 text-center md:px-6 md:py-16">
          <div className="mb-6 flex justify-center">
            <div className="relative h-28 w-28 md:h-32 md:w-32">
              <Image
                src="/images/logo/lotus-logo.png"
                alt="Lotus Coffee House"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Hoş Geldiniz
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#d7e4da] md:text-lg">
            Lotus Coffee House QR menüsüne hoş geldiniz. Dilerseniz
            içeceklerimizi, dilerseniz tatlılarımızı inceleyerek menüde keyifli
            bir gezintiye başlayabilirsiniz.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="mx-auto max-w-4xl px-5 py-8 md:px-6 md:py-10">
        <div className="space-y-5">
          {menuCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group block rounded-[28px] border border-[#ddd5ca] bg-white p-6 shadow-[0_12px_30px_rgba(7,60,31,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(7,60,31,0.12)]"
            >
              <div className="flex min-h-[210px] flex-col items-center justify-center text-center md:min-h-[230px]">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#eef5eb] text-4xl shadow-sm">
                  <span aria-hidden="true">{card.icon}</span>
                </div>

                <h2 className="text-3xl font-bold text-[#073c1f]">
                  {card.title}
                </h2>

                <p className="mt-4 max-w-md text-lg leading-7 text-[#667267]">
                  {card.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6b4f3a] px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-[#5c4331]">
                  Menüye Git
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}