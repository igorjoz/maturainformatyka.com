import { useEffect, useRef, useState } from "react";
import { css, type Site, type SubjectGroup, type MaturaExample } from "./types";
import ResponsivePicture from "./ResponsivePicture";
import { useHydrated } from "../hooks/useHydrated";
import { useSectionMotion } from "../hooks/useSectionMotion";

const illustrationSpots: Record<
  string,
  { x: number; y: number; label: string }
> = {
  programowanie: { x: 46, y: 42, label: "Python / C++" },
  algorytmika: { x: 79, y: 65, label: "Algorytmika" },
  excel: { x: 72, y: 34, label: "Excel" },
  access: { x: 24, y: 51, label: "SQL / Access" },
};

function SubjectCard({ group }: { group: SubjectGroup }) {
  const hydrated = useHydrated();
  const [selected, setSelected] = useState(0);
  const [revealTarget, setRevealTarget] = useState<{ index: number } | null>(
    null,
  );
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const art = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!revealTarget) return;
    const panel = panels.current[revealTarget.index];
    const illustration = art.current;
    if (!panel || !illustration) return;
    // Wait for React to expose the selected panel before moving focus out of the image.
    panel.focus({ preventScroll: true });
    const origin = scrollY;
    const initialImageTop = illustration.getBoundingClientRect().top + origin;
    const started = performance.now();
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 420;
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      illustration.removeAttribute("data-revealing");
    };
    const animate = (now: number) => {
      const bounds = (panel.parentElement ?? panel).getBoundingClientRect();
      const image = illustration.getBoundingClientRect();
      const imageTop = image.top + scrollY;
      // Track layout shifts above the card during this short animation, without
      // observing the entire page or realigning it after the interaction ends.
      const from = origin + imageTop - initialImageTop;
      const headerBottom =
        document.querySelector(".site-header")?.getBoundingClientRect()
          .bottom ?? 0;
      const target = Math.min(
        Math.max(from, bounds.bottom + scrollY - innerHeight + 20),
        image.bottom + scrollY - headerBottom - 16 - Math.min(96, image.height),
      );
      const progress = duration ? Math.min(1, (now - started) / duration) : 1;
      window.scrollTo({
        top: Math.max(0, from + (target - from) * (1 - (1 - progress) ** 3)),
        behavior: "instant",
      });
      if (progress < 1) frame = requestAnimationFrame(animate);
      else stop();
    };
    illustration.setAttribute("data-revealing", "");
    frame = requestAnimationFrame(animate);
    const actions = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    for (const event of actions)
      window.addEventListener(event, stop, { passive: true });
    return () => {
      stop();
      for (const event of actions) window.removeEventListener(event, stop);
    };
  }, [revealTarget]);

  return (
    <article
      className={`subject-group${hydrated ? " subjects-enhanced" : ""}`}
      data-subject-group
      data-reveal
    >
      <div className="subject-group-intro">
        <span className="subject-index">{group.number} / OBSZAR NAUKI</span>
        <h3 id={`subject-group-${group.number}`}>{group.title}</h3>
        <p>{group.description}</p>
      </div>
      <div
        ref={art}
        className="subject-art"
        data-card
        data-active-topic={group.subjects[selected].id}
      >
        <ResponsivePicture image={group.image} />
        <div
          className="subject-art-spots"
          role="group"
          aria-label={`Tematy na ilustracji: ${group.title}`}
          hidden={!hydrated}
        >
          {group.subjects.map((subject, index) => {
            const spot = illustrationSpots[subject.id];
            if (!spot) return null;
            return (
              <button
                key={subject.id}
                type="button"
                className="subject-art-spot"
                style={css({
                  "--spot-x": `${spot.x}%`,
                  "--spot-y": `${spot.y}%`,
                })}
                aria-label={`Poznaj temat: ${subject.title}`}
                aria-pressed={selected === index}
                aria-controls={`subject-panel-${subject.id}`}
                onClick={() => {
                  setSelected(index);
                  // A new request also reveals a topic that was already selected.
                  setRevealTarget({ index });
                }}
              >
                <span className="subject-art-dot" aria-hidden="true">
                  +
                </span>
                <span className="subject-art-label">{spot.label}</span>
              </button>
            );
          })}
          <span className="subject-art-invitation" aria-hidden="true">
            Wybierz punkt i odkryj temat <span>↗</span>
          </span>
        </div>
      </div>
      <div className="subject-group-copy">
        <div
          className="subject-tabs"
          data-subject-tabs
          hidden={!hydrated}
          role={hydrated ? "tablist" : undefined}
          aria-labelledby={`subject-group-${group.number}`}
        >
          {group.subjects.map((subject, index) => (
            <button
              key={subject.id}
              type="button"
              ref={(element) => {
                tabs.current[index] = element;
              }}
              id={`subject-tab-${subject.id}`}
              data-subject-target={subject.id}
              role="tab"
              aria-controls={`subject-panel-${subject.id}`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => {
                let next: number;
                switch (event.key) {
                  case "ArrowRight":
                    next = (index + 1) % group.subjects.length;
                    break;
                  case "ArrowLeft":
                    next =
                      (index - 1 + group.subjects.length) %
                      group.subjects.length;
                    break;
                  case "Home":
                    next = 0;
                    break;
                  case "End":
                    next = group.subjects.length - 1;
                    break;
                  default:
                    return;
                }
                event.preventDefault();
                setSelected(next);
                tabs.current[next]?.focus({ preventScroll: true });
              }}
            >
              {subject.title}
            </button>
          ))}
        </div>
        <div className="subject-panels">
          {group.subjects.map((subject, index) => (
            <section
              key={subject.id}
              ref={(element) => {
                panels.current[index] = element;
              }}
              className="subject-panel"
              id={`subject-panel-${subject.id}`}
              data-subject-panel={subject.id}
              role={hydrated ? "tabpanel" : undefined}
              aria-labelledby={
                hydrated
                  ? `subject-tab-${subject.id}`
                  : `subject-heading-${subject.id}`
              }
              aria-hidden={hydrated ? selected !== index : undefined}
              inert={hydrated && selected !== index ? true : undefined}
              tabIndex={hydrated ? (selected === index ? 0 : -1) : undefined}
            >
              <h4 id={`subject-heading-${subject.id}`}>{subject.title}</h4>
              <p className="subject-skill">{subject.text}</p>
              <p className="subject-example-label">Przykładowe polecenie</p>
              <p className="subject-example-task">{subject.example}</p>
              {subject.lessonHref && (
                <a href={subject.lessonHref}>Zobacz przykład lekcji →</a>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Subjects({
  site,
  groups,
  maturaExample,
}: {
  site: Pick<Site, "subjects">;
  groups: SubjectGroup[];
  maturaExample: MaturaExample;
}) {
  const sectionRef = useSectionMotion<HTMLElement>();
  return (
    <section
      ref={sectionRef}
      className="section container subjects-section"
      data-motion
      id="zakres"
      aria-labelledby="subjects-title"
    >
      <div className="section-heading">
        <p className="eyebrow">03 / ZAKRES PRZYGOTOWANIA</p>
        <div>
          <h2 id="subjects-title">
            Łączysz wiedzę.
            <br />
            Rozwiązujesz samodzielnie.
          </h2>
          <p>
            Od pierwszej linijki kodu po wnioski z danych. Pracujemy nad
            umiejętnościami potrzebnymi w zadaniach maturalnych.
          </p>
        </div>
      </div>
      <div className="subject-groups">
        {groups.map((group) => (
          <SubjectCard key={group.number} group={group} />
        ))}
      </div>
      <div className="subject-foundation">
        {site.subjects.slice(4).map((subject) => (
          <div key={subject.id} className="foundation-card">
            <div className="foundation-heading">
              <span
                className={`foundation-code${"base" in subject ? " binary-code" : ""}`}
                aria-hidden="true"
              >
                {subject.code}
                {"base" in subject && <sub>{subject.base}</sub>}
              </span>
              <h3>{subject.title}</h3>
            </div>
            <p>{subject.text}</p>
            {subject.id === "teoria" ? (
              <div className="foundation-example">
                <p className="subject-example-label">Przykład</p>
                <p className="foundation-equation">
                  1010<sub>2</sub> = 10<sub>10</sub>
                </p>
                <p>
                  Pozycje od prawej mają wartości 1, 2, 4 i 8. Jedynki wskazują
                  wartości, które dodajemy: 8 + 2 = 10.
                </p>
              </div>
            ) : (
              <div className="foundation-example foundation-exam">
                <p className="subject-example-label">
                  {maturaExample.sourceLabel}
                </p>
                <p>{maturaExample.context}</p>
                <p className="exam-caption" id="exam-quote-label">
                  Fragment polecenia
                </p>
                <blockquote
                  aria-labelledby="exam-quote-label"
                  cite={maturaExample.sources[0].url}
                >
                  <p>{maturaExample.quote}</p>
                </blockquote>
                <p className="exam-caption" id="exam-method-label">
                  Jak pracujemy nad zadaniem
                </p>
                <ol aria-labelledby="exam-method-label">
                  {maturaExample.steps.map((step) => (
                    <li key={step.label}>
                      <strong>{step.label}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
                <div className="exam-sources">
                  {maturaExample.sources.map((source) => (
                    <a key={source.url} href={source.url}>
                      {source.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
