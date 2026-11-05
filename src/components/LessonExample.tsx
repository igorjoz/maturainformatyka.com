import { Fragment, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { createLessonTrace } from "../scripts/lesson-trace";
import { useHydrated } from "../hooks/useHydrated";
import { useSectionMotion } from "../hooks/useSectionMotion";
import { css, type LessonContent, type Lesson } from "./types";

interface LabState {
  active: string;
  open: boolean;
  index: number;
  playing: boolean;
}
export type LabAction =
  | { type: "select"; id: string }
  | { type: "open" | "close" | "pause" | "play" | "reset" }
  | { type: "step"; index: number }
  | { type: "tick"; last: number };
export function labReducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case "select":
      return { active: action.id, open: false, index: 0, playing: false };
    case "open":
      return { ...state, open: true, index: 0, playing: false };
    case "close":
      return { ...state, open: false, index: 0, playing: false };
    case "pause":
      return state.playing ? { ...state, playing: false } : state;
    case "play":
      return { ...state, playing: true };
    case "reset":
      return { ...state, index: 0, playing: false };
    case "step":
      return { ...state, index: action.index, playing: false };
    case "tick": {
      if (!state.playing) return state;
      const index = Math.min(state.index + 1, action.last);
      return { ...state, index, playing: index < action.last };
    }
  }
}

function PythonCode({ example, lines }: { example: Lesson; lines: number[] }) {
  return (
    <pre
      className="astro-code"
      data-language="python"
      style={{
        backgroundColor: "var(--astro-code-background)",
        color: "var(--astro-code-foreground)",
      }}
      tabIndex={0}
      aria-label={`Rozwiązanie w Pythonie — ${example.level}`}
    >
      <code>
        {example.tokens.map((line, index) => (
          <Fragment key={index}>
            <span
              className={`line${lines.includes(index + 1) ? " is-code-current" : ""}`}
              data-code-line={index + 1}
            >
              {line.map((token, position) => (
                <span
                  key={position}
                  style={{
                    color: token.color,
                    fontStyle:
                      token.fontStyle && token.fontStyle & 1
                        ? "italic"
                        : undefined,
                    fontWeight:
                      token.fontStyle && token.fontStyle & 2
                        ? "bold"
                        : undefined,
                    textDecoration:
                      token.fontStyle && token.fontStyle & 4
                        ? "underline"
                        : undefined,
                  }}
                >
                  {token.content}
                </span>
              ))}
            </span>
            {index < example.tokens.length - 1 ? "\n" : null}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}

export default function LessonExample({ lesson }: { lesson: LessonContent }) {
  const hydrated = useHydrated();
  const sectionRef = useSectionMotion<HTMLElement>();
  const [state, dispatch] = useReducer(labReducer, {
    active: lesson.examples[0].id,
    open: false,
    index: 0,
    playing: false,
  });
  const traces = useMemo(
    () =>
      new Map(
        lesson.examples.map((example) => [
          example.id,
          createLessonTrace(example.algorithm, example.values),
        ]),
      ),
    [lesson.examples],
  );
  const reduced = useRef<MediaQueryList | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const visible = useRef(false);
  const pendingFocus = useRef<"task" | "next" | "launch" | null>(null);
  const taskRefs = useRef(new Map<string, HTMLHeadingElement>());
  const panelRefs = useRef(new Map<string, HTMLElement>());
  const nextRefs = useRef(new Map<string, HTMLButtonElement>());
  const launchRefs = useRef(new Map<string, HTMLButtonElement>());
  const playRefs = useRef(new Map<string, HTMLButtonElement>());
  const resetRefs = useRef(new Map<string, HTMLButtonElement>());
  const last = traces.get(state.active)!.length - 1;

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = media;
    const syncMotion = () => {
      setReducedMotion(media.matches);
      if (media.matches) {
        dispatch({ type: "pause" });
        if (document.activeElement === playRefs.current.get(state.active)) {
          const next = nextRefs.current.get(state.active);
          (next?.disabled
            ? resetRefs.current.get(state.active)
            : next
          )?.focus();
        }
      }
    };
    const syncVisibility = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    const pause = () => dispatch({ type: "pause" });
    syncMotion();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    window.addEventListener("pagehide", pause);
    return () => {
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("pagehide", pause);
    };
  }, [state.active]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) {
      visible.current = true;
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      visible.current = entries[0]?.isIntersecting ?? false;
      if (!visible.current) dispatch({ type: "pause" });
    });
    observer.observe(root);
    return () => {
      visible.current = false;
      observer.disconnect();
    };
  }, [sectionRef]);

  useEffect(() => {
    let frame = 0;
    const followHash = (initial: boolean) => {
      const id = location.hash.slice(1);
      if (!lesson.examples.some((example) => example.id === id)) return;
      if (!initial) pendingFocus.current = "task";
      dispatch({ type: "select", id });
      // Collapsing the other server-rendered examples changes the anchor's position.
      if (initial)
        frame = requestAnimationFrame(() =>
          panelRefs.current
            .get(id)
            ?.scrollIntoView({ block: "start", behavior: "instant" }),
        );
    };
    const change = () => followHash(false);
    followHash(true);
    window.addEventListener("hashchange", change);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", change);
    };
  }, [lesson.examples]);

  useEffect(() => {
    if (!hydrated || !pendingFocus.current) return;
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === "task") {
      taskRefs.current.get(state.active)?.focus({ preventScroll: true });
      panelRefs.current
        .get(state.active)
        ?.scrollIntoView({
          block: "start",
          behavior: reduced.current?.matches ? "instant" : "smooth",
        });
    } else if (target === "next") nextRefs.current.get(state.active)?.focus();
    else launchRefs.current.get(state.active)?.focus();
    // Also handle selecting the current level again: the reducer resets its state.
  });

  useEffect(() => {
    if (!state.playing) return;
    const timer = window.setInterval(() => {
      if (document.hidden || !visible.current || reduced.current?.matches)
        dispatch({ type: "pause" });
      else dispatch({ type: "tick", last });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [state.playing, last]);

  useEffect(() => {
    if (
      state.open &&
      state.index === last &&
      document.activeElement === playRefs.current.get(state.active)
    )
      resetRefs.current.get(state.active)?.focus();
  }, [state.index, state.open, state.active, last]);

  const select = (id: string) => {
    pendingFocus.current = "task";
    dispatch({ type: "select", id });
  };
  const stepTo = (index: number) => {
    if (index === 0) nextRefs.current.get(state.active)?.focus();
    if (index === last) resetRefs.current.get(state.active)?.focus();
    dispatch({ type: "step", index });
  };

  return (
    <section
      ref={sectionRef}
      className="example-section"
      data-motion
      id="przyklad"
      aria-labelledby="example-title"
    >
      <div className="container section" data-lesson-switcher>
        <div className="section-heading">
          <p className="eyebrow">02 / OD POMYSŁU DO KODU</p>
          <div>
            <h2 id="example-title">{lesson.title}</h2>
            <p>{lesson.description}</p>
          </div>
        </div>
        <div
          className="lesson-levels"
          role="group"
          aria-label="Poziom przykładu"
          hidden={!hydrated}
        >
          {lesson.examples.map((example, index) => (
            <button
              key={example.id}
              type="button"
              aria-pressed={state.active === example.id}
              aria-controls={example.id}
              onClick={() => select(example.id)}
            >
              <span aria-hidden="true">0{index + 1}</span>
              {example.level}
            </button>
          ))}
        </div>
        {lesson.examples.map((example) => {
          const active = state.active === example.id;
          const open = hydrated && active && state.open;
          const trace = traces.get(example.id)!;
          const step = open ? trace[state.index] : undefined;
          const completed = step?.result !== null;
          const highlights =
            step?.highlightedIndices ?? example.highlightedIndices;
          return (
            <article
              key={example.id}
              className={`lesson-panel${open ? " lab-active" : ""}`}
              ref={(element) => {
                if (element) panelRefs.current.set(example.id, element);
                else panelRefs.current.delete(example.id);
              }}
              id={example.id}
              aria-labelledby={`${example.id}-task`}
              data-lesson-panel
              data-algorithm={example.algorithm}
              data-values={JSON.stringify(example.values)}
              data-lab-step={open ? state.index : undefined}
              hidden={hydrated && !active}
            >
              <div className="lesson-sheet" data-reveal>
                <div className="lesson-toolbar">
                  <span>
                    <span className="status-dot" aria-hidden="true" /> Fragment
                    wspólnej nauki{" "}
                    <span className="lesson-level">{example.level}</span>
                  </span>
                  <span>Python · przykład autorski, demonstracyjny</span>
                </div>
                <div className="lesson-layout">
                  <div className="lesson-thinking">
                    <div className="lesson-task" data-reveal>
                      <p className="eyebrow">01 — ZROZUM PROBLEM</p>
                      <h3
                        id={`${example.id}-task`}
                        tabIndex={-1}
                        ref={(element) => {
                          if (element)
                            taskRefs.current.set(example.id, element);
                          else taskRefs.current.delete(example.id);
                        }}
                      >
                        {example.task}
                      </h3>
                      <div
                        className="number-sequence"
                        aria-label="Dane wejściowe"
                      >
                        {example.values.map((value, index) => (
                          <span
                            key={index}
                            className={[
                              highlights.includes(index) && "is-highlighted",
                              step?.activeIndices.includes(index) &&
                                "is-current",
                              step?.comparedIndices.includes(index) &&
                                "is-compared",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                      <p className="sequence-caption">
                        {!step || completed
                          ? example.sequenceCaption
                          : "Kropka wskazuje bieżący element. Podkreślenie oznacza porównanie, a zielone pola — dotychczasowe rozwiązanie."}
                      </p>
                    </div>
                    <aside
                      className="mentor-hint"
                      data-reveal
                      style={css({ "--reveal-delay": "140ms" })}
                    >
                      <span className="hint-mark" aria-hidden="true">
                        ↳
                      </span>
                      <div>
                        <p className="eyebrow">WSKAZÓWKA ODE MNIE</p>
                        <p>{example.hint}</p>
                      </div>
                    </aside>
                    <div className="lesson-lab" data-lab>
                      <button
                        className="lab-launch"
                        type="button"
                        data-lab-open
                        aria-expanded={open}
                        aria-controls={`${example.id}-lab`}
                        hidden={!hydrated || open}
                        ref={(element) => {
                          if (element)
                            launchRefs.current.set(example.id, element);
                          else launchRefs.current.delete(example.id);
                        }}
                        onClick={() => {
                          pendingFocus.current = "next";
                          dispatch({ type: "open" });
                        }}
                      >
                        <span className="lab-play-mark" aria-hidden="true">
                          ▶
                        </span>
                        <span>
                          Prześledź rozwiązanie
                          <small>Zobacz, co dzieje się w każdym kroku</small>
                        </span>
                        <span aria-hidden="true">↗</span>
                      </button>
                      <div
                        id={`${example.id}-lab`}
                        className="lab-workspace"
                        data-lab-workspace
                        hidden={!open}
                      >
                        <div className="lab-heading">
                          <span className="eyebrow">LABORATORIUM</span>
                          <span className="lab-counter" data-lab-counter>
                            Krok {open ? state.index : 0} / {trace.length - 1}
                          </span>
                        </div>
                        <progress
                          className="lab-progress"
                          data-lab-progress
                          max={trace.length - 1}
                          value={open ? state.index : 0}
                          aria-label="Postęp demonstracji"
                        />
                        <p
                          className="lab-explanation"
                          data-lab-explanation
                          role="status"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {step?.explanation}
                        </p>
                        <dl
                          className="lab-variables"
                          data-lab-variables
                          aria-label="Wartości zmiennych"
                        >
                          {step &&
                            Object.entries(step.variables).map(
                              ([name, value]) => (
                                <div key={name}>
                                  <dt>{name}</dt>
                                  <dd
                                    className={
                                      Array.isArray(value)
                                        ? "lab-array"
                                        : undefined
                                    }
                                    aria-label={
                                      Array.isArray(value)
                                        ? `${name}: ${value.join(", ")}`
                                        : undefined
                                    }
                                  >
                                    {Array.isArray(value)
                                      ? value.map((item, index) => (
                                          <span
                                            key={index}
                                            className={[
                                              step.activeIndices.includes(
                                                index,
                                              ) && "is-current",
                                              step.comparedIndices.includes(
                                                index,
                                              ) && "is-compared",
                                            ]
                                              .filter(Boolean)
                                              .join(" ")}
                                          >
                                            {item}
                                          </span>
                                        ))
                                      : value}
                                  </dd>
                                </div>
                              ),
                            )}
                        </dl>
                        <div
                          className="lab-controls"
                          role="group"
                          aria-label="Sterowanie rozwiązaniem"
                        >
                          <button
                            type="button"
                            data-lab-previous
                            disabled={!open || state.index === 0}
                            onClick={() => stepTo(Math.max(0, state.index - 1))}
                          >
                            <span aria-hidden="true">←</span> Poprzedni krok
                          </button>
                          <button
                            type="button"
                            data-lab-next
                            disabled={open && state.index === trace.length - 1}
                            ref={(element) => {
                              if (element)
                                nextRefs.current.set(example.id, element);
                              else nextRefs.current.delete(example.id);
                            }}
                            onClick={() =>
                              stepTo(Math.min(last, state.index + 1))
                            }
                          >
                            Następny krok <span aria-hidden="true">→</span>
                          </button>
                          <button
                            type="button"
                            className="lab-play"
                            data-lab-play
                            hidden={reducedMotion}
                            aria-label={
                              open && state.playing ? "Pauza" : "Odtwórz"
                            }
                            aria-pressed={open && state.playing}
                            disabled={open && state.index === trace.length - 1}
                            ref={(element) => {
                              if (element)
                                playRefs.current.set(example.id, element);
                              else playRefs.current.delete(example.id);
                            }}
                            onClick={() => {
                              if (state.playing) dispatch({ type: "pause" });
                              else if (
                                !reduced.current?.matches &&
                                !document.hidden &&
                                visible.current &&
                                state.index < last
                              )
                                dispatch({ type: "play" });
                            }}
                          >
                            <span data-lab-play-icon aria-hidden="true">
                              {open && state.playing ? "Ⅱ" : "▶"}
                            </span>{" "}
                            <span data-lab-play-label>
                              {open && state.playing ? "Pauza" : "Odtwórz"}
                            </span>
                          </button>
                          <button
                            type="button"
                            data-lab-reset
                            ref={(element) => {
                              if (element)
                                resetRefs.current.set(example.id, element);
                              else resetRefs.current.delete(example.id);
                            }}
                            onClick={() => dispatch({ type: "reset" })}
                          >
                            <span aria-hidden="true">↺</span> Od początku
                          </button>
                        </div>
                        <button
                          className="lab-summary"
                          type="button"
                          data-lab-close
                          onClick={() => {
                            pendingFocus.current = "launch";
                            dispatch({ type: "close" });
                          }}
                        >
                          Pokaż pełne rozwiązanie{" "}
                          <span aria-hidden="true">↗</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="lesson-code"
                    data-reveal
                    style={css({ "--reveal-delay": "260ms" })}
                  >
                    <div className="code-caption">
                      <span>02 — ZAPISZ POMYSŁ</span>
                      <span>solution.py</span>
                    </div>
                    <PythonCode
                      example={example}
                      lines={step?.codeLines ?? []}
                    />
                    <div className="code-result">
                      <span>Wynik</span>
                      <strong>
                        {!step || completed ? (
                          <>
                            {example.resultLabel}{" "}
                            <span aria-hidden="true">✓</span>
                          </>
                        ) : (
                          "W trakcie…"
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
                <div
                  className="lesson-takeaway"
                  data-reveal
                  style={css({ "--reveal-delay": "380ms" })}
                >
                  <span className="eyebrow">03 — ZAUWAŻ SCHEMAT</span>
                  <p>{example.conclusion}</p>
                </div>
              </div>
              <div className="lesson-actions">
                {example.actions.map((action) => (
                  <Fragment key={action.targetId}>
                    <button
                      type="button"
                      className="button button-secondary lesson-switch"
                      data-lesson-target={action.targetId}
                      aria-controls={action.targetId}
                      hidden={!hydrated}
                      onClick={() => select(action.targetId)}
                    >
                      {action.label}
                    </button>
                    <a
                      className="button button-secondary"
                      href={`#${action.targetId}`}
                      hidden={hydrated}
                    >
                      {action.label}
                    </a>
                  </Fragment>
                ))}
              </div>
            </article>
          );
        })}
        <p className="example-note">
          Przykłady pokazują sposób pracy. Poziom i język programowania
          dobieramy do Ciebie.
        </p>
      </div>
    </section>
  );
}
