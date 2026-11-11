export const difficultyNames: Record<number, string> = { 1: 'Łatwe', 2: 'Średnie', 3: 'Trudne' };
export const sectionNames: Record<string, string> = {
  programowanie: 'Programowanie', algorytmika: 'Algorytmika',
  'arkusze-kalkulacyjne': 'Arkusze kalkulacyjne', 'bazy-danych': 'Bazy danych', teoria: 'Teoria',
};
export function normalizeSearch(text: string): string {
  return text.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
}
export interface SortableTask {
  id: string; number: string; difficulty: number; points: number; year: number; month: number;
}
const orderNumber = (a: string, b: string) => a.localeCompare(b, 'pl', { numeric: true });
export function compareTasks(a: SortableTask, b: SortableTask, sort = 'latwiejsze'): number {
  const newest = b.year - a.year || b.month - a.month;
  const tie = newest || a.id.replace(/-\d+(?:-\d+)?$/, '').localeCompare(b.id.replace(/-\d+(?:-\d+)?$/, '')) || orderNumber(a.number, b.number);
  switch (sort) {
    case 'trudniejsze': return b.difficulty - a.difficulty || tie;
    case 'najnowsze': return tie;
    case 'najstarsze': return -newest || orderNumber(a.number, b.number) || a.id.localeCompare(b.id);
    case 'punkty': return a.points - b.points || tie;
    default: return a.difficulty - b.difficulty || tie;
  }
}
