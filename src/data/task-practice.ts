/** Reviewed answer keys. Imported by the build; only the current task is serialized. */
export interface PracticeOption { value: string; label: string; selector?: string }
export interface PracticeField {
  id: string;
  label: string;
  kind: 'number' | 'text' | 'single' | 'multiple';
  target: string;
  base?: number;
  unordered?: boolean;
  compact?: boolean;
  options?: PracticeOption[];
}
export interface TaskPractice {
  id: string;
  mode: 'interactive' | 'manual';
  reason: string;
  note?: string;
  gradingSha256: string;
  fields?: PracticeField[];
  variants?: Record<string, string[]>[];
}
const modules = import.meta.glob<{ default: TaskPractice }>('./task-practice/*.json', { eager: true });
const records = new Map(Object.values(modules).map(module => [module.default.id, module.default]));
export const getTaskPractice = (id: string) => records.get(id);
export const hasTaskPractice = (id: string) => records.get(id)?.mode === 'interactive';
