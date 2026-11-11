import { type Site, type FaqItems } from "./types";

export default function Faq({
  site,
  faqs,
}: {
  site: Pick<Site, "email">;
  faqs: FaqItems;
}) {
  return (
    <>
      <section
        className="section container faq"
        id="faq"
        aria-labelledby="faq-title"
      >
        <div>
          <p className="eyebrow">WARTO WIEDZIEĆ</p>
          <h2 id="faq-title">Zanim zaczniemy.</h2>
          <p>
            Masz inne pytanie?
            <br />
            <a href={`mailto:${site.email}`}>Napisz do mnie.</a>
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <span className="faq-plus" aria-hidden="true"></span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
