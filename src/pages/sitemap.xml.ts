import type { APIRoute } from 'astro';
import { exams } from '../data/exams';
import { getTasks, getUsedTopics, taskPath } from '../data/tasks';
export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', '/arkusze/', '/zadania/', ...(await getTasks()).map(taskPath), ...(await getUsedTopics()).map(topic => `/zadania/tematy/${topic.id}/`), ...exams.map(exam => `/arkusze/${exam.slug}/`)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${new URL(path, site).href}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
