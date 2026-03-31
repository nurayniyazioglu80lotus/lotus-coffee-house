import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Filtre Kahve",
    price: "150₺",
    description: "Temiz içimli, dengeli aromalı klasik filtre kahve.",
    image: "/uploads/qrmenu/filtre-kahve.jpg",
  },
  {
    name: "V60",
    price: "180₺",
    description:
      "Özel demleme yöntemiyle daha berrak ve aromatik kahve deneyimi.",
    image: "/uploads/qrmenu/v60.jpg",
  },
  {
    name: "French Press",
    price: "150₺",
    description:
      "Daha gövdeli ve doğal yağları hissedilen demleme kahve.",
    image: "/uploads/qrmenu/french-press.jpg",
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

export default function DemlemeKahvelerPage() {
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
            Demleme Kahveler
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#d7e4da] md:text-lg">
            Filtre kahve, V60 ve French Press seçeneklerimizi inceleyin.
            Berrak, gövdeli ve aromatik kahve deneyimi burada.
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