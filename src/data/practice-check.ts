import type { PracticeField, TaskPractice } from './task-practice';

/** Decimal canonicalization uses strings, never a floating point approximation. */
export function normalizeAnswer(value: string, field: PracticeField): string | null {
  if (value.length > 1000) return null;
  const text = value.normalize('NFC').trim();
  if (!text) return null;
  if (field.kind === 'single' || field.kind === 'multiple') {
    const values = text.split('|');
    if (values.some(value => !field.options?.some(option => option.value === value)) || new Set(values).size !== values.length) return null;
    if (field.kind === 'single' && values.length !== 1) return null;
    return values.sort().join('|');
  }
  if (field.kind === 'text') {
    const clean = (part: string) => part.trim().replace(/\s+/gu, field.compact ? '' : ' ').toLocaleLowerCase('pl');
    if (!field.unordered) return clean(text);
    const parts = text.split(';').map(clean);
    return parts.every(Boolean) ? parts.sort().join(';') : null;
  }
  const base = field.base ?? 10;
  if (base !== 10) {
    if (!/^[+-]?[\da-z]+$/i.test(text)) return null;
    const negative = text.startsWith('-');
    let total = 0n;
    for (const digit of text.replace(/^[+-]/, '').toLowerCase()) {
      const numeric = parseInt(digit, 36);
      if (numeric >= base) return null;
      total = total * BigInt(base) + BigInt(numeric);
    }
    return (negative ? -total : total).toString();
  }
  // Spaces may separate complete groups of thousands, including nonbreaking spaces.
  if (!/^[+-]?(?:\d+|\d{1,3}(?:[ \u00a0\u202f]\d{3})+)(?:[.,]\d+)?$/.test(text)) return null;
  const compact = text.replace(/[ \u00a0\u202f]/g, '').replace(',', '.');
  const [whole, fraction = ''] = compact.replace(/^[+-]/, '').split('.');
  const integer = whole.replace(/^0+(?=\d)/, '');
  const decimals = fraction.replace(/0+$/, '');
  const result = integer + (decimals ? '.' + decimals : '');
  return compact.startsWith('-') && result !== '0' ? '-' + result : result;
}

export interface PracticeResult {
  correct: boolean;
  inconsistent: boolean;
  fields: Record<string, 'empty' | 'format' | 'correct' | 'incorrect' | 'inconsistent'>;
}
export function checkPractice(practice: TaskPractice, answers: Record<string, string>): PracticeResult {
  const fields = practice.fields ?? [];
  const variants = practice.variants ?? [];
  const normalized = Object.fromEntries(fields.map(field => [field.id, normalizeAnswer(answers[field.id] ?? '', field)]));
  const matches = (field: PracticeField, variant: Record<string, string[]>) => normalized[field.id] !== null &&
    variant[field.id]?.some(answer => normalizeAnswer(answer, field) === normalized[field.id]);
  const correct = fields.length > 0 && variants.some(variant => fields.every(field => matches(field, variant)));
  const states: PracticeResult['fields'] = {};
  for (const field of fields) {
    states[field.id] = !(answers[field.id] ?? '').trim() ? 'empty' : normalized[field.id] === null ? 'format' :
      variants.some(variant => matches(field, variant)) ? 'correct' : 'incorrect';
  }
  const inconsistent = !correct && fields.length > 0 && fields.every(field => states[field.id] === 'correct');
  if (inconsistent) fields.forEach(field => states[field.id] = 'inconsistent');
  return { correct, inconsistent, fields: states };
}
