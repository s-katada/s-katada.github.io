import type { CSSProperties } from "react";

// 稲穂の配置: [x座標, スケール, 揺れの開始遅延(s)]
const RICE: Array<[number, number, number]> = [
  [36, 1.9, 0],
  [128, 1.5, 0.7],
  [240, 2.1, 0.3],
  [420, 1.6, 1.1],
  [540, 1.9, 0.5],
  [660, 1.4, 0.9],
  [820, 2.0, 0.15],
  [950, 1.6, 0.8],
  [1080, 2.2, 0.45],
  [1200, 1.7, 1.0],
  [1320, 2.0, 0.6],
  [1408, 1.5, 0.2],
];

// 片田舎の風景: 空・太陽・雲・丘・赤い屋根の家・木・田んぼ・稲穂・ちょうちょ。
export function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="layer-sky">
        <div className="sun" />
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />
      </div>

      <div className="hills">
        <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" role="presentation">
          <defs>
            <g id="ine">
              <path
                d="M0 0 C 1 -12 2 -24 6 -33"
                fill="none"
                stroke="#6da14e"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M2 -14 C -2 -18 -5 -23 -5 -28 C -1 -26 2 -21 2 -14" fill="#7fb761" />
              <ellipse
                cx="8"
                cy="-34"
                rx="2.6"
                ry="4"
                fill="#ecc868"
                stroke="#d9b14f"
                strokeWidth="0.5"
              />
              <ellipse
                cx="11"
                cy="-31"
                rx="2.6"
                ry="4"
                fill="#ecc868"
                stroke="#d9b14f"
                strokeWidth="0.5"
              />
              <ellipse
                cx="13.5"
                cy="-27.5"
                rx="2.6"
                ry="4"
                fill="#ecc868"
                stroke="#d9b14f"
                strokeWidth="0.5"
              />
              <ellipse
                cx="15.5"
                cy="-23.5"
                rx="2.6"
                ry="4"
                fill="#e6bf5d"
                stroke="#d9b14f"
                strokeWidth="0.5"
              />
            </g>
          </defs>

          <g className="layer layer-far">
            <path
              d="M0 330 C 240 248 480 252 720 305 C 960 358 1200 268 1440 298 L 1440 520 L 0 520 Z"
              fill="#b7d8a4"
              opacity="0.8"
            />
          </g>

          <g className="layer layer-mid">
            <path
              d="M0 392 C 280 318 520 316 760 372 C 1000 426 1180 338 1440 370 L 1440 520 L 0 520 Z"
              fill="#8fc06c"
            />
            <g transform="translate(330 352)">
              <polygon points="-34,-18 0,-46 34,-18" fill="#d97f5f" />
              <rect
                x="-26"
                y="-18"
                width="52"
                height="30"
                rx="3"
                fill="#fff6e3"
                stroke="#e3cfa6"
                strokeWidth="2"
              />
              <rect x="-7" y="-2" width="14" height="14" rx="2" fill="#c89b6a" />
              <circle cx="-14" cy="-7" r="4.5" fill="#ffd98a" stroke="#e3cfa6" strokeWidth="1.5" />
            </g>
            <g transform="translate(1080 352)">
              <rect x="-5" y="-8" width="10" height="34" rx="4" fill="#8a6644" />
              <g className="sway-soft">
                <circle cx="0" cy="-30" r="28" fill="#6fae52" />
                <circle cx="-23" cy="-14" r="18" fill="#7fb761" />
                <circle cx="23" cy="-14" r="18" fill="#7fb761" />
                <circle cx="-8" cy="-34" r="10" fill="#8cc46a" />
              </g>
            </g>
          </g>

          <g className="layer layer-near">
            <path
              d="M0 448 C 320 406 620 408 880 442 C 1100 470 1300 428 1440 444 L 1440 520 L 0 520 Z"
              fill="#74ad53"
            />
            <path
              d="M30 472 Q 720 432 1410 468"
              fill="none"
              stroke="#629c45"
              strokeWidth="3"
              opacity="0.55"
            />
            <path
              d="M20 487 Q 720 452 1420 484"
              fill="none"
              stroke="#629c45"
              strokeWidth="3"
              opacity="0.45"
            />
          </g>

          <g className="layer layer-fore">
            <path d="M0 492 C 480 468 960 470 1440 488 L 1440 520 L 0 520 Z" fill="#5d9a44" />
            {RICE.map(([x, s, d], i) => (
              <g key={i} transform={`translate(${x} 514) scale(${i % 3 === 1 ? -s : s} ${s})`}>
                <g className="sway" style={{ "--rd": `${d}s` } as CSSProperties}>
                  <use href="#ine" />
                </g>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="butterfly">
        <svg viewBox="0 0 44 32">
          <g className="wing">
            <ellipse cx="13" cy="11" rx="11" ry="8.5" fill="#f7d96b" />
            <ellipse cx="14" cy="22" rx="7.5" ry="5.5" fill="#f0c94f" />
            <ellipse cx="31" cy="11" rx="11" ry="8.5" fill="#f7d96b" />
            <ellipse cx="30" cy="22" rx="7.5" ry="5.5" fill="#f0c94f" />
          </g>
          <ellipse cx="22" cy="16" rx="2.4" ry="8" fill="#7a5a3a" />
          <path
            d="M20 9 C 17 5 14 3 11 2 M24 9 C 27 5 30 3 33 2"
            stroke="#7a5a3a"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
