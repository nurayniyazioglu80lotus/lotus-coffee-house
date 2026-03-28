import Link from "next/link";
import Image from "next/image";
import featuredProductsData from "@/data/featured-products.json";

type FeaturedProduct = {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  active: boolean;
};

type FeaturedProductsData = {
  sectionTitle: string;
  buttonText: string;
  buttonLink: string;
  items: FeaturedProduct[];
};

export default function FeaturedProducts() {
  const data = featuredProductsData as FeaturedProductsData;

  const activeItems = (data.items || []).filter((item) => item.active);

  if (activeItems.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="container-main">
        <div className="section-heading-center">
          <h2 className="section-title-dark centered">{data.sectionTitle}</h2>
        </div>

        <div className="featured-grid">
          {activeItems.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-image-wrap">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={700}
                  height={500}
                  className="product-image"
                />
              </div>

              <div className="product-meta">
                <div className="product-top">
                  <h3 className="product-title">{product.title}</h3>
                  <span className="product-price">{product.price}</span>
                </div>

                <p className="product-description">{product.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="featured-cta-wrap">
          <Link href={data.buttonLink} className="dark-solid-btn large">
            {data.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}