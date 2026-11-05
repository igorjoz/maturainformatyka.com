import BookingCalendar from "./BookingCalendar";
import { type Site, type IntroMeeting } from "./types";

export default function IntroMeeting({
  introMeeting,
  site,
}: {
  introMeeting: IntroMeeting;
  site: Pick<Site, "email" | "phone" | "phoneHref">;
}) {
  return (
    <>
      <section
        className="container section intro-meeting"
        id="spotkanie-zapoznawcze"
        aria-labelledby="booking-title"
      >
        <BookingCalendar introMeeting={introMeeting} site={site} />
      </section>
    </>
  );
}
