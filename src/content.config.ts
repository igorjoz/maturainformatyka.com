import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = z.array(z.number().int().positive()).min(1);
const taskContexts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/task-contexts' }),
  schema: z.object({
    examId: z.string(), number: z.string(), title: z.string(),
    sheetFile: z.string(), gradingFile: z.string(), sheetPages: pages,
  }),
});
const tasks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tasks' }),
  schema: z.object({
    parentId: z.string(), number: z.string(), title: z.string().min(1), summary: z.string().min(1),
    editorialNote: z.string().optional(),
    points: z.number().int().nonnegative(), topics: z.array(z.string()).min(1),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]), rationale: z.string().min(1),
    sheetPages: pages, gradingPages: pages,
    dataFiles: z.array(z.string()).default([]), dependencies: z.array(z.string()).default([]),
  }),
});
const taskGrading = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/task-grading' }),
  schema: z.object({ answerStatus: z.enum(['provided', 'not-provided']), editorialNote: z.string().min(1).optional() }),
});
const publicationDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, 'Use a valid YYYY-MM-DD date.');
const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string().min(1), description: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    kind: z.enum(['guide', 'article']).default('article'),
    section: z.enum(['przygotowanie', 'programowanie', 'algorytmika', 'arkusze-kalkulacyjne', 'bazy-danych', 'teoria']),
    topics: z.array(z.string()).default([]), relatedTasks: z.array(z.string()).default([]),
    author: z.string().min(1), publishedAt: publicationDate, updatedAt: publicationDate,
    draft: z.boolean().default(true), examYear: z.number().int().optional(),
    sources: z.array(z.object({ title: z.string().min(1), url: z.url(), pages: z.string().optional() })).default([]),
  }).refine(value => value.updatedAt >= value.publishedAt, {
    message: 'updatedAt cannot precede publishedAt.', path: ['updatedAt'],
  }),
});
export const collections = { taskContexts, tasks, taskGrading, publications };
