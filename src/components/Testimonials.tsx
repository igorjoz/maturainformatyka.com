import Arrow from "./Arrow";
import { css, type Site, type Reviews } from "./types";
import { useSectionMotion } from "../hooks/useSectionMotion";

export default function Testimonials({
  site,
  testimonials,
}: {
  site: Pick<Site, "listing">;
  testimonials: Reviews;
}) {
  const sectionRef = useSectionMotion<HTMLElement>();
  return (
    <>
      <section
        ref={sectionRef}
        className="section container testimonials"
        data-motion
        id="opinie"
        aria-labelledby="testimonials-title"
      >
        <div className="section-heading">
          <p className="eyebrow">OPINIE UCZNIÓW</p>
          <div>
            <h2 id="testimonials-title">Tak wspominają wspólną naukę.</h2>
            <p>Opinie opublikowane na e-korepetycje.net.</p>
          </div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((review, index) => (
            <figure
              key={review.name}
              className={`testimonial-card${index === 1 ? " testimonial-featured" : ""}`}
              data-reveal
              data-card
              style={css({ "--reveal-delay": `${index * 90}ms` })}
            >
              <span
                className="testimonial-stars"
                role="img"
                aria-label={`Ocena: ${review.rating} na 5`}
              >
                {"★".repeat(review.rating)}
              </span>
              <blockquote>
                <p>{review.quote}</p>
              </blockquote>
              <figcaption>
                <strong>{review.name}</strong>
                <time dateTime={review.date}>{review.dateLabel}</time>
              </figcaption>
            </figure>
          ))}
        </div>
        <a
          className="text-link testimonials-source"
          href={site.listing}
          target="_blank"
          rel="noopener noreferrer"
        >
          Zobacz opinie na e-korepetycje.net <Arrow diagonal />
        </a>
      </section>
    </>
  );
}
