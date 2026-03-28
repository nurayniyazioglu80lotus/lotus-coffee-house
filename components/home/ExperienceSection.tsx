import Image from "next/image";
import homeData from "@/data/home.json";

export default function ExperienceSection() {
  const exp = homeData.experience;

  return (
    <section className="experience-section">
      <div className="container-main">
        <div className="experience-grid">
          <div className="experience-image-wrap">
            <Image
              src={exp.image}
              alt="Lotus Coffee House iç mekan detay"
              width={900}
              height={700}
              className="experience-image"
            />
          </div>

          <div className="experience-content">
            <h2 className="section-title-dark">
              {exp.title.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>

            <p className="section-text">
              {exp.paragraph1}
            </p>

            <p className="section-text">
              {exp.paragraph2}
            </p>

            <a href="/about" className="dark-solid-btn">
              {exp.buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}