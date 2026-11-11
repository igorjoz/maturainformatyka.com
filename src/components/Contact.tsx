import type { Ref } from "react";
import Arrow from "./Arrow";
import OrbitAccent from "./OrbitAccent";
import GeometryBackdrop from "./GeometryBackdrop";
import ContactCelebration from "./ContactCelebration";
import { type Site, type IntroMeeting } from "./types";
import { useSectionMotion } from "../hooks/useSectionMotion";

interface ContactProps {
  site: Pick<Site, "email" | "phone" | "phoneHref" | "listing">;
  introMeeting: Pick<IntroMeeting, "duration" | "format" | "costLabel" | "cta">;
}
export default function Contact(props: ContactProps & { materials?: boolean; author?: string }) {
  const sectionRef = useSectionMotion<HTMLElement>();
  return <ContactPanel {...props} sectionRef={sectionRef} />;
}

/** Shared server-renderable presentation; materials pages need no client island. */
export function ContactPanel({ site, introMeeting, materials = false, author, sectionRef }: ContactProps & { materials?: boolean; author?: string; sectionRef?: Ref<HTMLElement> }) {
  const titleId = materials ? "materials-contact-title" : "contact-title";
  return (
    <>
      <section
        ref={sectionRef}
        className={`contact-section geometry-host${materials ? " materials-invitation" : ""}`}
        data-motion={!materials ? true : undefined}
        data-materials-invitation={materials ? "" : undefined}
        id={materials ? "korepetycje-materialy" : "kontakt"}
        aria-labelledby={titleId}
      >
        {!materials && <><OrbitAccent /><GeometryBackdrop variant="copper" /></>}
        <div className="container contact">
          <div>
            <p className="eyebrow">TWÓJ NASTĘPNY KROK</p>
            <h2 id={titleId}>{materials ? "Przygotuj się do matury z informatyki ze mną." : <>Twój plan na maturę<br /> zaczyna się od rozmowy.</>}</h2>
            <p className="contact-invitation">
              {materials ? `${author} — korepetycje z informatyki do matury` : "Masz pytanie? Jestem po drugiej stronie."}
            </p>
            <p>
              {materials ? "Na indywidualnych zajęciach online uporządkujemy trudne zagadnienia i przećwiczymy zadania maturalne. Wspólnie ustalimy plan przygotowań dopasowany do Twojego poziomu i celu." : "Napisz, kiedy zdajesz maturę i co sprawia Ci trudność. Wspólnie ustalimy, od czego zacząć."}
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
            <a className="listing-link" href={materials ? "/#oferta" : site.listing}>
              {materials ? "Zobacz ofertę korepetycji i cenę" : "Zobacz ofertę i opinie na e-korepetycje.net"} <Arrow diagonal />
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
              href={materials ? "/#rezerwacja" : "#rezerwacja"}
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
