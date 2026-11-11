import type { ReactNode } from 'react';

export interface TaskGradingProps {
  id?: string;
  answerStatus: 'provided' | 'not-provided';
  sourceHref: string;
  sourcePage: number;
  editorialNote?: string;
  children?: ReactNode;
}

/** Build-time presentation only: native details works without hydration or client JavaScript. */
export default function TaskGrading({ id = 'odpowiedz-cke', answerStatus, sourceHref, sourcePage, editorialNote, children }: TaskGradingProps) {
  return (
    <details className="task-grading" id={id}>
      <summary><span>Pokaż odpowiedź i ocenianie CKE</span><svg className="grading-chevron" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg></summary>
      <div className="task-grading-content task-rich-text" data-task-grading="">
        {answerStatus === 'not-provided' && <p className="task-no-answer" data-answer-unavailable="">CKE nie podaje w tym materiale gotowej odpowiedzi. Poniżej znajdziesz oficjalne kryteria oceniania.</p>}
        {editorialNote && <aside className="task-grading-note"><h2>Uwaga redakcyjna o źródle</h2><p>{editorialNote}</p></aside>}
        {children}
        <section className="task-grading-source" aria-label="Źródło oceniania">
          <h2>Źródło</h2>
          <a className="text-link" data-grading-source="" href={sourceHref} target="_blank" rel="noopener">Oryginalne zasady oceniania CKE — PDF, strona {sourcePage}</a>
        </section>
      </div>
    </details>
  );
}
