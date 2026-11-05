export default function GeometryBackdrop({
  variant = "sage",
}: {
  variant?: string;
}) {
  return (
    <>
      <div
        className={`section-geometry geometry-${variant}`}
        aria-hidden="true"
      >
        <div className="geometry-parallax" data-parallax>
          <div className="geometry-grid"></div>
          <div className="geometry-halo ambient"></div>
          <svg className="geometry-orbits" viewBox="0 0 600 600" fill="none">
            <g className="geometry-ring ambient">
              <ellipse
                cx="300"
                cy="300"
                rx="275"
                ry="170"
                transform="rotate(-35 300 300)"
              />
              <circle cx="525" cy="142" r="6" fill="currentColor" />
            </g>
            <g className="geometry-ring geometry-ring-reverse ambient">
              <ellipse
                cx="300"
                cy="300"
                rx="275"
                ry="125"
                transform="rotate(35 300 300)"
              />
              <circle cx="80" cy="155" r="4" fill="currentColor" />
            </g>
            <circle cx="300" cy="300" r="225" strokeDasharray="2 18" />
            <path d="M280 300h40m-20-20v40" />
          </svg>
        </div>
      </div>
    </>
  );
}
