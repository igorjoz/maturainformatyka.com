import { onPageLoad } from './page-lifecycle';
import type { PracticeField, TaskPractice } from '../data/task-practice';
import { checkPractice } from '../data/practice-check';

onPageLoad((signal) => {
  const data = document.querySelector<HTMLScriptElement>('#task-practice-data');
  const form = document.querySelector<HTMLFormElement>('[data-practice-form]');
  if (data && form) {
    const practice: TaskPractice = JSON.parse(data.textContent!);
    const command = form.querySelector<HTMLElement>('#task-command-content')!;
    const actions = form.querySelector<HTMLElement>('[data-practice-actions]')!;
    const status = actions.querySelector<HTMLElement>('[data-practice-status]')!;
    const confetti = actions.querySelector<HTMLElement>('[data-practice-confetti]')!;
    const grading = document.querySelector<HTMLDetailsElement>('.task-grading')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fields = practice.fields!;
    const mounts = new Map<string, { target: HTMLElement; feedback: HTMLElement; inputs: HTMLInputElement[] }>();
    let lastSignature = '';
    let effectTimer: ReturnType<typeof setTimeout>;
    let inconsistent = false;
    // Check the entire mounting contract before modifying the readable original.
    const ready = fields.every(field => command.querySelectorAll(field.target).length === 1 &&
      (field.options ?? []).every(option => !option.selector || command.querySelector(field.target)!.querySelectorAll(option.selector).length === 1));
    if (ready) {
      for (const field of fields) {
        const target = command.querySelector<HTMLElement>(field.target)!;
        const controls: HTMLInputElement[] = [];
        const feedback = document.createElement('span');
        feedback.className = 'practice-field-feedback';
        feedback.id = `practice-feedback-${field.id}`;
        feedback.hidden = true;
        target.classList.add('practice-field');
        const choice = field.kind === 'single' || field.kind === 'multiple';
        const hint = field.unordered ? 'Oddziel odpowiedzi średnikami; kolejność dowolna.' :
          field.kind === 'number' && field.base && field.base !== 10 ? `System liczbowy: ${field.base}.` : '';
        const hintNode = document.createElement('span');
        hintNode.id = `practice-hint-${field.id}`;
        hintNode.className = 'practice-field-hint';
        hintNode.textContent = hint;
        const inputFor = (type: string, suffix = '') => {
          const input = document.createElement('input');
          input.type = type;
          input.id = `practice-${field.id}${suffix}`;
          input.name = field.id;
          input.autocomplete = 'off';
          input.setAttribute('aria-describedby', [feedback.id, hint ? hintNode.id : ''].filter(Boolean).join(' '));
          controls.push(input);
          return input;
        };
        if (choice) {
          if (!field.options!.some(option => option.selector)) target.replaceChildren();
          for (const option of field.options!) {
            const slot = option.selector ? target.querySelector<HTMLElement>(option.selector)! : document.createElement('span');
            const input = inputFor(field.kind === 'single' ? 'radio' : 'checkbox', `-${option.value}`);
            input.value = option.value;
            input.setAttribute('aria-label', `${field.label} — ${option.label}${option.selector && target.matches('ol') ? ': ' + target.querySelector(option.selector)!.textContent : ''}`);
            const label = document.createElement('label');
            label.className = 'practice-choice';
            const content = document.createElement('span');
            if (option.selector && slot.textContent?.trim() !== '□') content.append(...slot.childNodes);
            else if (option.selector) { slot.replaceChildren(); content.textContent = option.label; }
            else content.textContent = option.label;
            label.append(input, content);
            slot.append(label);
            if (!option.selector) target.append(slot);
          }
        } else {
          const input = inputFor('text');
          input.maxLength = 1000;
          input.spellcheck = false;
          input.className = 'practice-input';
          if (field.kind === 'number' && (field.base ?? 10) <= 10) input.inputMode = 'decimal';
          const label = document.createElement('label');
          label.htmlFor = input.id;
          label.textContent = field.label;
          label.className = ['TD','TH','SPAN'].includes(target.tagName) ? 'sr-only' : 'practice-label';
          target.replaceChildren(label, input);
        }
        // Keep HTML table structure intact when a whole P/F row is the anchor.
        const messageSlot = target.matches('tr') ? target.lastElementChild! : target;
        if (hint) messageSlot.append(hintNode);
        messageSlot.append(feedback);
        mounts.set(field.id, { target, feedback, inputs: controls });
      }
      const stopEffects = () => {
        clearTimeout(effectTimer);
        confetti.replaceChildren();
        status.classList.remove('practice-success');
        mounts.forEach(({ target }) => target.classList.remove('practice-shake'));
      };
      const clearField = (id: string) => {
        const mount = mounts.get(id)!;
        delete mount.target.dataset.state;
        mount.feedback.hidden = true;
        mount.inputs.forEach(input => input.removeAttribute('aria-invalid'));
      };
      const read = (field: PracticeField) => {
        const inputs = mounts.get(field.id)!.inputs;
        return field.kind === 'single' || field.kind === 'multiple' ? inputs.filter(input => input.checked).map(input => input.value).sort().join('|') : inputs[0].value;
      };
      const celebrate = () => {
        if (reduced.matches) return;
        status.classList.add('practice-success');
        for (let index = 0; index < 32; index++) {
          const piece = document.createElement('i');
          piece.style.setProperty('--x', `${(index * 47 % 100)}%`);
          piece.style.setProperty('--drift', `${(index % 2 ? 1 : -1) * (20 + index % 8 * 9)}px`);
          piece.style.setProperty('--turn', `${180 + index * 35}deg`);
          piece.style.setProperty('--delay', `${index % 5 * 25}ms`);
          piece.style.setProperty('--piece-color', ['#54726a', '#c17236', '#367ea0', '#bb8d26'][index % 4]);
          confetti.append(piece);
        }
        effectTimer = setTimeout(stopEffects, 1300);
      };
      actions.hidden = false;
      form.dataset.practiceReady = 'true';
      form.addEventListener('submit', event => {
        event.preventDefault();
        const answers = Object.fromEntries(fields.map(field => [field.id, read(field)]));
        const signature = JSON.stringify(answers);
        const animate = signature !== lastSignature;
        lastSignature = signature;
        stopEffects();
        const result = checkPractice(practice, answers);
        inconsistent = result.inconsistent;
        for (const field of fields) {
          const state = result.fields[field.id];
          const mount = mounts.get(field.id)!;
          const message = state === 'correct' ? '✓ Poprawnie' : state === 'incorrect' ? '✕ Spróbuj ponownie' :
            state === 'inconsistent' ? '↔ Sprawdź zgodność zestawu' : state === 'empty' ? 'Uzupełnij odpowiedź.' :
            field.kind === 'number' ? `Wpisz liczbę${field.base && field.base !== 10 ? ` w systemie ${field.base}` : '; część dziesiętną oddziel przecinkiem lub kropką'}.` : 'Sprawdź format odpowiedzi.';
          mount.target.dataset.state = state;
          mount.feedback.textContent = message;
          mount.feedback.hidden = false;
          mount.inputs.forEach(input => input.setAttribute('aria-invalid', String(state !== 'correct')));
          if (animate && !reduced.matches && ['incorrect','inconsistent'].includes(state)) mount.target.classList.add('practice-shake');
        }
        const count = Object.values(result.fields).filter(state => state === 'correct').length;
        const incomplete = Object.values(result.fields).some(state => state === 'empty' || state === 'format');
        status.dataset.state = result.correct ? 'correct' : incomplete ? 'format' : 'incorrect';
        status.textContent = result.correct ? '✓ Świetnie! Wszystkie sprawdzane odpowiedzi zgadzają się z kluczem CKE.' :
          result.inconsistent ? '↔ Te wartości pochodzą z różnych wariantów. Sprawdź, czy cały zestaw odpowiedzi jest ze sobą zgodny.' :
          incomplete ? `Uzupełnij zaznaczone pola i sprawdź ich format. Poprawne odpowiedzi: ${count} z ${fields.length}.` :
          `✕ Jeszcze nie wszystko się zgadza. Poprawne odpowiedzi: ${count} z ${fields.length}. Popraw zaznaczone pola i spróbuj ponownie.`;
        if (result.correct && animate) celebrate();
        if (!result.correct) {
          const first = fields.find(field => result.fields[field.id] !== 'correct')!;
          mounts.get(first.id)!.inputs[0].focus({ preventScroll: true });
        }
      });
      const edited = (event: Event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || !mounts.has(input.name)) return;
        stopEffects();
        if (inconsistent) fields.forEach(field => clearField(field.id));
        else clearField(input.name);
        inconsistent = false;
        status.textContent = '';
        delete status.dataset.state;
      };
      form.addEventListener('input', edited);
      form.addEventListener('change', edited);
      actions.querySelector('[data-show-answer]')!.addEventListener('click', () => {
        grading.open = true;
        grading.querySelector('summary')!.focus({ preventScroll: true });
        grading.scrollIntoView({ block: 'nearest', behavior: reduced.matches ? 'instant' : 'smooth' });
      });
      form.addEventListener('reset', () => {
        stopEffects();
        lastSignature = '';
        inconsistent = false;
        fields.forEach(field => clearField(field.id));
        status.textContent = '';
        delete status.dataset.state;
        grading.open = false;
      });
      reduced.addEventListener('change', () => { if (reduced.matches) stopEffects(); }, { signal });
      signal.addEventListener('abort', stopEffects, { once: true });
    }
  }

});
