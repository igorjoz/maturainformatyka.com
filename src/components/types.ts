import type { CSSProperties } from "react";
import type {
  site,
  introMeeting,
  lessonExample,
  subjectGroups,
  testimonials,
  faqs,
  maturaExample,
} from "../data/site";

export interface ResponsiveImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  sources: { type: string; srcSet: string }[];
  srcSet: string;
}

export type Site = Omit<typeof site, "projects"> & {
  projects: (Omit<(typeof site.projects)[number], "image"> & {
    image: ResponsiveImage;
  })[];
};
export type IntroMeeting = typeof introMeeting;
export type Reviews = typeof testimonials;
export type FaqItems = typeof faqs;
export type MaturaExample = typeof maturaExample;
export interface SubjectGroup
  extends Omit<(typeof subjectGroups)[number], "image"> {
  image: ResponsiveImage;
}
export interface CodeToken {
  content: string;
  color?: string;
  fontStyle?: number;
}
export type Lesson = LessonData & {
  tokens: CodeToken[][];
};
type LessonData = (typeof lessonExample.examples)[number];
export interface LessonContent extends Omit<typeof lessonExample, "examples"> {
  examples: Lesson[];
}
export const css = (
  properties: CSSProperties & Record<`--${string}`, string | number>,
): CSSProperties => properties;
