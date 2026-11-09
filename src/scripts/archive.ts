const form = document.querySelector<HTMLFormElement>('[data-archive-filters]');
if (form) {
  const keys = ['formula', 'year', 'level', 'kind'] as const;
  const rows = [...document.querySelectorAll<HTMLElement>('[data-exam-row]')];
  const count = document.querySelector<HTMLElement>('[data-archive-count]');
  const empty = document.querySelector<HTMLElement>('[data-archive-empty]');
  const select = (key: typeof keys[number]) => form.elements.namedItem(key) as HTMLSelectElement;
  const render = () => {
    let visible = 0;
    for (const row of rows) {
      row.hidden = !keys.every(key => select(key).value === 'all' || row.dataset[key] === select(key).value);
      if (!row.hidden) visible++;
    }
    if (count) count.textContent = `Liczba zestawów: ${visible}`;
    if (empty) empty.hidden = visible !== 0;
    document.querySelectorAll<HTMLAnchorElement>('[data-exam-detail]').forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set('powrot', location.pathname + location.search);
      link.href = url.pathname + url.search;
    });
  };
  const restore = () => {
    const params = new URLSearchParams(location.search);
    for (const key of keys) {
      const value = params.get(key) ?? (key === 'formula' ? '2023' : 'all');
      const control = select(key);
      control.value = [...control.options].some(option => option.value === value) ? value : key === 'formula' ? '2023' : 'all';
    }
    render();
  };
  const save = () => {
    const url = new URL(location.href);
    for (const key of keys) {
      const value = select(key).value;
      if (value === (key === 'formula' ? '2023' : 'all')) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    if (url.href !== location.href) history.pushState(null, '', url);
    render();
  };
  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('change', save);
  form.addEventListener('reset', event => {
    event.preventDefault();
    keys.forEach(key => select(key).value = 'all');
    save();
  });
  window.addEventListener('popstate', restore);
  restore();
}
