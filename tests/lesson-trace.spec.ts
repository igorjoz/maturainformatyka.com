import { expect, test } from '@playwright/test';
import { createLessonTrace, type LessonAlgorithm } from '../src/scripts/lesson-trace';

const examples: { algorithm: LessonAlgorithm; values: number[]; result: number; highlighted: number[]; lines: number }[] = [
  { algorithm: 'parity', values: [3, 8, 5, 12, 7, 4], result: 3, highlighted: [1, 3, 5], lines: 8 },
  { algorithm: 'kadane', values: [-2, 3, -1, 4, -5, 2], result: 6, highlighted: [1, 2, 3], lines: 13 },
  { algorithm: 'lis', values: [3, 1, 5, 2, 6, 4, 9], result: 4, highlighted: [1, 3, 5, 6], lines: 12 },
];

for (const example of examples) {
  test(`the ${example.algorithm} trace matches its example and references its code`, () => {
    const input = Object.freeze([...example.values]);
    const steps = createLessonTrace(example.algorithm, input);
    expect(steps.length).toBeGreaterThan(2);
    expect(steps[0].result).toBeNull();
    expect(steps.at(-1)?.result).toBe(example.result);
    expect(steps.at(-1)?.highlightedIndices).toEqual(example.highlighted);
    expect(steps.filter(step => step.result !== null)).toHaveLength(1);
    expect(input).toEqual(example.values);
    for (const step of steps) {
      expect(step.explanation.length).toBeGreaterThan(10);
      expect(step.codeLines.length).toBeGreaterThan(0);
      expect(step.codeLines.every(line => Number.isInteger(line) && line >= 1 && line <= example.lines)).toBe(true);
      for (const indices of [step.activeIndices, step.comparedIndices, step.highlightedIndices]) {
        expect(indices.every(index => Number.isInteger(index) && index >= 0 && index < input.length)).toBe(true);
        expect(new Set(indices).size).toBe(indices.length);
      }
    }
  });
}

test('parity counting handles zero, negative even numbers, and empty input', () => {
  expect(createLessonTrace('parity', [-4, -3, 0, 1, 2]).at(-1)?.result).toBe(3);
  expect(createLessonTrace('parity', []).at(-1)?.result).toBe(0);
});

test('Kadane selects a nonempty subarray for all-negative input', () => {
  for (const values of [[-8, -3, -5], [-1], [0], [4, -1, 2, -8, 3]]) {
    const last = createLessonTrace('kadane', values).at(-1)!;
    const sums = values.flatMap((_, start) => values.slice(start).map((_, offset) => values.slice(start, start + offset + 1).reduce((sum, value) => sum + value, 0)));
    expect(last.result).toBe(Math.max(...sums));
    expect(last.highlightedIndices.length).toBeGreaterThan(0);
    expect(last.highlightedIndices.map(index => values[index]).reduce((sum, value) => sum + value, 0)).toBe(last.result);
    expect(last.highlightedIndices.at(-1)! - last.highlightedIndices[0] + 1).toBe(last.highlightedIndices.length);
  }
});

test('LIS preserves strict ordering, input order, and the correct length on ties', () => {
  for (const values of [[2, 2, 2], [4, 3, 2, 1], [1, 2, 2, 3], [1], [3, 1, 5, 2, 6, 4, 9]]) {
    const last = createLessonTrace('lis', values).at(-1)!;
    // Independent exhaustive subsequence oracle for these small inputs.
    let longest = 0;
    for (let mask = 1; mask < 2 ** values.length; mask++) {
      const selected = values.filter((_, index) => mask & (1 << index));
      if (selected.every((value, index) => index === 0 || value > selected[index - 1])) longest = Math.max(longest, selected.length);
    }
    expect(last.result).toBe(longest);
    expect(last.highlightedIndices).toHaveLength(longest);
    expect(last.highlightedIndices.every((index, position, indices) => position === 0 || (index > indices[position - 1] && values[index] > values[indices[position - 1]]))).toBe(true);
  }
});

test('snapshots retain previous values and do not share arrays', () => {
  for (const { algorithm, values } of examples) {
    const steps = createLessonTrace(algorithm, values);
    for (let index = 1; index < steps.length; index++) {
      expect(steps[index].activeIndices).not.toBe(steps[index - 1].activeIndices);
      expect(steps[index].highlightedIndices).not.toBe(steps[index - 1].highlightedIndices);
      expect(steps[index].codeLines).not.toBe(steps[index - 1].codeLines);
    }
    const saved = JSON.stringify(steps[0]);
    steps.at(-1)!.highlightedIndices.push(99);
    if (Array.isArray(steps.at(-1)!.variables.lengths)) (steps.at(-1)!.variables.lengths as number[]).fill(99);
    expect(JSON.stringify(steps[0])).toBe(saved);
  }
  const lis = createLessonTrace('lis', [3, 1, 5, 2, 6, 4, 9]);
  expect(lis[0].variables.lengths).toEqual([1, 1, 1, 1, 1, 1, 1]);
  expect(lis.at(-1)?.variables.lengths).toEqual([1, 1, 2, 2, 3, 3, 4]);
});

test('invalid data is rejected before a trace is generated', () => {
  expect(() => createLessonTrace('kadane', [])).toThrow(/nonempty/);
  expect(() => createLessonTrace('lis', [])).toThrow(/nonempty/);
  expect(() => createLessonTrace('parity', [Number.NaN])).toThrow(/finite/);
});
