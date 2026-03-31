import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Espresso",
    price: "140₺",
    description: "Yoğun aromalı, kısa içimli klasik espresso.",
    image: "/uploads/qrmenu/espresso.jpg",
  },
  {
    name: "Espresso Macchiato",
    price: "150₺",
    description:
      "Espressonun üzerine az miktarda süt köpüğü eklenmiş dengeli içim.",
    image: "/uploads/qrmenu/espresso-macchiato.jpg",
  },
  {
    name: "Americano",
    price: "150₺",
    description:
      "Espressonun sıcak su ile yumuşatılmış, daha uzun içimli hali.",
    image: "/uploads/qrmenu/americano.jpg",
  },
  {
    name: "Cortado",
    price: "160₺",
    description:
      "Espresso ve sütün dengeli birleşimiyle güçlü ama yumuşak içim.",
    image: "/uploads/qrmenu/cortado.jpg",
  },
  {
    name: "Cappuccino / Flat White",
    price: "170₺",
    description:
      "Süt dokusunun öne çıktığı, espresso bazlı yumuşak ve kremamsı içim.",
    image: "/uploads/qrmenu/cappuccino-flat-white.jpg",
  },
  {
    name: "Latte",
    price: "180₺",
    description:
      "Bol süt ve espresso ile hazırlanan yumuşak içimli klasik kahve.",
    image: "/uploads/qrmenu/latte.jpg",
  },
  {
    name: "Caramel Latte",
    price: "190₺",
    description:
      "Karamel aromasıyla zenginleşen tatlı ve yumuşak latte.",
    image: "/uploads/qrmenu/caramel-latte.jpg",
  },
  {
    name: "Mocha",
    price: "190₺",
    description:
      "Çikolata ve kahvenin birlikte öne çıktığı yoğun lezzet.",
    image: "/uploads/qrmenu/mocha.jpg",
  },
  {
    name: "White Mocha",
    price: "190₺",
    description:
      "Beyaz çikolata notalarıyla daha tatlı ve kremamsı mocha.",
    image: "/uploads/qrmenu/white-mocha.jpg",
  },
  {
    name: "Vanilya Latte",
    price: "190₺",
    description:
      "Vanilya aromasıyla yumuşatılmış dengeli latte.",
    image: "/uploads/qrmenu/vanilya-latte.jpg",
  },
  {
    name: "Bal Tarçın Latte",
    price: "190₺",
    description:
      "Bal ve tarçının sıcak aromasıyla öne çıkan özel latte.",
    image: "/uploads/qrmenu/bal-tarcin-latte.jpg",
  },
  {
    name: "Toffeenut Latte",
    price: "195₺",
    description:
      "Fındıksı ve karamelimsi toffee notalarıyla zengin içim.",
    image: "/uploads/qrmenu/toffeenut-latte.jpg",
  },
  {
    name: "Spanish Latte",
    price: "200₺",
    description:
      "Daha tatlı ve yoğun süt dokusuna sahip özel latte yorumu.",
    image: "/uploads/qrmenu/spanish-latte.jpg",
  },
  {
    name: "Nutella Nut Latte",
    price: "200₺",
    description:
      "Fındık ve çikolata aromalarının baskın olduğu tatlı içim latte.",
    image: "/uploads/qrmenu/nutella-nut-latte.jpg",
  },
  {
    name: "Lotus Latte",
    price: "200₺",
    description:
      "Lotus aromasıyla tatlı, bisküvimsi ve karakterli latte.",
    image: "/uploads/qrmenu/lotus-latte.jpg",
  },
];

type Product = {
  name: string;
  price: string;
  description: string;
  image: string;
};

function ProductRow({ item }: { item: Product }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[#ddd5ca] bg-white shadow-[0_10px_28px_rgba(7,60,31,0.08)]">
      <div className="grid grid-cols-[120px_1fr] md:grid-cols-[200px_1fr]">
        <div className="relative min-h-[120px] bg-[#eef3ea] md:min-h-[180px]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-between p-4 md:p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold leading-tight text-[#163622] md:text-2xl">
              {item.name}
            </h3>

            <span className="shrink-0 rounded-full bg-[#eef5eb] px-3 py-1 text-sm font-bold text-[#073c1f] md:text-base">
              {item.price}
            </span>
          </div>

          <p className="text-sm leading-6 text-[#5f6a61] md:text-base md:leading-7">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function KahvelerPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#1f2f24]">
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
            Kahveler
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#d7e4da] md:text-lg">
            Lotus Coffee House’un sıcak kahve seçeneklerini inceleyin.
            Her fincan özenle hazırlanır, aroma ve denge birlikte sunulur.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/qrmenu/icecekler"
            className="inline-flex items-center gap-2 rounded-full border border-[#cfc6b9] bg-white px-4 py-2 text-sm font-medium text-[#073c1f] shadow-sm"
          >
            ← İçeceklere Dön
          </Link>

          <Link
            href="/qrmenu"
            className="inline-flex items-center gap-2 rounded-full border border-[#cfc6b9] bg-white px-4 py-2 text-sm font-medium text-[#073c1f] shadow-sm"
          >
            Ana Menü
          </Link>
        </div>

        <div className="space-y-4">
          {products.map((item) => (
            <ProductRow key={item.name} item={item} />
          ))}
        </div>

<section className="mt-10 rounded-[24px] border border-[#ddd5ca] bg-white p-5 shadow-[0_10px_28px_rgba(7,60,31,0.06)]">
  <h2 className="text-xl font-bold text-[#073c1f]">Ekstra Seçenekler</h2>

  <div className="mt-4 grid gap-3 md:grid-cols-2">
    <div className="rounded-2xl bg-[#f5f8f2] p-4 text-[#445348]">
      <p className="font-semibold">Bitkisel süt</p>
      <p className="mt-1 text-sm">+45₺</p>
    </div>

    <div className="rounded-2xl bg-[#f5f8f2] p-4 text-[#445348]">
      <p className="font-semibold">Laktozsuz süt</p>
      <p className="mt-1 text-sm">+20₺</p>
    </div>
  </div>
</section>

      </section>
    </main>
  );
}