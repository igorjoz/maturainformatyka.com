import { onPageLoad } from './page-lifecycle';
import { animateStudyDisclosures } from './study-disclosures';
onPageLoad((signal) => {
  const root = document.querySelector<HTMLElement>('[data-study-guide]');
  if (root) {
   animateStudyDisclosures(root, signal);
   const key = 'matura:2027:study:v1';
   const selects = [...root.querySelectorAll<HTMLSelectElement>('[data-skill-select]')];
   const checks = [...root.querySelectorAll<HTMLInputElement>('[data-study-check]')];
   const paths = [...root.querySelectorAll<HTMLButtonElement>('[data-path-choice]')];
   type Status = 'learn' | 'review' | 'done';
   let state: {version:1;skills:Record<string,Status>;checks:Record<string,boolean>;path:string} = {version:1,skills:{},checks:{},path:''};
   const notice = root.querySelector<HTMLElement>('[data-study-storage]')!;
   const fail = () => { notice.textContent = 'Zapis jest niedostępny. Zmiany działają tylko do opuszczenia tej strony.'; };
   try {
    const stored = localStorage.getItem(key);
    if (stored) {
     const data = JSON.parse(stored);
     if (data?.version === 1 && data.skills && data.checks) {
      for (const el of selects) {const id=el.dataset.skillSelect!; if (['learn','review','done'].includes(data.skills[id])) state.skills[id]=data.skills[id];}
      for (const el of checks) {const id=el.dataset.studyCheck!;state.checks[id]=data.checks[id]===true;}
      state.path=paths.some(p=>p.dataset.pathChoice===data.path)?data.path:'';
     }
    }
    localStorage.setItem(key,JSON.stringify(state));
   } catch { fail(); }
   const save = () => {try {localStorage.setItem(key,JSON.stringify(state));}catch {fail();}};
   const render = () => {
    for (const el of selects) {
     const id=el.dataset.skillSelect!, value=state.skills[id]||'learn';el.value=value;
     el.dataset.status=value;
    }
    const done=selects.filter(s=>state.skills[s.dataset.skillSelect!]==='done').length;
    const review=selects.filter(s=>state.skills[s.dataset.skillSelect!]==='review').length;
    root.querySelector('[data-study-total]')!.textContent=`${done} z ${selects.length} opanowanych`;
    root.querySelector<HTMLProgressElement>('[data-study-progress]')!.value=done;
    root.querySelector('[data-study-counts]')!.textContent=`Do nauki: ${selects.length-done-review} · Do powtórki: ${review}`;
    for (const section of root.querySelectorAll<HTMLElement>('[data-study-section]')) {
     const ids=[...section.querySelectorAll<HTMLElement>('[data-skill]')].map(s=>s.dataset.skill!);
     const count=section.querySelector<HTMLElement>('[data-section-count]')!;count.hidden=false;count.textContent=`${ids.filter(id=>state.skills[id]==='done').length} / ${ids.length}`;
    }
    checks.forEach(el=>el.checked=state.checks[el.dataset.studyCheck!]||false);
    paths.forEach(el=>{const active=el.dataset.pathChoice===state.path;el.setAttribute('aria-pressed',String(active));el.textContent=active?'Twoja wybrana ścieżka ✓':'Wybieram tę ścieżkę';el.closest<HTMLElement>('[data-path]')!.dataset.selected=String(active);});
   };
   root.querySelectorAll<HTMLElement>('[data-study-controls]').forEach(el=>el.hidden=false);
   checks.forEach(el=>{el.disabled=false;el.addEventListener('change',()=>{state.checks[el.dataset.studyCheck!]=el.checked;save();});});
   selects.forEach(el=>el.addEventListener('change',()=>{state.skills[el.dataset.skillSelect!]=el.value as Status;render();save();root.querySelector('[data-study-announcement]')!.textContent=root.querySelector('[data-study-total]')!.textContent;}));
   paths.forEach(el=>el.addEventListener('click',()=>{state.path=el.dataset.pathChoice!;render();save();}));
   root.querySelector('[data-study-reset]')!.addEventListener('click',()=>{if(confirm('Wyzerować samoocenę, wybraną ścieżkę i checklistę?')){state={version:1,skills:{},checks:{},path:''};render();save();}});
   const print=root.querySelector<HTMLButtonElement>('[data-study-print]')!;print.hidden=false;print.addEventListener('click',()=>window.print());
   let openBeforePrint:HTMLDetailsElement[]=[];
   window.addEventListener('beforeprint',()=>{openBeforePrint=[...root.querySelectorAll<HTMLDetailsElement>('details:not([open])')];openBeforePrint.forEach(el=>el.open=true);}, { signal });
   window.addEventListener('afterprint',()=>openBeforePrint.forEach(el=>el.open=false), { signal });
   render();
  }
  function revealFragment(){let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(!id)return;const target=document.getElementById(id);if(target instanceof HTMLDetailsElement)target.open=true;}
  window.addEventListener('hashchange',revealFragment, { signal });revealFragment();

});
