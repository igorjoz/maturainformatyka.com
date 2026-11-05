import { useEffect, useRef } from "react";

/** Owns only decorative classes/CSS variables inside this section. UI state stays in React. */
export function useSectionMotion<T extends HTMLElement>({
  celebrate = false,
} = {}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const precise = matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 901px)",
    );
    const narrow = matchMedia("(max-width: 900px)");
    const scene = root.querySelector<HTMLElement>("[data-portrait-scene]");
    const cards = [...root.querySelectorAll<HTMLElement>("[data-card]")];
    const process = root.querySelector<HTMLElement>("[data-process]");
    const steps = [...root.querySelectorAll<HTMLElement>(".step")];
    const pointerTargets = scene ? [scene, ...cards] : cards;
    const cleanups: (() => void)[] = [];
    const tapped = new Map<HTMLElement, number>();
    let visible = !("IntersectionObserver" in window);
    let endVisible = false;
    let scrollFrame = 0;
    let pointerFrame = 0;
    let target: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const reset = (element: HTMLElement) => {
      for (const key of [
        "--pointer-x",
        "--pointer-y",
        "--pointer-rx",
        "--pointer-ry",
        "--card-rx",
        "--card-ry",
        "--glow-x",
        "--glow-y",
      ])
        element.style.removeProperty(key);
      element.classList.remove("pointer-active", "is-tapped");
    };
    const resetPointer = () => {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      if (target) reset(target);
      target = null;
    };
    const renderPointer = () => {
      pointerFrame = 0;
      if (!target) return;
      target.classList.add("pointer-active");
      const properties =
        target === scene
          ? {
              "--pointer-x": `${pointerX * 20}px`,
              "--pointer-y": `${pointerY * 20}px`,
              "--pointer-rx": `${-pointerY * 3}deg`,
              "--pointer-ry": `${pointerX * 3}deg`,
            }
          : {
              "--card-rx": `${-pointerY * 3}deg`,
              "--card-ry": `${pointerX * 3}deg`,
              "--glow-x": `${(pointerX + 1) * 50}%`,
              "--glow-y": `${(pointerY + 1) * 50}%`,
            };
      for (const [name, value] of Object.entries(properties))
        target.style.setProperty(name, value!);
    };
    for (const element of pointerTargets) {
      const move = (event: PointerEvent) => {
        if (
          !visible ||
          !precise.matches ||
          reduced.matches ||
          document.hidden ||
          event.pointerType === "touch"
        )
          return;
        if (target !== element) resetPointer();
        target = element;
        const bounds = element.getBoundingClientRect();
        pointerX = clamp((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointerY = clamp((event.clientY - bounds.top) / bounds.height) * 2 - 1;
        if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointer);
      };
      const tap = (event: PointerEvent) => {
        if (event.pointerType !== "touch" || reduced.matches || document.hidden)
          return;
        clearTimeout(tapped.get(element));
        element.classList.add("is-tapped");
        tapped.set(
          element,
          window.setTimeout(() => {
            element.classList.remove("is-tapped");
            tapped.delete(element);
          }, 250),
        );
      };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", resetPointer);
      element.addEventListener("pointerdown", tap, { passive: true });
      cleanups.push(() => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", resetPointer);
        element.removeEventListener("pointerdown", tap);
        reset(element);
      });
    }
    const renderScroll = () => {
      scrollFrame = 0;
      if (!visible || reduced.matches || document.hidden) return;
      const height = innerHeight;
      const rect = root.getBoundingClientRect();
      const processRect = process?.getBoundingClientRect();
      const offset =
        (clamp((height - rect.top) / (height + rect.height)) - 0.5) *
        (narrow.matches ? 24 : 64);
      root.style.setProperty("--scroll-drift", `${offset.toFixed(2)}px`);
      if (root.id === "zakres")
        root.style.setProperty("--art-drift", `${(offset * 0.3).toFixed(2)}px`);
      if (process && processRect) {
        const progress = narrow.matches
          ? clamp(
              (height * 0.72 - processRect.top - 24) /
                Math.max(1, processRect.height - 48),
            )
          : clamp(
              (height * 0.88 - processRect.top) / Math.max(1, height * 0.42),
            );
        process.style.setProperty("--process-progress", progress.toFixed(4));
        steps.forEach((step, index) => {
          const active = progress >= index / Math.max(1, steps.length - 1);
          step.classList.toggle("step-active", active);
          if (active) step.classList.add("step-activated");
        });
      }
    };
    const schedule = () => {
      if (!scrollFrame && visible && !reduced.matches && !document.hidden)
        scrollFrame = requestAnimationFrame(renderScroll);
    };
    const sync = () => {
      const active = visible && !reduced.matches && !document.hidden;
      root.classList.toggle("motion-active", active);
      if (!active || !precise.matches) resetPointer();
      if (!active) {
        cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
        root.style.removeProperty("--scroll-drift");
        root.style.removeProperty("--art-drift");
        process?.style.removeProperty("--process-progress");
        steps.forEach((step) => step.classList.remove("step-active"));
        for (const [element, timer] of tapped) {
          clearTimeout(timer);
          element.classList.remove("is-tapped");
        }
        tapped.clear();
      }
      if (active && scene) scene.classList.add("scene-intro");
      if (active && endVisible) root.classList.add("contact-arrived");
      schedule();
    };
    root.classList.add("motion-ready");
    if ("IntersectionObserver" in window) {
      const visibility = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        sync();
      });
      visibility.observe(root);
      cleanups.push(() => visibility.disconnect());
      const entrance = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) {
              if (!reduced.matches) entry.target.classList.add("is-revealed");
              entrance.unobserve(entry.target);
            }
        },
        { threshold: 0.12 },
      );
      root
        .querySelectorAll("[data-reveal]")
        .forEach((element) => entrance.observe(element));
      cleanups.push(() => entrance.disconnect());
      if (celebrate) {
        const sentinel = document.querySelector("[data-page-end]");
        if (sentinel) {
          const finish = new IntersectionObserver(
            (entries) => {
              endVisible = entries[0]?.isIntersecting ?? false;
              sync();
            },
            { rootMargin: "0px 0px 4px 0px" },
          );
          finish.observe(sentinel);
          cleanups.push(() => finish.disconnect());
        }
      }
      process?.classList.add("process-enhanced");
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduced.addEventListener("change", sync);
    precise.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", sync);
      precise.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      cleanups.forEach((cleanup) => cleanup());
      cancelAnimationFrame(scrollFrame);
      resetPointer();
      for (const timer of tapped.values()) clearTimeout(timer);
      root.classList.remove("motion-ready", "motion-active", "contact-arrived");
      scene?.classList.remove("scene-intro");
      root
        .querySelectorAll(".is-revealed")
        .forEach((element) => element.classList.remove("is-revealed"));
      root.style.removeProperty("--scroll-drift");
      root.style.removeProperty("--art-drift");
      process?.classList.remove("process-enhanced");
      process?.style.removeProperty("--process-progress");
      steps.forEach((step) =>
        step.classList.remove("step-active", "step-activated"),
      );
    };
  }, [celebrate]);
  return ref;
}
