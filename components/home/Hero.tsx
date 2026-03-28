import Image from "next/image";
import homeData from "@/data/home.json";

export default function Hero() {
  const hero = homeData.hero;

  return (
    <section className="hero-new">
      <Image
        src={hero.image}
        alt="Lotus Coffee House hero görseli"
        fill
        className="hero-bg"
        priority
      />

      <div className="hero-overlay-top" />

      <div className="hero-strip">
        <p>{hero.text}</p>
      </div>
    </section>
  );
}