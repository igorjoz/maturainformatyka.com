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
export const collections = { taskContexts, tasks, taskGrading };
