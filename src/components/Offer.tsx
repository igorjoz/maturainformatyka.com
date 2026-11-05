import Arrow from "./Arrow";
import GeometryBackdrop from "./GeometryBackdrop";
import { css, type Site, type IntroMeeting } from "./types";
import { useSectionMotion } from "../hooks/useSectionMotion";

export default function Offer({
  site,
  introMeeting,
}: {
  site: Pick<Site, "onlinePrice" | "benefits" | "durations">;
  introMeeting: Pick<IntroMeeting, "duration" | "cta">;
}) {
  const sectionRef = useSectionMotion<HTMLElement>();
  return (
    <>
      <section
        ref={sectionRef}
        className="offer-section geometry-host"
        data-motion
        id="oferta"
        aria-labelledby="offer-title"
      >
        <GeometryBackdrop variant="light" />
        <div className="container offer">
          <div className="offer-copy" data-reveal>
            <p className="eyebrow">06 / TWOJE PRZYGOTOWANIE</p>
            <h2 id="offer-title">
              Twój cel.
              <br />
              Wspólny plan.
              <br />
              <span>Pełna uwaga.</span>
            </h2>
            <p>
              Na zajęciach 1:1 jest przestrzeń na Twoje pytania, Twoje tempo i
              zadania, które naprawdę wymagają przećwiczenia.
            </p>
            <div className="offer-format">
              <span>Online</span>
              <span>Indywidualnie</span>
              <span>Terminy do uzgodnienia</span>
            </div>
          </div>
          <div className="price-card" data-reveal>
            <span className="price-label">INDYWIDUALNE ZAJĘCIA ONLINE</span>
            <p className="price">
              <strong>
                {site.onlinePrice}
                <span> zł</span>
              </strong>
              <span>/ 60 minut</span>
            </p>
            <ul>
              {site.benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  data-reveal
                  style={css({ "--reveal-delay": `${index * 90 + 100}ms` })}
                >
                  <span aria-hidden="true">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
            <a className="button button-primary button-free" href="#rezerwacja">
              {introMeeting.cta} <Arrow />
            </a>
            <p className="price-footnote">
              Najpierw {introMeeting.duration} minut bezpłatnej rozmowy.
              <br />
              Regularne spotkania: {site.durations.join(" / ")} min.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
