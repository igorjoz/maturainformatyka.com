import Arrow from "./Arrow";
import OrbitAccent from "./OrbitAccent";
import GeometryBackdrop from "./GeometryBackdrop";
import ContactCelebration from "./ContactCelebration";
import { type Site, type IntroMeeting } from "./types";
import { useSectionMotion } from "../hooks/useSectionMotion";

export default function Contact({
  site,
  introMeeting,
}: {
  site: Pick<Site, "email" | "phone" | "phoneHref" | "listing">;
  introMeeting: Pick<IntroMeeting, "duration" | "format" | "costLabel" | "cta">;
}) {
  const sectionRef = useSectionMotion<HTMLElement>({ celebrate: true });
  return (
    <>
      <section
        ref={sectionRef}
        className="contact-section geometry-host"
        data-motion
        id="kontakt"
        aria-labelledby="contact-title"
      >
        <OrbitAccent />
        <GeometryBackdrop variant="copper" />
        <div className="container contact">
          <div>
            <p className="eyebrow">08 / TWÓJ NASTĘPNY KROK</p>
            <h2 id="contact-title">
              Twój plan na maturę
              <br /> zaczyna się od rozmowy.
            </h2>
            <p className="contact-invitation">
              Masz pytanie? Jestem po drugiej stronie.
            </p>
            <p>
              Napisz, kiedy zdajesz maturę i co sprawia Ci trudność. Wspólnie
              ustalimy, od czego zacząć.
            </p>
          </div>
          <div className="contact-links">
            <a className="contact-email" href={`mailto:${site.email}`}>
              <span>NAPISZ DO MNIE</span>
              <strong>{site.email}</strong>
              <Arrow diagonal />
            </a>
            <a className="contact-phone" href={`tel:${site.phoneHref}`}>
              <span>LUB ZADZWOŃ</span>
              <strong>{site.phone}</strong>
              <Arrow diagonal />
            </a>
            <a className="listing-link" href={site.listing}>
              Zobacz ofertę i opinie na e-korepetycje.net <Arrow diagonal />
            </a>
          </div>
          <div className="contact-booking">
            <div>
              <span className="booking-eyebrow">TWÓJ PIERWSZY KROK</span>
              <p>
                {introMeeting.duration} minut · {introMeeting.format} ·{" "}
                <strong>{introMeeting.costLabel}</strong>
              </p>
            </div>
            <a
              className="button button-primary button-free contact-booking-button"
              href="#rezerwacja"
            >
              {introMeeting.cta} <Arrow />
            </a>
          </div>
        </div>
        <ContactCelebration />
      </section>
    </>
  );
}
