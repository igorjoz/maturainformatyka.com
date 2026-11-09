import { useEffect, useRef, useState, type ReactNode } from "react";
import { useHydrated } from "../hooks/useHydrated";
import { css } from "./types";

const explanations = {
  programowanie: {
    title: "Sprawdzamy warunek",
    result: "3 liczby parzyste: 8, 12 i 4.",
    count: 6,
  },
  algorytmika: {
    title: "Jedno przejście sortowania bąbelkowego",
    result: "3 porównania. Największa liczba trafia na koniec: 2, 3, 1, 5.",
    count: 3,
  },
  excel: {
    title: "Od wartości do wniosku",
    result: "Średnia: 6. Powyżej średniej: 8 i 10.",
    count: 3,
  },
  access: {
    title: "Łączymy po ID, filtrujemy wynik ≥ 80",
    result: "Po połączeniu i filtrze zostają: Ala — 92 pkt i Ola — 85 pkt.",
    count: 3,
  },
  teoria: {
    title: "Każdy bit ma swoją wagę",
    result: "1010₂ = 1 × 8 + 0 × 4 + 1 × 2 + 0 × 1 = 10₁₀.",
    count: 4,
  },
  matura: {
    title: "Dane → Metoda → Sprawdzenie",
    result: "Od odczytu danych, przez obliczenia, do sprawdzenia rozwiązania.",
    count: 3,
  },
};
type Kind = keyof typeof explanations;

/** A finite timeline: resume elapsed time after leaving the viewport or tab. */
function usePlayback(active: boolean, count: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(count);
  const [status, setStatus] = useState("complete");
  const [reduced, setReduced] = useState(false);
  const timeline = useRef({ elapsed: 0, complete: false });
  const lastRun = useRef(run);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (lastRun.current !== run) {
      timeline.current = { elapsed: 0, complete: false };
      lastRun.current = run;
    }
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = !("IntersectionObserver" in window);
    let timer = 0;
    let started: number | null = null;
    const duration = 3600;
    const stop = () => {
      window.clearTimeout(timer);
      if (started !== null)
        timeline.current.elapsed += performance.now() - started;
      started = null;
    };
    const tick = () => {
      const elapsed =
        timeline.current.elapsed +
        (started === null ? 0 : performance.now() - started);
      setStep(Math.min(count, Math.floor(elapsed / (duration / count))));
      if (elapsed >= duration) {
        timeline.current.complete = true;
        stop();
        setStep(count);
        setStatus("complete");
      } else {
        timer = window.setTimeout(tick, Math.min(100, duration - elapsed));
      }
    };
    const sync = () => {
      stop();
      setReduced(media.matches);
      if (media.matches) {
        timeline.current.complete = true;
        setStep(count);
        setStatus("complete");
      } else if (timeline.current.complete) {
        setStep(count);
        setStatus("complete");
      } else if (active && visible && !document.hidden) {
        started = performance.now();
        setStatus("playing");
        tick();
      } else {
        setStep(
          Math.min(
            count,
            Math.floor(timeline.current.elapsed / (duration / count)),
          ),
        );
        setStatus("paused");
      }
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              visible = entries[0]?.isIntersecting ?? false;
              sync();
            },
            { threshold: 0.25 },
          )
        : null;
    observer?.observe(element);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    sync();
    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
    };
  }, [active, count, run]);

  return {
    ref,
    step,
    status,
    reduced,
    replay: () => {
      setRun((value) => value + 1);
    },
  };
}

export default function SubjectDiagram({
  kind,
  active = true,
  action,
  steps,
}: {
  kind: Kind;
  active?: boolean;
  action?: ReactNode;
  steps?: { label: string; text: string }[];
}) {
  const hydrated = useHydrated();
  const example = explanations[kind];
  const { ref, step, status, reduced, replay } = usePlayback(
    active,
    example.count,
  );
  const done = step === example.count;
  const marked = (condition: boolean) => (condition ? " is-marked" : "");

  return (
    <div
      ref={ref}
      className={`subject-diagram diagram-${kind}`}
      data-diagram={kind}
      data-playback={status}
      data-step={step}
    >
      {kind !== "matura" && (
        <>
          <p className="diagram-title">{example.title}</p>
          <div className="diagram-scene" aria-hidden="true">
            {kind === "programowanie" && (
              <>
                <div className="diagram-numbers">
                  {[3, 8, 5, 12, 7, 4].map((value, index) => (
                    <span
                      key={index}
                      className={`diagram-number${marked(index < step && value % 2 === 0)}${index === step ? " is-current" : ""}`}
                    >
                      {value}
                    </span>
                  ))}
                </div>
                <div className="diagram-calculation">
                  <span>n % 2 = 0</span>
                  <span>
                    Licznik{" "}
                    <strong>
                      {
                        [3, 8, 5, 12, 7, 4]
                          .slice(0, step)
                          .filter((n) => n % 2 === 0).length
                      }
                    </strong>
                  </span>
                </div>
              </>
            )}
            {kind === "algorytmika" && (
              <>
                <div className="diagram-numbers">
                  {[
                    [5, 2, 3, 1],
                    [2, 5, 3, 1],
                    [2, 3, 5, 1],
                    [2, 3, 1, 5],
                  ][step].map((value, index) => (
                    <span
                      key={value}
                      className={`diagram-number${marked(done && index === 3)}${!done && (index === step || index === step + 1) ? " is-current" : ""}`}
                    >
                      {value}
                    </span>
                  ))}
                </div>
                <div className="diagram-calculation">
                  <span>
                    {done ? "Największa na końcu" : "Porównaj → zamień"}
                  </span>
                  <span>
                    Porównania <strong>{step}</strong>
                  </span>
                </div>
              </>
            )}
            {kind === "excel" && (
              <>
                <div className="diagram-chart">
                  <span
                    className={`diagram-average${step >= 1 ? " is-shown" : ""}`}
                  >
                    <span>śr. 6</span>
                  </span>
                  {[2, 4, 8, 10].map((value) => (
                    <div key={value} className="diagram-chart-column">
                      <span
                        className={`diagram-bar${marked(step >= 2 && value > 6)}`}
                        style={css({ "--bar-height": `${value * 8}%` })}
                      >
                        <b>{value}</b>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="diagram-calculation">
                  <span>(2 + 4 + 8 + 10) / 4</span>
                  <strong>{step >= 1 ? "Średnia: 6" : "Obliczamy…"}</strong>
                </div>
              </>
            )}
            {kind === "access" && (
              <>
                <div className="diagram-relations">
                  <div>
                    <small>Uczniowie</small>
                    {["1 · Ala", "2 · Jan", "3 · Ola"].map((name, index) => (
                      <span
                        key={name}
                        className={marked(
                          step >= 1 && (index !== 1 || step < 2),
                        )}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  <div
                    className={`diagram-joins${step >= 1 ? " is-shown" : ""}`}
                  >
                    <span>→ ID →</span>
                    <span>→ ID →</span>
                    <span>→ ID →</span>
                  </div>
                  <div>
                    <small>Wyniki</small>
                    {["1 · 92 pkt", "2 · 64 pkt", "3 · 85 pkt"].map(
                      (value, index) => (
                        <span
                          key={value}
                          className={`${marked(step >= 1 && (index !== 1 || step < 2))}${step >= 2 && index === 1 ? " is-filtered" : ""}`}
                        >
                          {value}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}
            {kind === "teoria" && (
              <>
                <div className="diagram-bits">
                  {[8, 4, 2, 1].map((weight, index) => (
                    <div
                      key={weight}
                      className={marked(
                        (weight === 8 && step >= 1) ||
                          (weight === 2 && step >= 2),
                      )}
                    >
                      <span className="diagram-bit">
                        {index % 2 === 0 ? 1 : 0}
                      </span>
                      <span className="diagram-bit-link">↓</span>
                      <span className="diagram-weight">{weight}</span>
                    </div>
                  ))}
                </div>
                <div
                  className={`diagram-binary-sum${step >= 3 ? " is-shown" : ""}`}
                >
                  <span>8</span>
                  <b>+</b>
                  <span>2</span>
                  <b>=</b>
                  <strong>10</strong>
                </div>
              </>
            )}
          </div>
          <p className="diagram-result">{example.result}</p>
        </>
      )}
      {kind === "matura" && (
        <ol className="diagram-exam-steps" aria-labelledby="exam-method-label">
          {steps?.map((item, index) => (
            <li
              key={item.label}
              className={`${marked(done || index < step)}${!done && step === index ? " is-current" : ""}`}
            >
              <strong>{item.label}:</strong> {item.text}
            </li>
          ))}
        </ol>
      )}
      <div className="diagram-actions">
        {action}
        <button
          type="button"
          className="diagram-replay"
          hidden={!hydrated || reduced}
          onClick={replay}
          aria-label={`Odtwórz ponownie: ${example.title}`}
        >
          <span aria-hidden="true">↻</span> Odtwórz ponownie
        </button>
      </div>
    </div>
  );
}
