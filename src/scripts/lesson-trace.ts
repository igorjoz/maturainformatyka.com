/** Logical execution steps for the three fixed lesson examples, not a Python interpreter. */
export type LessonAlgorithm = 'parity' | 'kadane' | 'lis';

export interface LessonStep {
  activeIndices: number[];
  comparedIndices: number[];
  highlightedIndices: number[];
  /** One-based line numbers in the corresponding Python example. */
  codeLines: number[];
  variables: Record<string, number | string | number[]>;
  explanation: string;
  /** Available only in the completed step. */
  result: number | null;
}

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, offset) => start + offset);

/** Each snapshot owns its arrays so stepping back never observes a later mutation. */
function record(steps: LessonStep[], step: LessonStep) {
  steps.push({
    ...step,
    activeIndices: [...step.activeIndices],
    comparedIndices: [...step.comparedIndices],
    highlightedIndices: [...step.highlightedIndices],
    codeLines: [...step.codeLines],
    variables: Object.fromEntries(Object.entries(step.variables).map(([name, value]) => [name, Array.isArray(value) ? [...value] : value])),
  });
}

function parity(values: readonly number[]): LessonStep[] {
  const steps: LessonStep[] = [];
  const matched: number[] = [];
  let count = 0;
  const snapshot = (active: number[], lines: number[], explanation: string, number: number | string = '—', result: number | null = null) => {
    record(steps, {
      activeIndices: active, comparedIndices: [], highlightedIndices: matched, codeLines: lines,
      variables: { number, even_count: count }, explanation, result,
    });
  };
  snapshot([], [1, 2], 'Zapisujemy dane. Licznik liczb parzystych zaczyna od zera.');
  values.forEach((number, index) => {
    const isEven = number % 2 === 0;
    snapshot([index], [4, 5], isEven
      ? `Sprawdzamy ${number}: reszta z dzielenia przez 2 wynosi 0. Warunek jest spełniony.`
      : `Sprawdzamy ${number}: reszta z dzielenia przez 2 nie wynosi 0. Licznik pozostaje bez zmian.`, number);
    if (isEven) {
      count += 1;
      matched.push(index);
      snapshot([index], [6], `Dodajemy 1 do licznika. Teraz even_count = ${count}.`, number);
    }
  });
  snapshot([], [8], `Sprawdziliśmy cały ciąg. Wynik zliczania: ${count}.`, values.at(-1) ?? '—', count);
  return steps;
}

function kadane(values: readonly number[]): LessonStep[] {
  const steps: LessonStep[] = [];
  let currentSum = values[0];
  let bestSum = values[0];
  let start = 0;
  let bestStart = 0;
  let bestEnd = 0;
  const snapshot = (index: number, lines: number[], explanation: string, result: number | null = null) => {
    record(steps, {
      activeIndices: result === null ? [index] : [],
      comparedIndices: result === null ? range(start, index) : [],
      highlightedIndices: range(bestStart, bestEnd), codeLines: lines,
      variables: { number: values[index], current_sum: currentSum, best_sum: bestSum }, explanation, result,
    });
  };
  snapshot(0, [1, 2], `Zaczynamy od pierwszej liczby: ${currentSum}. Fragment musi być niepusty, więc obie sumy mają tę wartość.`);
  for (let index = 1; index < values.length; index++) {
    const number = values[index];
    const extended = currentSum + number;
    const restart = number > extended;
    if (restart) start = index;
    currentSum = Math.max(number, extended);
    snapshot(index, [4, 5, 6, 7, 8], restart
      ? `Dla ${number} lepiej zacząć nowy fragment: ${number} > ${extended}. Bieżąca suma wynosi ${currentSum}.`
      : `Dołączamy ${number} do fragmentu. Jego suma ${extended} jest co najmniej tak dobra jak start od ${number}.`);
    const improves = currentSum > bestSum;
    if (improves) {
      bestSum = currentSum;
      bestStart = start;
      bestEnd = index;
    }
    snapshot(index, [9, 10, 11], improves
      ? `Znaleźliśmy lepszy fragment. Największa suma do tej pory: ${bestSum}.`
      : `Największa suma pozostaje równa ${bestSum}; bieżący fragment jej nie poprawia.`);
  }
  snapshot(values.length - 1, [13], `Największa suma niepustego spójnego fragmentu wynosi ${bestSum}. Wyróżnione elementy tworzą taki fragment.`, bestSum);
  return steps;
}

function lis(values: readonly number[]): LessonStep[] {
  const steps: LessonStep[] = [];
  const lengths = Array<number>(values.length).fill(1);
  // Predecessors only reconstruct the illustrative subsequence; the displayed code computes its length.
  const previous = Array<number>(values.length).fill(-1);
  const chain = (end: number) => {
    const indices: number[] = [];
    for (let cursor = end; cursor !== -1; cursor = previous[cursor]) indices.unshift(cursor);
    return indices;
  };
  const snapshot = (i: number | null, j: number | null, lines: number[], explanation: string, highlighted: number[] = [], result: number | null = null) => {
    record(steps, {
      activeIndices: i === null ? [] : [i], comparedIndices: j === null ? [] : [j],
      highlightedIndices: highlighted, codeLines: lines,
      variables: { i: i ?? '—', j: j ?? '—', lengths }, explanation, result,
    });
  };
  snapshot(null, null, [1, 2], 'Każda pojedyncza liczba tworzy podciąg długości 1. Tak inicjalizujemy tablicę lengths.');
  for (let i = 0; i < values.length; i++) {
    snapshot(i, null, [4], `Szukamy najdłuższego rosnącego podciągu kończącego się na ${values[i]} (i = ${i}).`, chain(i));
    for (let j = 0; j < i; j++) {
      const smaller = values[j] < values[i];
      snapshot(i, j, [5, 6], smaller
        ? `Porównujemy ${values[j]} < ${values[i]}. Warunek jest spełniony: możemy przedłużyć podciąg z pozycji ${j}.`
        : `Porównujemy ${values[j]} < ${values[i]}. Warunek nie jest spełniony; podciąg ma być ściśle rosnący.`, chain(i));
      if (!smaller) continue;
      const candidate = lengths[j] + 1;
      const improves = candidate > lengths[i];
      // A smaller predecessor gives a deterministic, equally valid chain on ties.
      if (improves || (candidate === lengths[i] && (previous[i] === -1 || values[j] < values[previous[i]]))) previous[i] = j;
      lengths[i] = Math.max(lengths[i], candidate);
      snapshot(i, j, [7, 8, 9, 10], improves
        ? `Przedłużamy podciąg z pozycji ${j}. lengths[${i}] rośnie do ${lengths[i]}.`
        : `Porównujemy lengths[${i}] z lengths[${j}] + 1. Najlepsza długość na tej pozycji pozostaje równa ${lengths[i]}.`, chain(i));
    }
  }
  let end = 0;
  for (let i = 1; i < values.length; i++) {
    if (lengths[i] > lengths[end] || (lengths[i] === lengths[end] && values[i] < values[end])) end = i;
  }
  const result = lengths[end];
  snapshot(null, null, [12], `Największa wartość w lengths to ${result}. Wyróżniliśmy jeden z poprawnych rosnących podciągów tej długości.`, chain(end), result);
  return steps;
}

export function createLessonTrace(algorithm: LessonAlgorithm, values: readonly number[]): LessonStep[] {
  if (values.some(value => !Number.isFinite(value))) throw new RangeError('Example data must contain finite numbers.');
  if (algorithm !== 'parity' && values.length === 0) throw new RangeError('This algorithm requires a nonempty sequence of numbers.');
  switch (algorithm) {
    case 'parity': return parity(values);
    case 'kadane': return kadane(values);
    case 'lis': return lis(values);
  }
}
