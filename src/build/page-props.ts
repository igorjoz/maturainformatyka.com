// This module is imported only by the Astro document, never by hydrated components.
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { codeToTokens, createCssVariablesTheme } from "shiki";
import { site, subjectGroups, lessonExample } from "../data/site";
import portrait from "../../images/portrait-art.png";
import type {
  ResponsiveImage,
  LessonContent,
  Site,
  SubjectGroup,
} from "../components/types";

async function picture(
  src: ImageMetadata,
  alt: string,
  widths: number[],
  sizes: string,
  fallback: "png" | "jpg" = "png",
): Promise<ResponsiveImage> {
  const formats = ["avif", "webp", fallback] as const;
  const variants = await Promise.all(
    formats.map(async (format) => {
      const images = await Promise.all(
        widths.map((width) => getImage({ src, width, format, quality: 75 })),
      );
      return {
        type: `image/${format === "jpg" ? "jpeg" : format}`,
        images,
        srcSet: images
          .map((image, index) => `${image.src} ${widths[index]}w`)
          .join(", "),
      };
    }),
  );
  const last = variants[2];
  const largest = last.images.at(-1)!;
  return {
    src: largest.src,
    width: widths.at(-1)!,
    height: Math.round((src.height * widths.at(-1)!) / src.width),
    alt,
    sizes,
    srcSet: last.srcSet,
    sources: variants.slice(0, 2).map(({ type, srcSet }) => ({ type, srcSet })),
  };
}

export async function preparePageProps() {
  const [portraitImage, projects, groups, examples] = await Promise.all([
    picture(
      portrait,
      "Artystyczny portret Igora Józefowicza, prowadzącego zajęcia z informatyki",
      [360, 560, 800, 1122],
      "(max-width: 600px) 88vw, (max-width: 900px) 440px, (max-width: 1200px) 40vw, 460px",
    ),
    Promise.all(
      site.projects.map(async (project) => ({
        ...project,
        image: await picture(
          project.image,
          project.imageAlt,
          [160, 240, 320],
          "(max-width: 600px) 80px, 112px",
        ),
      })),
    ),
    Promise.all(
      subjectGroups.map(async (group) => ({
        ...group,
        image: await picture(
          group.image,
          group.imageAlt,
          [360, 640, 960, 1280],
          "(max-width: 600px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 92px) / 2), (max-width: 1180px) calc((100vw - 104px) / 2), (max-width: 1376px) calc((100vw - 136px) / 2), 620px",
          "jpg",
        ),
      })),
    ),
    Promise.all(
      lessonExample.examples.map(async (example) => {
        const { tokens } = await codeToTokens(example.code, {
          lang: "python",
          theme: createCssVariablesTheme({ variablePrefix: "--astro-code-" }),
        });
        return {
          ...example,
          tokens: tokens.map((line) =>
            line.map(({ content, color, fontStyle }) => ({
              content,
              color,
              fontStyle,
            })),
          ),
        };
      }),
    ),
  ]);
  return {
    portraitImage,
    site: { ...site, projects } satisfies Site,
    groups: groups satisfies SubjectGroup[],
    lesson: { ...lessonExample, examples } satisfies LessonContent,
  };
}
