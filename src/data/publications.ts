import { getCollection, type CollectionEntry } from 'astro:content';
import topics from './task-topics.json';
import { sectionNames } from './task-query';

export type Publication = CollectionEntry<'publications'>;
export const publicationSections: Record<string, string> = { przygotowanie: 'Przygotowanie do matury', ...sectionNames };
export const publicationPath = (entry: Publication): string => entry.data.kind === 'guide'
  ? `/matura-${entry.data.examYear}/` : `/wiedza/${entry.data.slug}/`;
export const publicationDateLabel = (date: string): string => new Intl.DateTimeFormat('pl-PL', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Warsaw',
}).format(new Date(`${date}T12:00:00Z`));

export async function getPublications(): Promise<Publication[]> {
  const [entries, tasks] = await Promise.all([getCollection('publications'), getCollection('tasks')]);
  const taskIds = new Set(tasks.map(task => task.id));
  const topicIds = new Set(topics.map(topic => topic.id));
  const paths = new Set<string>();
  for (const entry of entries) {
    for (const id of entry.data.topics) if (!topicIds.has(id)) throw new Error(`Unknown publication topic ${id}: ${entry.id}`);
    for (const id of entry.data.relatedTasks) if (!taskIds.has(id)) throw new Error(`Unknown publication task ${id}: ${entry.id}`);
    if (entry.data.kind === 'guide' && (entry.data.examYear !== 2027 || entry.data.slug !== 'matura-2027')) {
      throw new Error(`A guide needs an implemented annual route (currently matura-2027): ${entry.id}`);
    }
    const path = publicationPath(entry);
    if (paths.has(path)) throw new Error(`Duplicate publication path: ${path}`);
    paths.add(path);
  }
  return entries.filter(entry => !entry.data.draft).sort((a, b) =>
    b.data.publishedAt.localeCompare(a.data.publishedAt) || a.data.title.localeCompare(b.data.title, 'pl'));
}
