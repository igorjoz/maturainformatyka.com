import { onPageLoad } from './page-lifecycle';
import { groupAnchor } from '../data/exam-reader';

onPageLoad((signal) => {
  const preview = document.querySelector<HTMLIFrameElement>('[data-exam-preview]');
  if (!preview) return;
  const initialPreviewSource = preview.getAttribute('src')!;
  const pathname = location.pathname;
  const back = document.querySelector<HTMLAnchorElement>('[data-archive-back]');
  const archiveReturn = new URLSearchParams(location.search).get('powrot');
  if (back && archiveReturn) {
    try {
      const target = new URL(archiveReturn, location.origin);
      if (target.origin === location.origin && target.pathname === '/arkusze/') {
        const clean = new URL('/arkusze/', location.origin);
        for (const key of ['formula', 'year', 'level', 'kind']) {
          const value = target.searchParams.get(key);
          if (value && /^[a-z0-9-]+$/.test(value)) clean.searchParams.set(key, value);
        }
        back.href = clean.pathname + clean.search;
      }
    } catch { /* Keep the canonical archive link for a malformed return. */ }
  }

  const pdfButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-preview-src]')];
  const setPreview = (src: string) => {
    // Avoid reloading the embedded viewer when restoring the same state.
    if (preview.getAttribute('src') !== src) preview.src = src;
    pdfButtons.forEach(button => {
      const selected = button.dataset.previewSrc === src.split('#')[0];
      button.setAttribute('aria-pressed', String(selected));
      if (selected) preview.title = `Podgląd: ${button.textContent} — ${document.title}`;
    });
  };
  pdfButtons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (button.dataset.previewSrc) setPreview(button.dataset.previewSrc);
    }, { signal });
  });

  const reader = document.querySelector<HTMLElement>('[data-exam-task-reader]');
  const modes = document.querySelector<HTMLElement>('[data-reader-modes]');
  const pdfPanel = document.querySelector<HTMLElement>('[data-exam-pdf-panel]');
  const pdfActions = document.querySelector<HTMLElement>('[data-reader-pdf-actions]');
  const groups = [...document.querySelectorAll<HTMLElement>('[data-exam-task-group]')];
  if (!reader || !modes || !pdfPanel || !groups.length) return;

  const modeButtons = [...modes.querySelectorAll<HTMLButtonElement>('[data-reader-mode]')];
  const selects = [...reader.querySelectorAll<HTMLSelectElement>('[data-reader-select]')];
  const previous = [...reader.querySelectorAll<HTMLButtonElement>('[data-reader-previous]')];
  const next = [...reader.querySelectorAll<HTMLButtonElement>('[data-reader-next]')];
  const indexLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-exam-task]')];
  const practiceLinks = [...reader.querySelectorAll<HTMLAnchorElement>('[data-reader-practice]')];
  let number = groups[0].dataset.number!;

  const readerUrl = (mode: string, selected: string, hash: string) => {
    const url = new URL(location.href);
    if (mode === 'zadania') url.searchParams.set('widok', 'zadania');
    else url.searchParams.delete('widok');
    url.searchParams.set('zadanie', selected);
    url.hash = hash;
    return url;
  };
  const focusTarget = () => {
    const group = groups.find(item => item.dataset.number === number)!;
    let target: HTMLElement | null = null;
    if (!reader.hidden) {
      const requested = document.getElementById(location.hash.slice(1));
      target = requested && group.contains(requested) && requested.matches('h3, h4') ? requested : document.getElementById(groupAnchor(number));
    } else if (location.hash === '#exam-preview-title') target = document.getElementById('exam-preview-title');
    if (target) {
      target.focus({ preventScroll: true });
      // Keep the upper controls visible when advancing a whole task, also on mobile.
      const scrollTarget = target.id === groupAnchor(number) ? reader : target;
      scrollTarget.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  };
  const render = (focus = false) => {
    const url = new URL(location.href);
    const taskMode = url.searchParams.get('widok') === 'zadania';
    const requested = url.searchParams.get('zadanie');
    const index = Math.max(0, groups.findIndex(group => group.dataset.number === requested));
    number = groups[index].dataset.number!;
    // Normalize only supplied reader parameters, preserving Astro's history state.
    if (url.searchParams.has('widok') && !taskMode) url.searchParams.delete('widok');
    if (url.searchParams.has('zadanie') && requested !== number) url.searchParams.set('zadanie', number);
    if (taskMode) url.searchParams.set('zadanie', number);
    if (url.href !== location.href) history.replaceState(history.state, '', url);

    reader.hidden = !taskMode;
    pdfPanel.hidden = taskMode;
    if (pdfActions) pdfActions.hidden = taskMode;
    modeButtons.forEach(button => button.setAttribute('aria-pressed', String((button.dataset.readerMode === 'zadania') === taskMode)));
    groups.forEach((group, position) => { group.hidden = position !== index; });
    selects.forEach(select => { select.value = number; });
    reader.querySelectorAll('[data-reader-count]').forEach(count => { count.textContent = `Zadanie ${index + 1} z ${groups.length}`; });
    previous.forEach(button => { button.disabled = index === 0; });
    next.forEach(button => { button.disabled = index === groups.length - 1; });
    if (!taskMode) setPreview(url.searchParams.has('zadanie') ? groups[index].dataset.sheetSrc! : initialPreviewSource);

    indexLinks.forEach(link => {
      link.href = readerUrl('zadania', link.dataset.readerGroup!, link.dataset.readerAnchor!).href;
    });
    practiceLinks.forEach(link => {
      const target = new URL(link.href);
      const returnTo = readerUrl('zadania', link.dataset.readerGroup!, link.dataset.readerAnchor!);
      // The archive back link has already been restricted to local archive filters.
      returnTo.searchParams.delete('powrot');
      if (back && new URL(back.href).search) returnTo.searchParams.set('powrot', new URL(back.href).pathname + new URL(back.href).search);
      target.searchParams.set('powrot', returnTo.pathname + returnTo.search + returnTo.hash);
      link.href = target.pathname + target.search;
    });
    if (focus) focusTarget();
  };
  const navigate = (mode: string, selected: string, hash: string) => {
    const url = readerUrl(mode, selected, hash);
    if (url.href !== location.href) history.pushState(history.state, '', url);
    render(true);
  };
  modeButtons.forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.readerMode!;
    navigate(mode, number, mode === 'zadania' ? groupAnchor(number) : 'exam-preview-title');
  }, { signal }));
  selects.forEach(select => select.addEventListener('change', () => navigate('zadania', select.value, groupAnchor(select.value)), { signal }));
  const move = (offset: number) => {
    const index = groups.findIndex(group => group.dataset.number === number) + offset;
    const selected = groups[index]?.dataset.number;
    if (selected) navigate('zadania', selected, groupAnchor(selected));
  };
  previous.forEach(button => button.addEventListener('click', () => move(-1), { signal }));
  next.forEach(button => button.addEventListener('click', () => move(1), { signal }));
  indexLinks.forEach(link => link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate('zadania', link.dataset.readerGroup!, link.dataset.readerAnchor!);
  }, { signal }));
  window.addEventListener('popstate', () => { if (location.pathname === pathname) render(true); }, { signal });
  modes.hidden = false;
  render(Boolean(location.hash));
});
