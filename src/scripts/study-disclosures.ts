/** Keep native details semantics, animating their measured height in both directions. */
export function animateStudyDisclosures(root: HTMLElement, signal: AbortSignal) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const settleAll = new Set<() => void>();

  for (const details of root.querySelectorAll<HTMLDetailsElement>('.guide-skill')) {
    const summary = details.querySelector('summary');
    const content = details.querySelector<HTMLElement>('.guide-skill-content');
    if (!summary || !content) continue;

    let targetOpen = details.open;
    let heightAnimation: Animation | undefined;
    let contentAnimation: Animation | undefined;

    const settle = () => {
      if (!heightAnimation) return;
      heightAnimation.cancel();
      contentAnimation?.cancel();
      heightAnimation = contentAnimation = undefined;
      details.open = targetOpen;
      delete details.dataset.collapsing;
      delete details.dataset.animating;
    };
    settleAll.add(settle);

    summary.addEventListener('click', (event) => {
      // Let the browser handle the disclosure normally when motion is disabled.
      if (reducedMotion.matches || typeof details.animate !== 'function') return;
      event.preventDefault();

      const startHeight = details.getBoundingClientRect().height;
      targetOpen = heightAnimation ? !targetOpen : !details.open;
      heightAnimation?.cancel();
      contentAnimation?.cancel();
      details.open = true;
      details.dataset.animating = '';
      details.toggleAttribute('data-collapsing', !targetOpen);

      const endHeight = targetOpen
        ? details.getBoundingClientRect().height
        : summary.getBoundingClientRect().height;
      const timing = { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
      heightAnimation = details.animate(
        { height: [`${startHeight}px`, `${endHeight}px`] }, timing,
      );
      if (targetOpen) {
        contentAnimation = content.animate({ opacity: [0.35, 1] }, timing);
      }
      heightAnimation.onfinish = settle;
    }, { signal });
  }

  const settle = () => settleAll.forEach(finish => finish());
  // Settle before printing or jumping to an anchor, so every layout uses natural heights.
  window.addEventListener('beforeprint', settle, { signal });
  window.addEventListener('hashchange', settle, { signal });
  window.addEventListener('resize', settle, { signal });
  reducedMotion.addEventListener('change', settle, { signal });
  signal.addEventListener('abort', settle, { once: true });
}
