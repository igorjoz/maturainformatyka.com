import { createLessonTrace, type LessonAlgorithm } from './lesson-trace';

/** Playback decorates the server-rendered solution; it never executes Python. */
export function initLessonLab() {
  const switcher = document.querySelector<HTMLElement>('[data-lesson-switcher]');
  if (!switcher) return;
  const panels = [...switcher.querySelectorAll<HTMLElement>('[data-lesson-panel]')];
  const switches = [...switcher.querySelectorAll<HTMLButtonElement>('[data-lesson-target]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const section = switcher.closest<HTMLElement>('section')!;
  let visible = false;
  let timer: number | undefined;
  let active: ReturnType<typeof prepare> | undefined;

  const pause = () => {
    window.clearTimeout(timer);
    timer = undefined;
    if (active) active.setPlaying(false);
  };

  function prepare(panel: HTMLElement) {
    const algorithm = panel.dataset.algorithm;
    if (algorithm !== 'parity' && algorithm !== 'kadane' && algorithm !== 'lis') return;
    let trace: ReturnType<typeof createLessonTrace>;
    try {
      const values: unknown = JSON.parse(panel.dataset.values ?? 'null');
      if (!Array.isArray(values) || !values.every(value => typeof value === 'number' && Number.isFinite(value))) return;
      trace = createLessonTrace(algorithm as LessonAlgorithm, values);
    } catch { return; }
    const open = panel.querySelector<HTMLButtonElement>('[data-lab-open]')!;
    const workspace = panel.querySelector<HTMLElement>('[data-lab-workspace]')!;
    const previous = panel.querySelector<HTMLButtonElement>('[data-lab-previous]')!;
    const next = panel.querySelector<HTMLButtonElement>('[data-lab-next]')!;
    const play = panel.querySelector<HTMLButtonElement>('[data-lab-play]')!;
    const close = panel.querySelector<HTMLButtonElement>('[data-lab-close]')!;
    const explanation = panel.querySelector<HTMLElement>('[data-lab-explanation]')!;
    const variables = panel.querySelector<HTMLElement>('[data-lab-variables]')!;
    const counter = panel.querySelector<HTMLElement>('[data-lab-counter]')!;
    const progress = panel.querySelector<HTMLProgressElement>('[data-lab-progress]')!;
    const result = panel.querySelector<HTMLElement>('.code-result strong')!;
    const caption = panel.querySelector<HTMLElement>('.sequence-caption')!;
    const summaryCaption = caption.textContent;
    const summaryResult = [...result.childNodes].map(node => node.cloneNode(true));
    const cells = [...panel.querySelectorAll<HTMLElement>('.number-sequence > span')];
    const summaryHighlights = cells.map(cell => cell.classList.contains('is-highlighted'));
    const codeLines = [...panel.querySelectorAll<HTMLElement>('[data-code-line]')];
    let index = 0;
    let running = false;

    const setPlaying = (playing: boolean) => {
      running = playing;
      play.setAttribute('aria-pressed', String(playing));
      play.setAttribute('aria-label', playing ? 'Pauza' : 'Odtwórz');
      play.querySelector('[data-lab-play-label]')!.textContent = playing ? 'Pauza' : 'Odtwórz';
      play.querySelector('[data-lab-play-icon]')!.textContent = playing ? 'Ⅱ' : '▶';
    };

    const render = () => {
      const step = trace[index];
      panel.dataset.labStep = String(index);
      panel.classList.add('lab-active');
      counter.textContent = `Krok ${index} / ${trace.length - 1}`;
      progress.max = trace.length - 1;
      progress.value = index;
      explanation.textContent = step.explanation;
      caption.textContent = step.result === null
        ? 'Kropka wskazuje bieżący element. Podkreślenie oznacza porównanie, a zielone pola — dotychczasowe rozwiązanie.'
        : summaryCaption;
      variables.replaceChildren(...Object.entries(step.variables).map(([name, value]) => {
        const item = document.createElement('div');
        const term = document.createElement('dt');
        const definition = document.createElement('dd');
        term.textContent = name;
        if (Array.isArray(value)) {
          definition.className = 'lab-array';
          definition.setAttribute('aria-label', `${name}: ${value.join(', ')}`);
          value.forEach((length, position) => {
            const cell = document.createElement('span');
            cell.textContent = String(length);
            cell.classList.toggle('is-current', step.activeIndices.includes(position));
            cell.classList.toggle('is-compared', step.comparedIndices.includes(position));
            definition.append(cell);
          });
        } else {
          definition.textContent = String(value);
        }
        item.append(term, definition);
        return item;
      }));
      cells.forEach((cell, position) => {
        cell.classList.toggle('is-current', step.activeIndices.includes(position));
        cell.classList.toggle('is-compared', step.comparedIndices.includes(position));
        cell.classList.toggle('is-highlighted', step.highlightedIndices.includes(position));
      });
      codeLines.forEach(line => line.classList.toggle('is-code-current', step.codeLines.includes(Number(line.dataset.codeLine))));
      if (step.result === null) result.textContent = 'W trakcie…';
      else result.replaceChildren(...summaryResult.map(node => node.cloneNode(true)));
      const focused = document.activeElement;
      previous.disabled = index === 0;
      next.disabled = index === trace.length - 1;
      play.disabled = next.disabled;
      if (focused === previous && previous.disabled) next.focus();
      if ((focused === next && next.disabled) || (focused === play && play.disabled)) {
        panel.querySelector<HTMLButtonElement>('[data-lab-reset]')!.focus();
      }
      if (next.disabled) pause();
    };

    const restore = () => {
      setPlaying(false);
      index = 0;
      workspace.hidden = true;
      open.hidden = false;
      open.setAttribute('aria-expanded', 'false');
      panel.classList.remove('lab-active');
      delete panel.dataset.labStep;
      cells.forEach((cell, position) => {
        cell.classList.remove('is-current', 'is-compared');
        cell.classList.toggle('is-highlighted', summaryHighlights[position]);
      });
      codeLines.forEach(line => line.classList.remove('is-code-current'));
      caption.textContent = summaryCaption;
      result.replaceChildren(...summaryResult.map(node => node.cloneNode(true)));
    };

    const schedule = () => {
      timer = window.setTimeout(() => {
        timer = undefined;
        if (!running || document.hidden || !visible || panel.hidden || reduced.matches) { pause(); return; }
        index = Math.min(index + 1, trace.length - 1);
        render();
        if (running) schedule();
      }, 1200);
    };

    open.addEventListener('click', () => {
      pause();
      active = controller;
      index = 0;
      workspace.hidden = false;
      open.setAttribute('aria-expanded', 'true');
      open.hidden = true;
      render();
      next.focus();
    });
    previous.addEventListener('click', () => { pause(); index = Math.max(0, index - 1); render(); });
    next.addEventListener('click', () => { pause(); index = Math.min(trace.length - 1, index + 1); render(); });
    panel.querySelector('[data-lab-reset]')!.addEventListener('click', () => { pause(); index = 0; render(); });
    play.addEventListener('click', () => {
      if (running) { pause(); return; }
      // Reduced motion keeps manual stepping available without timed playback.
      if (reduced.matches || document.hidden || !visible || index === trace.length - 1) return;
      active = controller;
      setPlaying(true);
      schedule();
    });
    const syncMotion = () => {
      if (reduced.matches) {
        pause();
        if (document.activeElement === play) (next.disabled ? panel.querySelector<HTMLButtonElement>('[data-lab-reset]')! : next).focus();
      }
      play.hidden = reduced.matches;
    };
    close.addEventListener('click', () => { pause(); restore(); open.focus(); });
    reduced.addEventListener('change', syncMotion);
    syncMotion();
    const controller = { panel, restore, setPlaying };
    open.hidden = false;
    return controller;
  }

  const controllers = panels.map(prepare).filter((controller): controller is NonNullable<typeof controller> => Boolean(controller));
  if (panels.length > 1 && switches.length && controllers.length === panels.length && switches.every(button => panels.some(panel => panel.id === button.dataset.lessonTarget))) {
    const show = (target: HTMLElement, focus: boolean) => {
      pause();
      for (const controller of controllers) {
        controller.restore();
        controller.panel.hidden = controller.panel !== target;
      }
      active = controllers.find(controller => controller.panel === target);
      if (focus) {
        target.classList.remove('lesson-enter');
        // Restart only this panel's brief transition, keeping focus and anchors stable.
        requestAnimationFrame(() => { if (!target.hidden && !reduced.matches) target.classList.add('lesson-enter'); });
        target.querySelector<HTMLElement>('.lesson-task h3')!.focus({ preventScroll: true });
        target.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'instant' : 'smooth' });
      }
    };
    for (const button of switches) {
      button.addEventListener('click', () => show(panels.find(panel => panel.id === button.dataset.lessonTarget)!, true));
      button.hidden = false;
    }
    show(panels.find(panel => `#${panel.id}` === location.hash) ?? panels[0], false);
    window.addEventListener('hashchange', () => {
      const target = panels.find(panel => `#${panel.id}` === location.hash);
      if (target?.hidden) show(target, true);
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (!visible) pause();
    }).observe(section);
  } else visible = true;
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
}
