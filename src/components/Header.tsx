import { useEffect, useRef, useState } from "react";
import Arrow from "./Arrow";
import type { Site } from "./types";

export default function Header({
  site,
  logo,
  home = true,
  activeSection = "/arkusze/",
}: {
  site: Pick<Site, "navigation">;
  logo: string;
  home?: boolean;
  activeSection?: string;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(home ? "" : activeSection);
  useEffect(() => {
    document.documentElement.classList.add("navigation-enhanced");
    setOpen(menu.current?.open ?? false);
    const sections = site.navigation
      .filter((link) => link.href.startsWith("#"))
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((element): element is HTMLElement => !!element);
    let frame = 0;
    const render = () => {
      frame = 0;
      if (document.hidden) return;
      const bottom = header.current?.getBoundingClientRect().bottom ?? 88;
      let active = home ? "" : activeSection;
      for (const section of sections)
        if (section.getBoundingClientRect().top <= bottom + innerHeight * 0.18)
          active = `#${section.id}`;
      setCurrent(active);
      const reading = Math.max(
        0,
        Math.min(
          1,
          scrollY /
            Math.max(1, document.documentElement.scrollHeight - innerHeight),
        ),
      );
      progress.current?.style.setProperty(
        "--reading-progress",
        reading.toFixed(4),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        setOpen(false);
        menu.current.querySelector("summary")?.focus();
      }
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    document.addEventListener("keydown", escape);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.documentElement);
    render();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      document.removeEventListener("keydown", escape);
      document.documentElement.classList.remove("navigation-enhanced");
    };
  }, [site.navigation, home, activeSection]);
  const links = site.navigation.map((link) => (
    <a
      key={link.href}
      href={!home && link.href.startsWith("#") ? `/${link.href}` : link.href}
      aria-current={current === link.href ? (link.href.startsWith("#") ? "location" : "page") : undefined}
    >
      {link.label}
    </a>
  ));
  return (
    <>
      <a className="skip-link" href="#tresc">
        Przejdź do treści
      </a>
      <header ref={header} className="site-header">
        <div className="container header-inner">
          <a
            className="brand"
            href={home ? "#start" : "/"}
            aria-label="Matura z informatyki — początek strony"
          >
            <img
              className="brand-symbol"
              src={logo}
              width="38"
              height="38"
              alt=""
              aria-hidden="true"
            />
            <span>
              matura<span className="brand-light">informatyka</span>
              <span className="brand-dot">.</span>
            </span>
          </a>
          <nav aria-label="Nawigacja główna" className="desktop-nav">
            {links}
          </nav>
          <a className="header-contact" href={home ? "#rezerwacja" : "/#rezerwacja"}>
            Bezpłatna rozmowa <Arrow />
          </a>
          <details
            ref={menu}
            className="mobile-menu"
            onToggle={(event) => setOpen(event.currentTarget.open)}
          >
            <summary
              aria-label={
                open ? "Zamknij menu nawigacji" : "Otwórz menu nawigacji"
              }
              aria-controls="mobile-navigation"
            >
              <span className="menu-lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </summary>
            <nav
              id="mobile-navigation"
              aria-label="Nawigacja mobilna"
              onClick={(event) => {
                if (
                  (event.target as HTMLElement).closest("a") &&
                  menu.current
                ) {
                  menu.current.open = false;
                  setOpen(false);
                }
              }}
            >
              {links}
              <a href={home ? "#kontakt" : "/#kontakt"}>Kontakt</a>
            </nav>
          </details>
        </div>
        <span
          ref={progress}
          className="reading-progress"
          data-reading-progress
          aria-hidden="true"
        />
      </header>
    </>
  );
}
