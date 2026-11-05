import ResponsivePicture from "./ResponsivePicture";
import { type Site, type ResponsiveImage } from "./types";

export default function PortraitScene({
  site,
  portraitImage,
}: {
  site: Pick<Site, "name">;
  portraitImage: ResponsiveImage;
}) {
  return (
    <>
      <figure className="portrait-scene" data-portrait-scene>
        <div className="portrait-composition">
          <div className="scene-layer scene-backdrop" aria-hidden="true">
            <svg viewBox="0 0 560 640" fill="none">
              <g className="scene-drift ambient">
                <path
                  className="scene-blob"
                  d="M98 111C164 28 365 39 445 133C513 213 483 292 477 373C470 472 432 573 296 593C160 613 73 528 66 417C59 306 28 199 98 111Z"
                  fill="#dce6db"
                />
              </g>
              <g className="scene-drift scene-drift-copper ambient">
                <circle cx="440" cy="127" r="68" fill="#f4d4b8" />
              </g>
              <g className="scene-drift scene-drift-sage ambient">
                <circle cx="127" cy="462" r="80" fill="#c2d2c2" opacity=".6" />
              </g>
            </svg>
          </div>
          <div className="scene-layer scene-geometry" aria-hidden="true">
            <svg viewBox="0 0 560 640" fill="none">
              <defs>
                <linearGradient id="orbit-light" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#9b5628" stopOpacity="0" />
                  <stop offset=".55" stopColor="#e8bd88" />
                  <stop offset="1" stopColor="#fff9e9" />
                </linearGradient>
              </defs>
              <g className="orbit-track ambient">
                <ellipse
                  className="scene-orbit"
                  cx="282"
                  cy="322"
                  rx="241"
                  ry="173"
                  transform="rotate(-39 282 322)"
                  stroke="#18364a"
                  strokeOpacity=".55"
                  strokeWidth="1.5"
                  pathLength="1"
                />
                <ellipse
                  className="scene-orbit-light"
                  cx="282"
                  cy="322"
                  rx="241"
                  ry="173"
                  transform="rotate(-39 282 322)"
                  stroke="url(#orbit-light)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="90 1250"
                />
                <circle
                  className="orbit-point"
                  cx="466"
                  cy="170"
                  r="5"
                  fill="#18364a"
                />
                <circle
                  cx="466"
                  cy="170"
                  r="13"
                  stroke="#18364a"
                  strokeOpacity=".2"
                />
              </g>
              <g className="orbit-track orbit-track-reverse ambient">
                <ellipse
                  className="scene-orbit scene-orbit-copper"
                  cx="283"
                  cy="316"
                  rx="258"
                  ry="122"
                  transform="rotate(42 283 316)"
                  stroke="#ac632f"
                  strokeWidth="1.8"
                  pathLength="1"
                />
                <circle cx="475" cy="482" r="6" fill="#ac632f" />
              </g>
            </svg>
          </div>
          <div className="scene-layer scene-person">
            <ResponsivePicture
              image={portraitImage}
              eager
              className="hero-portrait"
            />
          </div>
          <span className="scene-coordinate" aria-hidden="true">
            01 — TWÓJ PUNKT STARTU
          </span>
        </div>
        <figcaption className="portrait-caption">
          <strong>{site.name}</strong>
          <span>Twój mentor · inżynier informatyki</span>
          <span className="portrait-school">
            Absolwent Politechniki Gdańskiej
          </span>
        </figcaption>
      </figure>
    </>
  );
}
