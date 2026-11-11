import { getCollection, type CollectionEntry } from 'astro:content';
import { exams } from './exams';
import topics from './task-topics.json';
import { compareTasks } from './task-query';
import { hasTaskPractice } from './task-practice';

export interface Task {
  id: string;
  entry: CollectionEntry<'tasks'>;
  context: CollectionEntry<'taskContexts'>;
  exam: typeof exams[number];
  number: string;
  title: string;
  summary: string;
  points: number;
  difficulty: number;
  topics: typeof topics;
  sections: string[];
  year: number;
  month: number;
  searchText: string;
  practiceAvailable: boolean;
}
export async function getTasks(): Promise<Task[]> {
  const [entries, parents] = await Promise.all([getCollection('tasks'), getCollection('taskContexts')]);
  const entriesById = new Map(entries.map(entry => [entry.id, entry]));
  const result = entries.map(entry => {
    const context = parents.find(parent => parent.id === entry.data.parentId);
    if (!context) throw new Error(`Brak kontekstu: ${entry.id}`);
    const exam = exams.find(exam => exam.id === context.data.examId);
    if (!exam) throw new Error(`Brak egzaminu: ${entry.id}`);
    const assigned = entry.data.topics.map(id => {
      const topic = topics.find(topic => topic.id === id);
      if (!topic) throw new Error(`Nieznany temat ${id}: ${entry.id}`);
      return topic;
    });
    return {
      id: entry.id, entry, context, exam, practiceAvailable: hasTaskPractice(entry.id),
      number: entry.data.number, title: entry.data.title, summary: entry.data.summary,
      points: entry.data.points, difficulty: entry.data.difficulty, topics: assigned,
      sections: [...new Set(assigned.map(topic => topic.section))], year: exam.year, month: exam.month,
      searchText: [entry.data.title, entry.data.summary, entry.data.number, entry.body, context.body, ...entry.data.dependencies.map(id => {
        const prerequisite = entriesById.get(id);
        if (!prerequisite) throw new Error(`Brak podpunktu zależnego ${id}: ${entry.id}`);
        return prerequisite.body;
      }), ...assigned.map(topic => topic.name)].join(' '),
    };
  });
  return result.sort((a, b) => compareTasks(a, b));
}
export async function getUsedTopics() {
  const tasks = await getTasks();
  return topics.filter(topic => tasks.some(task => task.topics.some(assigned => assigned.id === topic.id)));
}
export interface ExamTaskGroup {
  context: Task['context'];
  number: string;
  tasks: Task[];
}

/** Keep the paper's order, independently of the practice catalog's difficulty sort. */
export function groupExamTasks(tasks: Task[]): ExamTaskGroup[] {
  const groups = new Map<string, ExamTaskGroup>();
  for (const task of tasks) {
    let group = groups.get(task.context.id);
    if (!group) {
      group = { context: task.context, number: task.context.data.number, tasks: [] };
      groups.set(task.context.id, group);
    }
    group.tasks.push(task);
  }
  const byNumber = (a: { number: string }, b: { number: string }) => a.number.localeCompare(b.number, 'pl', { numeric: true });
  return [...groups.values()].sort(byNumber).map(group => ({ ...group, tasks: group.tasks.toSorted(byNumber) }));
}
export const taskPath = (task: Pick<Task, 'id'>) => `/zadania/${task.id}/`;
export const dataPath = (examId: string, filename: string) => `/pliki/zadania/${examId}/${filename.split('/').map(encodeURIComponent).join('/')}`;
