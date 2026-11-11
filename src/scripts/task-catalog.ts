import { navigate } from 'astro:transitions/client';
import { onPageLoad } from './page-lifecycle';
import { compareTasks, normalizeSearch, sectionNames } from '../data/task-query';
interface Facet { id: string; sections: string[]; topics: string[]; difficulty: string; year: string; kind: string; practice: boolean; search: string }
onPageLoad((signal) => {
  const root = document.querySelector<HTMLElement>('[data-task-catalog]');
  if (root) {
    const form = root.querySelector<HTMLFormElement>('[data-task-filters]')!;
    const list = root.querySelector<HTMLElement>('[data-task-list]')!;
    const rows = [...list.querySelectorAll<HTMLElement>('[data-task-row]')];
    const facets: Facet[] = JSON.parse(root.querySelector('[data-task-facets]')!.textContent!);
    const facetsById = new Map(facets.map(item => [item.id, item]));
    // Share the single search index between result filtering and global facet counts.
    const items = rows.map(row => ({ row, facet: facetsById.get(row.dataset.id!)!, id: row.dataset.id!, number: row.dataset.number!, difficulty: Number(row.dataset.difficulty), points: Number(row.dataset.points), year: Number(row.dataset.year), month: Number(row.dataset.month) }));
    const count = root.querySelector<HTMLElement>('[data-task-count]')!;
    const active = root.querySelector<HTMLElement>('[data-task-active]')!;
    const empty = root.querySelector<HTMLElement>('[data-task-empty]')!;
    const controls = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input,select')];
    const sections = [...form.querySelectorAll<HTMLButtonElement>('[data-task-section]')];
    const topicLinks = [...form.querySelectorAll<HTMLAnchorElement>('[data-topic-choice]')];
    const topicGroup = form.querySelector<HTMLElement>('[data-topic-buttons]')!;
    const allTopics = form.querySelector<HTMLButtonElement>('[data-all-topics]')!;
    const extraFilters = form.querySelector<HTMLDetailsElement>('.task-extra-filters')!;
    const desktopTopics = form.querySelector<HTMLElement>('[data-desktop-topics]')!;
    const mobileTopics = form.querySelector<HTMLElement>('[data-mobile-topics]')!;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const fixedTopic = root.dataset.fixedTopic ?? '';
    const fixedSection = root.dataset.fixedSection ?? '';
    const control = (key: string) => controls.find(control => control.name === key)!;
    const value = (key: string) => key === 'sprawdzanie' ? (control(key) as HTMLInputElement).checked ? '1' : 'all' : control(key).value;
    const fallback = (key: string) => key === 'q' ? '' : key === 'sort' ? 'latwiejsze' : 'all';
    const setValue = (key: string, value: string) => {
      if (key === 'sprawdzanie') (control(key) as HTMLInputElement).checked = value === '1';
      else control(key).value = value;
    };
    let searchTimer: ReturnType<typeof setTimeout>;
    const params = (withTopic = true) => {
      const query = new URLSearchParams();
      for (const item of controls) if ((withTopic || !['dzial', 'temat'].includes(item.name)) && value(item.name) !== fallback(item.name)) query.set(item.name, value(item.name));
      return query;
    };
    const route = (path: string, query: URLSearchParams) => path + (query.size ? '?' + query.toString() : '');
    const updateExtraCount = () => {
      const topic = fixedTopic || value('temat');
      const extra = ['rok', 'rodzaj', 'sprawdzanie', 'sort'].filter(key => value(key) !== fallback(key)).length + (!desktop.matches && topic !== 'all' ? 1 : 0);
      form.querySelector('[data-extra-count]')!.textContent = extra ? `(${extra})` : '';
    };
    const render = () => {
      const words = normalizeSearch(value('q')).trim().split(/\s+/).filter(Boolean);
      const section = fixedTopic ? fixedSection : value('dzial');
      const topic = fixedTopic || value('temat');
      setValue('dzial', section);
      const matchesOther = (item: Facet) => (value('trudnosc') === 'all' || item.difficulty === value('trudnosc')) && (value('rok') === 'all' || item.year === value('rok')) && (value('rodzaj') === 'all' || item.kind === value('rodzaj')) && (value('sprawdzanie') !== '1' || item.practice) && words.every(word => item.search.includes(word));
      const available = facets.filter(matchesOther);
      for (const button of sections) {
        const id = button.dataset.taskSection!;
        button.setAttribute('aria-pressed', String(id === section));
        button.querySelector('[data-section-count]')!.textContent = String(id === 'all' ? available.length : available.filter(item => item.sections.includes(id)).length);
      }
      topicGroup.hidden = section === 'all';
      allTopics.setAttribute('aria-pressed', String(topic === 'all'));
      for (const link of topicLinks) {
        link.hidden = link.dataset.topicSection !== section;
        if (link.dataset.topicChoice === topic) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
        link.querySelector('[data-topic-count]')!.textContent = String(available.filter(item => item.topics.includes(link.dataset.topicChoice!)).length);
        link.href = route(`/zadania/tematy/${link.dataset.topicChoice}/`, params(false));
      }
      [...items].sort((a, b) => compareTasks(a, b, value('sort'))).forEach(({ row }) => list.append(row));
      let visible = 0;
      for (const { row, facet: item } of items) {
        row.hidden = !(matchesOther(item) && (section === 'all' || item.sections.includes(section)) && (topic === 'all' || item.topics.includes(topic)));
        if (!row.hidden) visible++;
        const link = row.querySelector<HTMLAnchorElement>('[data-task-link]')!;
        const url = new URL(link.href);
        url.searchParams.set('powrot', location.pathname + location.search);
        link.href = url.pathname + url.search;
      }
      count.textContent = `Liczba zadań: ${visible}`;
      empty.hidden = visible !== 0;
      const labels: string[] = [];
      if (section !== 'all') labels.push(sectionNames[section]);
      if (topic !== 'all') labels.push(topicLinks.find(link => link.dataset.topicChoice === topic)!.dataset.topicName!);
      for (const item of controls) {
        if (['sort', 'dzial', 'temat'].includes(item.name) || value(item.name) === fallback(item.name)) continue;
        labels.push(item instanceof HTMLSelectElement ? item.selectedOptions[0].text : item.name === 'sprawdzanie' ? 'Ze sprawdzaniem odpowiedzi' : `Szukasz: ${item.value}`);
      }
      active.textContent = labels.length ? `Aktywne filtry: ${labels.join(' · ')}` : '';
      active.hidden = labels.length === 0;
      updateExtraCount();
    };
    const restore = () => {
      clearTimeout(searchTimer);
      const query = new URLSearchParams(location.search);
      for (const item of controls) {
        const next = query.get(item.name) ?? fallback(item.name);
        setValue(item.name, item instanceof HTMLSelectElement && ![...item.options].some(option => option.value === next) ? fallback(item.name) : next);
      }
      if (!sections.some(button => button.dataset.taskSection === value('dzial'))) setValue('dzial', 'all');
      const topic = topicLinks.find(link => link.dataset.topicChoice === value('temat'));
      if (fixedTopic || !topic) setValue('temat', 'all');
      else setValue('dzial', topic.dataset.topicSection!);
      if (fixedTopic) setValue('dzial', fixedSection);
      // Drop invalid/unknown state so refreshes and shared links describe the displayed results.
      const clean = route(location.pathname, params(!fixedTopic));
      if (clean !== location.pathname + location.search) history.replaceState(history.state, '', clean);
      render();
    };
    const save = () => {
      clearTimeout(searchTimer);
      const url = route(location.pathname, params(!fixedTopic));
      if (url !== location.pathname + location.search) history.pushState(history.state, '', url);
      render();
    };
    const selectSection = (id: string) => {
      if (fixedTopic) {
        const query = params(false);
        if (id !== 'all') query.set('dzial', id);
        void navigate(route('/zadania/', query));
        return;
      }
      setValue('dzial', id); setValue('temat', 'all'); save();
    };
    sections.forEach(button => button.addEventListener('click', () => selectSection(button.dataset.taskSection!)));
    topicLinks.forEach(link => link.addEventListener('click', event => {
      if (fixedTopic || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setValue('temat', link.dataset.topicChoice!); setValue('dzial', link.dataset.topicSection!); save();
    }));
    allTopics.addEventListener('click', () => {
      if (fixedTopic) { const query = params(false); query.set('dzial', fixedSection); void navigate(route('/zadania/', query)); return; }
      setValue('temat', 'all'); save();
    });
    // Move the same topic links between layouts so selection and handlers stay intact.
    const arrangeTopics = () => {
      const focused = topicGroup.contains(document.activeElement) ? document.activeElement as HTMLElement : null;
      (desktop.matches ? desktopTopics : mobileTopics).append(topicGroup);
      if (focused) {
        if (!desktop.matches) extraFilters.open = true;
        focused.focus({ preventScroll: true });
      }
      updateExtraCount();
    };
    desktop.addEventListener('change', arrangeTopics, { signal });
    signal.addEventListener('abort', () => clearTimeout(searchTimer), { once: true });
    form.hidden = false;
    form.addEventListener('submit', event => { event.preventDefault(); save(); });
    form.addEventListener('change', event => {
      if ((event.target as HTMLSelectElement).name === 'dzial') selectSection(value('dzial'));
      else save();
    });
    form.addEventListener('input', event => {
      if ((event.target as HTMLInputElement).name !== 'q') return;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => save(), 250);
    });
    form.addEventListener('reset', event => {
      event.preventDefault();
      clearTimeout(searchTimer);
      controls.forEach(item => setValue(item.name, fallback(item.name)));
      save();
    });
    const pathname = location.pathname;
    window.addEventListener('popstate', () => { if (location.pathname === pathname) restore(); }, { signal });
    restore();
    arrangeTopics();
  }

});
