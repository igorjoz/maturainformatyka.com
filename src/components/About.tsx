import Arrow from "./Arrow";
import GeometryBackdrop from "./GeometryBackdrop";
import ResponsivePicture from "./ResponsivePicture";
import { css, type Site } from "./types";
import { useSectionMotion } from "../hooks/useSectionMotion";

export default function About({
  site,
}: {
  site: Pick<Site, "about" | "projects" | "personal">;
}) {
  const sectionRef = useSectionMotion<HTMLElement>();
  return (
    <>
      <section
        ref={sectionRef}
        className="section container about geometry-host"
        data-motion
        id="o-mnie"
        aria-labelledby="about-title"
      >
        <GeometryBackdrop />
        <div className="about-copy" data-reveal>
          <p className="eyebrow">04 / POZNAJMY SIĘ</p>
          <h2 id="about-title">{site.about.title}</h2>
          {site.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a className="text-link" href={site.personal}>
            Więcej o mnie <Arrow diagonal />
          </a>
        </div>
        <div className="projects">
          <div className="projects-heading">
            <span>MOJE PROJEKTY</span>
            <span aria-hidden="true">↗</span>
          </div>
          {site.projects.map((project, index) => (
            <a
              key={project.name}
              className={`project project-${index}`}
              href={project.url}
              data-card
              data-reveal
              style={css({ "--reveal-delay": `${index * 80}ms` })}
            >
              <div className="project-illustration">
                <ResponsivePicture image={project.image} />
              </div>
              <div className="project-copy">
                <div className="project-top">
                  <span>{project.category}</span>
                  <Arrow diagonal />
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span className="project-domain">
                  {new URL(project.url).hostname}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
