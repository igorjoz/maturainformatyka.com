import catalog from './exams.json';

export type Formula = '2023' | '2015' | 'starsza';
export type ExamKind = 'glowny' | 'dodatkowy' | 'probny' | 'pokazowy';
export interface ExamFile {
  kind: 'sheet' | 'grading' | 'data' | 'extra' | 'bundle';
  label: string;
  path: string;
  source: string | null;
  size: number;
  sha256: string;
  part?: number;
}
export interface Exam {
  id: string;
  slug: string;
  year: number;
  month: number;
  formula: Formula;
  formulaLabel: string;
  level: 'podstawowy' | 'rozszerzony';
  kind: ExamKind;
  sessionLabel: string;
  sourcePages: string[];
  files: ExamFile[];
  missing: string[];
  bundle: ExamFile;
}
export const formulas = { '2023': 'Formuła 2023', '2015': 'Formuła 2015', starsza: 'Starsze formuły' };
export const examKinds = { glowny: 'Termin główny', dodatkowy: 'Termin dodatkowy', probny: 'Matura próbna', pokazowy: 'Arkusz pokazowy' };
export const exams = (catalog as Exam[]).toSorted((a, b) => b.year - a.year || b.month - a.month || a.slug.localeCompare(b.slug));
export const examTitle = (exam: Exam) => `Informatyka ${exam.year} — ${exam.sessionLabel}, ${exam.formulaLabel}, poziom ${exam.level}`;
export const examDescription = (exam: Exam) => `Matura z informatyki ${exam.year}: ${exam.sessionLabel.toLocaleLowerCase('pl')}, ${exam.formulaLabel}, poziom ${exam.level}. Arkusze PDF, zasady oceniania i dane do zadań do pobrania${exam.missing.length ? ' — sprawdź dostępność materiałów' : ' w jednym miejscu'}.`;
export const fileSize = (bytes: number) => bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toLocaleString('pl', { maximumFractionDigits: 1 })} MB`;
export const fileFormat = (file: ExamFile) => file.path.split('.').at(-1)!.toUpperCase();
