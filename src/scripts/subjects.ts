/** Progressive enhancement: all topics remain ordinary sections without JavaScript. */
export function initSubjects() {
  document.querySelectorAll<HTMLElement>('[data-subject-group]').forEach(group => {
    const tablist = group.querySelector<HTMLElement>('[data-subject-tabs]');
    const tabs = [...group.querySelectorAll<HTMLButtonElement>('[data-subject-target]')];
    const panels = [...group.querySelectorAll<HTMLElement>('[data-subject-panel]')];
    if (!tablist || !tabs.length || tabs.length !== panels.length || group.classList.contains('subjects-enhanced')) return;

    const select = (index: number) => {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].setAttribute('aria-hidden', String(!selected));
        panels[i].inert = !selected;
        panels[i].tabIndex = selected ? 0 : -1;
      });
    };
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-labelledby', group.querySelector('h3')!.id);
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next: number;
        switch (event.key) {
          case 'ArrowRight': next = (index + 1) % tabs.length; break;
          case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
          case 'Home': next = 0; break;
          case 'End': next = tabs.length - 1; break;
          default: return;
        }
        event.preventDefault();
        select(next);
        tabs[next].focus({ preventScroll: true });
      });
    });
    select(0);
    group.classList.add('subjects-enhanced');
    tablist.hidden = false;
  });
}
