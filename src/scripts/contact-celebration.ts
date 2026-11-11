import { onPageLoad } from './page-lifecycle';

/** One owner for the celebration on static panels and hydrated home sections alike. */
onPageLoad(signal => {
  const root = document.querySelector<HTMLElement>('.contact-section');
  const sentinel = document.querySelector<HTMLElement>('[data-page-end]');
  if (!root || !sentinel) return;
  const island = root.closest('astro-island');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let started = false;
  let frame = 0;
  const sync = () => {
    frame = 0;
    if (island?.hasAttribute('ssr')) return;
    const section = root.getBoundingClientRect();
    const end = sentinel.getBoundingClientRect();
    const active = !document.hidden && !reduced.matches && section.top < innerHeight && section.bottom > 0;
    root.classList.toggle('celebration-active', active);
    if (!started && active && end.top <= innerHeight + 4 && end.bottom >= 0) {
      started = true;
      root.classList.add('contact-arrived');
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(sync, { rootMargin: '0px 0px 4px 0px' });
    observer.observe(root);
    observer.observe(sentinel);
    signal.addEventListener('abort', () => observer.disconnect(), { once: true });
  }
  island?.addEventListener('astro:hydrate', sync, { once: true, signal });
  // Also covers restored scroll positions and the fallback without IntersectionObserver.
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', schedule, { passive: true, signal });
  window.addEventListener('pageshow', schedule, { signal });
  document.addEventListener('visibilitychange', sync, { signal });
  reduced.addEventListener('change', sync, { signal });
  signal.addEventListener('abort', () => { cancelAnimationFrame(frame); }, { once: true });
  sync();
});
