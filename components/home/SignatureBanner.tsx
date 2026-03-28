import Image from "next/image";
import homeData from "@/data/home.json";

export default function SignatureBanner() {
  const sign = homeData.signature;

  return (
    <section className="signature-section">
      <div className="signature-bg">
        <Image
          src={sign.image}
          alt="Lotus Coffee House imza alanı"
          fill
          className="signature-image"
        />
        <div className="signature-overlay" />
      </div>

      <div className="container-main signature-content-wrap">
        <div className="signature-grid">
          <div className="signature-content">
            <h2 className="signature-title">
              {sign.title.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>

            <p className="signature-text">
              {sign.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}