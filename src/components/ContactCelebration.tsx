import { useId } from "react";
import { css } from "./types";

export default function ContactCelebration() {
  const gradientId = useId();
  const particles = Array.from({ length: 48 }, (_, index) => index);
  return (
    <>
      <div className="contact-celebration" aria-hidden="true">
        <svg
          className="celebration-ribbons"
          viewBox="0 0 1440 760"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0"
              y1="0"
              x2="1440"
              y2="760"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00843d" />
              <stop offset=".45" stopColor="#a8c6ad" />
              <stop offset=".7" stopColor="#d9ad77" />
              <stop offset="1" stopColor="#9b5628" />
            </linearGradient>
          </defs>
          <g stroke={`url(#${gradientId})`} strokeLinecap="round">
            <path
              className="celebration-ribbon ribbon-left"
              pathLength="1"
              strokeWidth="14"
              vectorEffect="non-scaling-stroke"
              d="M-35 710C150 665 20 455 145 410S340 505 215 535 22 300 110 220 290 260 210 320 30 155 75-30"
            />
            <path
              className="celebration-ribbon ribbon-right"
              pathLength="1"
              strokeWidth="18"
              vectorEffect="non-scaling-stroke"
              d="M1470 730C1280 670 1420 515 1305 450S1130 535 1245 555 1455 310 1350 230 1160 280 1240 330 1440 125 1370-30"
            />
            <path
              className="celebration-ribbon ribbon-fine"
              pathLength="1"
              strokeWidth="5"
              vectorEffect="non-scaling-stroke"
              d="M-20 520C170 550 340 690 525 690S740 535 855 610 1170 765 1460 650"
            />
          </g>
        </svg>
        <span className="celebration-ring celebration-ring-left"></span>
        <span className="celebration-ring celebration-ring-right"></span>
        {particles.map((index) => (
          <span
            key={index}
            className="celebration-particle"
            style={css({
              "--particle-delay": `${(index % 4) * 45}ms`,
              "--particle-turn": `${index * 37}deg`,
              "--confetti-left": `${(index * 37 + 11) % 100}%`,
              "--confetti-sway": `${((index % 7) - 3) * 24}px`,
              "--confetti-duration": `${2100 + (index % 5) * 220}ms`,
            })}
          />
        ))}
      </div>
    </>
  );
}
