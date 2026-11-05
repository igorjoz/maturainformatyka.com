import PortraitScene from "./PortraitScene";
import Arrow from "./Arrow";
import GeometryBackdrop from "./GeometryBackdrop";
import { type Site, type IntroMeeting, type ResponsiveImage } from "./types";
import { useSectionMotion } from "../hooks/useSectionMotion";

export default function Hero({
  site,
  introMeeting,
  portraitImage,
}: {
  site: Pick<Site, "name" | "hero" | "onlinePrice">;
  introMeeting: Pick<IntroMeeting, "duration" | "format" | "costLabel" | "cta">;
  portraitImage: ResponsiveImage;
}) {
  const sectionRef = useSectionMotion<HTMLElement>();
  return (
    <>
      <section
        ref={sectionRef}
        className="hero container geometry-host"
        data-motion
        id="start"
        aria-labelledby="hero-title"
      >
        <GeometryBackdrop variant="hero" />
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true"></span> INDYWIDUALNY
            MENTORING · ONLINE
          </p>
          <h1 id="hero-title">
            {site.hero.heading}
            <br />
            <span>{site.hero.accent}</span>
          </h1>
          <p className="hero-description">{site.hero.description}</p>
          <div className="hero-actions">
            <div className="hero-intro-action">
              <a
                className="button button-primary button-free"
                href="#rezerwacja"
                aria-describedby="intro-hero-note"
              >
                {introMeeting.cta} <Arrow />
              </a>
              <p className="intro-hero-note" id="intro-hero-note">
                {introMeeting.duration} minut · {introMeeting.format} ·{" "}
                <strong>{introMeeting.costLabel}</strong>
              </p>
            </div>
            <a className="text-link" href="#wspolpraca">
              Poznaj sposób pracy <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-facts">
            <span>Online · 1:1</span>
            <span className="regular-price">
              Regularne zajęcia: <strong>{site.onlinePrice} zł</strong> / 60 min
            </span>
          </div>
        </div>
        <PortraitScene site={site} portraitImage={portraitImage} />
      </section>
      <div className="topic-strip">
        <div className="container">
          <span>
            <span className="strip-arrow" aria-hidden="true">
              ↳
            </span>{" "}
            Od zrozumienia do rozwiązania.
          </span>
          <div>
            Python / C++ <span aria-hidden="true">✳</span> Algorytmika{" "}
            <span aria-hidden="true">✳</span> Excel i Access{" "}
            <span aria-hidden="true">✳</span> Zadania CKE
          </div>
        </div>
      </div>
    </>
  );
}
