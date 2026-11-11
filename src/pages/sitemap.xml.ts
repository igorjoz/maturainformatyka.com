import type { APIRoute } from 'astro';
import { exams } from '../data/exams';
import { getTasks, getUsedTopics, taskPath } from '../data/tasks';
import { getPublications, publicationPath } from '../data/publications';
export const GET: APIRoute = async ({ site }) => {
  const publications = await getPublications();
  const paths = ['/', '/arkusze/', '/zadania/', '/wiedza/', ...publications.map(publicationPath), ...(await getTasks()).map(taskPath), ...(await getUsedTopics()).map(topic => `/zadania/tematy/${topic.id}/`), ...exams.map(exam => `/arkusze/${exam.slug}/`)];
  const modified = new Map(publications.map(entry => [publicationPath(entry), entry.data.updatedAt]));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${new URL(path, site).href}</loc>${modified.has(path) ? `<lastmod>${modified.get(path)}</lastmod>` : ''}</url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
