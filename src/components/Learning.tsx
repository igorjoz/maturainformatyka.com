import Arrow from "./Arrow";
import { css, type Site } from "./types";
import { useSectionMotion } from "../hooks/useSectionMotion";

export default function Learning({ site }: { site: Pick<Site, "steps"> }) {
  const sectionRef = useSectionMotion<HTMLElement>();
  return (
    <>
      <section
        ref={sectionRef}
        className="section container learning"
        data-motion
        id="wspolpraca"
        aria-labelledby="process-title"
      >
        <div className="section-heading">
          <p className="eyebrow">01 / TWOJA ŚCIEŻKA</p>
          <div>
            <h2 id="process-title">
              Dobry wynik zaczyna się
              <br />
              od dobrego planu.
            </h2>
            <p>
              Nie musisz wiedzieć wszystkiego na starcie. Ważne, żeby wiedzieć,
              jaki zrobić następny krok.
            </p>
          </div>
        </div>
        <div className="steps" data-process>
          <span className="process-line" aria-hidden="true"></span>
          {site.steps.map((step, index) => (
            <article
              key={step.title}
              className="step"
              data-reveal
              style={css({ "--reveal-delay": `${index * 120}ms` })}
            >
              <div className="step-top">
                <span className="step-number">0{index + 1}</span>
                <span className="step-tag">{step.tag}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="learning-note">
          <p>
            <strong>A między spotkaniami?</strong> Podsumowania, materiały i
            konkretne wskazówki do samodzielnej nauki.
          </p>
          <a className="text-link" href="#przyklad">
            Zobacz przykład <Arrow />
          </a>
        </div>
      </section>
    </>
  );
}
