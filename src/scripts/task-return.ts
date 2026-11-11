import topics from '../data/task-topics.json' with { type: 'json' };
import { validReaderHash, type ExamTaskLocation } from '../data/exam-reader';

/** A return can carry archive filters once, never another chain of task URLs. */
export function safeTaskReturn(value: string | null, origin: string, examPath: string, examTasks: readonly ExamTaskLocation[] = []): string | null {
  if (!value || value.length > 2000) return null;
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin) return null;
    const topicPaths = new Set(topics.map(topic => `/zadania/tematy/${topic.id}/`));
    if (url.pathname === '/zadania/' || topicPaths.has(url.pathname)) {
      for (const key of [...url.searchParams.keys()]) if (!['q','dzial','temat','trudnosc','rok','rodzaj','sort','sprawdzanie'].includes(key)) url.searchParams.delete(key);
      return url.pathname + url.search;
    }
    if (url.pathname !== examPath) return null;
    const result = new URL(url.pathname, origin);
    const parentNumber = url.searchParams.get('zadanie');
    if (parentNumber && examTasks.some(task => task.parentNumber === parentNumber)) {
      if (url.searchParams.get('widok') === 'zadania') result.searchParams.set('widok', 'zadania');
      result.searchParams.set('zadanie', parentNumber);
      if (validReaderHash(url.hash, parentNumber, examTasks)) result.hash = url.hash;
    }
    const nested = url.searchParams.get('powrot');
    if (nested && nested.length < 1000) {
      const archive = new URL(nested, origin);
      if (archive.origin === origin && archive.pathname === '/arkusze/') {
        for (const key of [...archive.searchParams.keys()]) if (!['formula','year','level','kind'].includes(key)) archive.searchParams.delete(key);
        result.searchParams.set('powrot', archive.pathname + archive.search);
      }
    }
    return result.pathname + result.search + result.hash;
  } catch { return null; }
}

export function restoreTaskReturn() {
  const back = document.querySelector<HTMLAnchorElement>('[data-task-back]');
  const exam = document.querySelector<HTMLAnchorElement>('.task-exam-link');
  if (!back || !exam) return;
  const examTasks: ExamTaskLocation[] = JSON.parse(exam.dataset.examTasks ?? '[]');
  const returnTo = safeTaskReturn(new URLSearchParams(location.search).get('powrot'), location.origin, new URL(exam.href).pathname, examTasks);
  if (!returnTo) return;
  back.href = returnTo;
  if (returnTo.startsWith('/arkusze/')) {
    back.textContent = '← Arkusz';
    exam.href = returnTo;
  }
  document.querySelectorAll<HTMLAnchorElement>('[data-related-task]').forEach(link => {
    const url = new URL(link.href);
    url.searchParams.set('powrot', returnTo);
    link.href = url.pathname + url.search;
  });
}
