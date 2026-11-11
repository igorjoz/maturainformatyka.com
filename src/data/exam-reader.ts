/** Small, public navigation metadata; never includes commands or answer keys. */
export interface ExamTaskLocation {
  number: string;
  parentNumber: string;
}

export const subtaskAnchor = (number: string) => `podpunkt-${number.replaceAll('.', '-')}`;
export const groupAnchor = (number: string) => `zadanie-${number}`;

export function validReaderHash(hash: string, parentNumber: string, tasks: readonly ExamTaskLocation[]): boolean {
  return hash === '#exam-preview-title' || hash === `#${groupAnchor(parentNumber)}` ||
    tasks.some(task => task.parentNumber === parentNumber && hash === `#${subtaskAnchor(task.number)}`);
}
