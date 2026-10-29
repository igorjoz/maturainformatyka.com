/** Progressive enhancement: content and native disclosures work without motion. */
export function initMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precise = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const narrow = matchMedia('(max-width: 900px)');
  const scopes = [...document.querySelectorAll<HTMLElement>('[data-motion]')];
  const visible = new Set<HTMLElement>();
  const cards = [...document.querySelectorAll<HTMLElement>('[data-card]')];
  const scene = document.querySelector<HTMLElement>('[data-portrait-scene]');
  const process = document.querySelector<HTMLElement>('[data-process]');
  const processScope = process?.closest<HTMLElement>('[data-motion]');
  const contact = document.querySelector<HTMLElement>('#kontakt');
  const pageEnd = document.querySelector<HTMLElement>('[data-page-end]');
  let endVisible = false;
  let celebrated = false;
  let scrollFrame = 0;
  let pointerFrame = 0;
  let pointerListening = false;
  let pointerTarget: HTMLElement | null = null;
  let pointerX = 0;
  let pointerY = 0;
  const tapped = new Map<HTMLElement, number>();

  const reset = (target: HTMLElement) => {
    for (const prop of ['--pointer-x', '--pointer-y', '--pointer-rx', '--pointer-ry', '--card-rx', '--card-ry', '--glow-x', '--glow-y']) {
      target.style.removeProperty(prop);
    }
    target.classList.remove('pointer-active', 'is-tapped');
  };
  const resetPointer = () => {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (pointerTarget) reset(pointerTarget);
    pointerTarget = null;
  };
  const renderPointer = () => {
    pointerFrame = 0;
    const target = pointerTarget;
    if (!target) return;
    target.classList.add('pointer-active');
    if (target === scene) {
      target.style.setProperty('--pointer-x', `${pointerX * 20}px`);
      target.style.setProperty('--pointer-y', `${pointerY * 20}px`);
      target.style.setProperty('--pointer-rx', `${-pointerY * 3}deg`);
      target.style.setProperty('--pointer-ry', `${pointerX * 3}deg`);
    } else {
      target.style.setProperty('--card-rx', `${-pointerY * 3}deg`);
      target.style.setProperty('--card-ry', `${pointerX * 3}deg`);
      target.style.setProperty('--glow-x', `${(pointerX + 1) * 50}%`);
      target.style.setProperty('--glow-y', `${(pointerY + 1) * 50}%`);
    }
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    const target = event.currentTarget as HTMLElement;
    if (pointerTarget !== target) resetPointer();
    pointerTarget = target;
    const bounds = target.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointer);
  };
  const pointerTargets = scene ? [scene, ...cards] : cards;
  const syncPointer = () => {
    const enabled = precise.matches && !reduced.matches && !document.hidden;
    if (enabled === pointerListening) return;
    pointerListening = enabled;
    for (const target of pointerTargets) {
      if (enabled) {
        target.addEventListener('pointermove', move);
        target.addEventListener('pointerleave', resetPointer);
      } else {
        target.removeEventListener('pointermove', move);
        target.removeEventListener('pointerleave', resetPointer);
        reset(target);
      }
    }
    if (!enabled) resetPointer();
  };
  for (const card of cards) {
    card.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' || reduced.matches || document.hidden) return;
      clearTimeout(tapped.get(card));
      card.classList.add('is-tapped');
      tapped.set(card, window.setTimeout(() => {
        card.classList.remove('is-tapped');
        tapped.delete(card);
      }, 250));
    }, { passive: true });
  }

  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const renderScroll = () => {
    scrollFrame = 0;
    if (reduced.matches || document.hidden) return;
    const height = window.innerHeight;
    // Read layout before writing styles to avoid repeated synchronous layouts.
    const positions = [...visible].map(scope => ({ scope, rect: scope.getBoundingClientRect() }));
    const processRect = processScope && visible.has(processScope) ? process?.getBoundingClientRect() : undefined;
    for (const { scope, rect } of positions) {
      const offset = (clamp((height - rect.top) / (height + rect.height)) - .5) * (narrow.matches ? 24 : 64);
      scope.style.setProperty('--scroll-drift', `${offset.toFixed(2)}px`);
    }
    if (process && processRect) {
      // Vertical steps track their actual marker positions; horizontal steps
      // fill over the approach to the section's midpoint.
      const progress = narrow.matches
        ? clamp((height * .72 - processRect.top - 24) / Math.max(1, processRect.height - 48))
        : clamp((height * .88 - processRect.top) / Math.max(1, height * .42));
      process.style.setProperty('--process-progress', progress.toFixed(4));
    }
  };
  const scheduleScroll = () => {
    if (!scrollFrame && !reduced.matches && !document.hidden && visible.size) scrollFrame = requestAnimationFrame(renderScroll);
  };
  const sync = () => {
    for (const scope of scopes) {
      scope.classList.toggle('motion-active', visible.has(scope) && !reduced.matches && !document.hidden);
    }
    if (reduced.matches || document.hidden) {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      for (const scope of scopes) scope.style.removeProperty('--scroll-drift');
      process?.style.removeProperty('--process-progress');
      for (const [card, timer] of tapped) { clearTimeout(timer); card.classList.remove('is-tapped'); }
      tapped.clear();
    }
    syncPointer();
    scheduleScroll();
    if (!celebrated && endVisible && contact && visible.has(contact) && !reduced.matches && !document.hidden) {
      celebrated = true;
      contact.classList.add('contact-arrived');
    }
  };

  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const entrance = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!reduced.matches) entry.target.classList.add('is-revealed');
        entrance.unobserve(entry.target);
      }
    }, { threshold: .12 });
    document.querySelectorAll('[data-reveal]').forEach(el => entrance.observe(el));
    const visibility = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const scope = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          visible.add(scope);
          if (scene && scope.contains(scene) && !reduced.matches) scene.classList.add('scene-intro');
        } else {
          visible.delete(scope);
          if (pointerTarget && scope.contains(pointerTarget)) resetPointer();
        }
      }
      sync();
    }, { threshold: 0 });
    scopes.forEach(scope => visibility.observe(scope));
    if (pageEnd) {
      const finish = new IntersectionObserver(entries => {
        endVisible = entries[0]?.isIntersecting ?? false;
        sync();
      // Allow for fractional layout pixels at the document's scroll boundary.
      }, { threshold: 0, rootMargin: '0px 0px 4px 0px' });
      finish.observe(pageEnd);
    }
    process?.classList.add('process-enhanced');
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  reduced.addEventListener('change', sync);
  precise.addEventListener('change', sync);
  narrow.addEventListener('change', scheduleScroll);
  document.addEventListener('visibilitychange', sync);
  sync();
}
