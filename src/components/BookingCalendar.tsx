import Arrow from "./Arrow";
import { type Site, type IntroMeeting } from "./types";

export default function BookingCalendar({
  introMeeting,
  site,
}: {
  introMeeting: IntroMeeting;
  site: Pick<Site, "email" | "phone" | "phoneHref">;
}) {
  const bookingUrl = introMeeting.bookingUrl.trim();
  let embedUrl: URL | undefined;

  if (bookingUrl) {
    embedUrl = new URL(bookingUrl);
    if (
      embedUrl.protocol !== "https:" ||
      embedUrl.hostname !== "calendar.google.com" ||
      !embedUrl.pathname.includes("/appointments/schedules/")
    ) {
      throw new Error(
        "introMeeting.bookingUrl must contain the complete calendar.google.com URL from the booking-page iframe src attribute.",
      );
    }
    embedUrl.searchParams.set("gv", "true");
    embedUrl.searchParams.set("hl", "pl");
  }

  const emailHref = `mailto:${site.email}?subject=${encodeURIComponent("Bezpłatne spotkanie zapoznawcze — matura z informatyki")}&body=${encodeURIComponent(`Cześć Igor!\n\nChcę umówić bezpłatne, ${introMeeting.duration}-minutowe spotkanie online.\n\nRok, w którym zdaję maturę: \nMój poziom: \nMój cel: \nDogodne terminy: \n`)}`;
  return (
    <>
      <section
        className="booking-calendar"
        id="rezerwacja"
        aria-labelledby="booking-title"
      >
        <div className="booking-overview">
          <div className="booking-calendar-heading">
            <p className="eyebrow">
              POZNAJMY SIĘ · {introMeeting.costLabel.toUpperCase()}
            </p>
            <h2 id="booking-title">
              {embedUrl ? "Zacznijmy od rozmowy." : "Umówmy się na rozmowę."}
            </h2>
            <p className="booking-duration">
              {introMeeting.duration} minut · {introMeeting.format}
              {embedUrl ? " · Google Meet" : ""}
            </p>
            <p>
              {embedUrl
                ? "Wybierz dzień i godzinę w kalendarzu poniżej. Potwierdzenie rezerwacji i link do Google Meet otrzymasz e-mailem."
                : "Napisz, jakie terminy Ci odpowiadają. Wspólnie wybierzemy czas na bezpłatne spotkanie zapoznawcze."}
            </p>
          </div>
          <div
            className="booking-agenda"
            aria-labelledby="booking-agenda-title"
          >
            <h3 id="booking-agenda-title">Jak wygląda nasza rozmowa?</h3>
            <ol>
              {introMeeting.agenda.map((step, index) => (
                <li key={step.title}>
                  <span className="booking-agenda-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="booking-practical" aria-label="Przed spotkaniem">
          {introMeeting.practicalQuestions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        {embedUrl ? (
          <>
            <div className="booking-calendar-frame">
              <iframe
                src={embedUrl.href}
                title={`Rezerwacja bezpłatnego, ${introMeeting.duration}-minutowego spotkania zapoznawczego z Igorem Józefowiczem`}
                width="100%"
                height="800"
                loading="lazy"
              ></iframe>
            </div>
            <div className="booking-calendar-alternatives">
              <a
                className="text-link"
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Otwórz rezerwację w Google <Arrow diagonal />
              </a>
              <p>
                Nie widzisz dogodnego terminu?{" "}
                <a href={emailHref}>Napisz do mnie</a> lub{" "}
                <a href={`tel:${site.phoneHref}`}>zadzwoń</a>.
              </p>
            </div>
          </>
        ) : (
          <div className="booking-calendar-alternatives">
            <a className="button button-primary button-free" href={emailHref}>
              Zaproponuj termin e-mailem <Arrow />
            </a>
            <p>
              Możesz też zadzwonić:{" "}
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
