import Image from "next/image";
import Link from "next/link";

const drinkCategories = [
  {
    title: "Kahveler",
    description: "Espresso bazlı sıcak kahvelerimizi inceleyin.",
    href: "/qrmenu/icecekler/kahveler",
    image: "/uploads/qrmenu/kategori-kahveler.jpg",
  },
  {
    title: "Demleme Kahveler",
    description: "Filtre, V60 ve French Press seçenekleri.",
    href: "/qrmenu/icecekler/demleme-kahveler",
    image: "/uploads/qrmenu/kategori-demleme-kahveler.jpg",
  },
  {
    title: "Sıcak Ritüeller",
    description: "Çay, salep, sıcak çikolata ve özel sıcak içecekler.",
    href: "/qrmenu/icecekler/sicak-ritueller",
    image: "/uploads/qrmenu/kategori-sicak-ritueller.jpg",
  },
  {
    title: "Matcha",
    description: "Modern ve canlı matcha seçenekleri.",
    href: "/qrmenu/icecekler/matcha",
    image: "/uploads/qrmenu/kategori-matcha.jpg",
  },
  {
    title: "Soğuk Kahveler",
    description: "Buz gibi kahve serimizi keşfedin.",
    href: "/qrmenu/icecekler/soguk-kahveler",
    image: "/uploads/qrmenu/kategori-soguk-kahveler.jpg",
  },
  {
    title: "Serinleticiler",
    description: "Limonata ve meyveli ferah içecekler.",
    href: "/qrmenu/icecekler/serinleticiler",
    image: "/uploads/qrmenu/kategori-serinleticiler.jpg",
  },
];

export default function IceceklerPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#1f2f24]">
      {/* HEADER */}
      <section className="bg-[#073c1f] text-white">
        <div className="mx-auto max-w-5xl px-5 py-10 text-center md:px-6 md:py-12">
          <div className="mb-5 flex justify-center">
            <div className="relative h-24 w-24 md:h-28 md:w-28">
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
            Tüm İçecekler
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#d7e4da] md:text-lg">
            Kahveler, demleme seçenekleri, serinleticiler ve özel içeceklerimizi
            kategori kategori inceleyebilirsiniz.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-6">
          <Link
            href="/qrmenu"
            className="inline-flex items-center gap-2 rounded-full border border-[#cfc6b9] bg-white px-4 py-2 text-sm font-medium text-[#073c1f] shadow-sm"
          >
            ← Geri Dön
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {drinkCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group overflow-hidden rounded-[24px] border border-[#ddd5ca] bg-white shadow-[0_10px_26px_rgba(7,60,31,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(7,60,31,0.12)]"
            >
              <div className="relative h-36 w-full bg-[#e9efe6] md:h-44">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                  <h2 className="text-base font-bold text-white md:text-xl">
                    {category.title}
                  </h2>
                </div>
              </div>

              <div className="p-3 md:p-4">
                <p className="text-sm leading-6 text-[#5f6a61] md:text-base">
                  {category.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#073c1f] px-4 py-2 text-xs font-semibold text-white md:text-sm">
                  Kategoriyi Aç
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