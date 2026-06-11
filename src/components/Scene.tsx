import type { CSSProperties } from "react";

type StemTop = "leaf" | "bud" | "flower";

// 前景の草花の配置: [種類, x座標, スケール, 揺れの開始遅延(s)]
const FLORA: Array<["tuft" | "daisy" | "clover", number, number, number]> = [
  ["tuft", 40, 1.8, 0],
  ["daisy", 150, 1.5, 0.6],
  ["tuft", 280, 2.2, 0.3],
  ["clover", 390, 1.7, 0.9],
  ["tuft", 520, 1.5, 0.5],
  ["daisy", 690, 1.8, 0.15],
  ["tuft", 830, 2.0, 0.75],
  ["clover", 960, 1.5, 0.4],
  ["tuft", 1090, 2.3, 1.0],
  ["daisy", 1230, 1.4, 0.55],
  ["tuft", 1340, 1.9, 0.25],
  ["clover", 1420, 1.6, 0.8],
];

const sd = (s: number) => ({ "--sd": `${s}s` }) as CSSProperties;
const bd = (s: number) => ({ "--bd": `${s}s` }) as CSSProperties;
const rd = (s: number) => ({ "--rd": `${s}s` }) as CSSProperties;

// 頭の茎。成長段階: 葉っぱ → つぼみ → 花
function Stem({ top, delay }: { top: StemTop; delay: number }) {
  return (
    <g className="stem" style={sd(delay)}>
      <path
        d="M0 -29 C 0 -33 -1 -36 -1 -39"
        stroke="#4d8038"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {top === "leaf" && (
        <ellipse
          cx="-4.5"
          cy="-42.5"
          rx="5.5"
          ry="3"
          transform="rotate(-32 -4.5 -42.5)"
          fill="#74b153"
        />
      )}
      {top === "bud" && (
        <>
          <circle cx="-1.5" cy="-41.5" r="3.2" fill="#f0a8c4" />
          <circle cx="-2.3" cy="-42.3" r="1.1" fill="#fbe3ec" />
        </>
      )}
      {top === "flower" && (
        <>
          <circle cx="-5" cy="-43.5" r="2.6" fill="#fffdf5" />
          <circle cx="2" cy="-43.5" r="2.6" fill="#fffdf5" />
          <circle cx="-1.5" cy="-46.5" r="2.6" fill="#fffdf5" />
          <circle cx="-1.5" cy="-40.5" r="2.6" fill="#fffdf5" />
          <circle cx="-1.5" cy="-43.5" r="2" fill="#f6c94a" />
        </>
      )}
    </g>
  );
}

// 右向きに歩く庭のこびと。色ごとに顔つきがちょっと違う。
function Walker({
  color,
  dark,
  top,
  stemDelay,
  face,
}: {
  color: string;
  dark: string;
  top: StemTop;
  stemDelay: number;
  face: "nose" | "ear" | "mouth";
}) {
  return (
    <>
      <ellipse cx="-3" cy="-2.2" rx="2.6" ry="2.2" fill={dark} />
      <ellipse cx="3.5" cy="-2.2" rx="2.6" ry="2.2" fill={dark} />
      <ellipse cx="0" cy="-9" rx="6.8" ry="6.2" fill={color} />
      {face === "ear" && (
        <ellipse
          cx="-7.5"
          cy="-23"
          rx="2.6"
          ry="4.2"
          fill={color}
          stroke={dark}
          strokeWidth="0.6"
        />
      )}
      <circle cx="1" cy="-21" r="9" fill={color} />
      {face === "nose" && (
        <path d="M9.5 -22 Q 14 -21.5 15 -19.5 Q 12 -18 9.5 -18.5 Z" fill={color} />
      )}
      {face === "mouth" && <ellipse cx="7.6" cy="-16.5" rx="2" ry="1.3" fill={dark} />}
      <circle cx="5.5" cy="-23" r="3" fill="#fff" />
      <circle cx="6.6" cy="-23" r="1.4" fill="#2e2620" />
      <Stem top={top} delay={stemDelay} />
    </>
  );
}

// ピクミン風の庭: 空・太陽・雲・丘・ポッド・木・畑・草花・行進するこびとたち・ちょうちょ。
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
            <g id="tuft">
              <path
                d="M0 0 C -2 -8 -7 -13 -11 -16"
                stroke="#4d8038"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0 0 C -1 -10 -2 -16 -1 -22"
                stroke="#5d9a44"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0 0 C 1 -9 4 -15 8 -19"
                stroke="#6fae52"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0 0 C 2 -7 6 -10 10 -12"
                stroke="#4d8038"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            <g id="daisy">
              <path
                d="M0 0 C 0 -18 -2 -32 -3 -44"
                stroke="#5c9444"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse cx="6" cy="-20" rx="7" ry="3" transform="rotate(-25 6 -20)" fill="#6fae52" />
              <ellipse
                cx="-3"
                cy="-57"
                rx="3.2"
                ry="7"
                fill="#fffdf5"
                stroke="#e8ddc2"
                strokeWidth="0.8"
              />
              <ellipse
                cx="-3"
                cy="-57"
                rx="3.2"
                ry="7"
                transform="rotate(60 -3 -50)"
                fill="#fffdf5"
                stroke="#e8ddc2"
                strokeWidth="0.8"
              />
              <ellipse
                cx="-3"
                cy="-57"
                rx="3.2"
                ry="7"
                transform="rotate(120 -3 -50)"
                fill="#fffdf5"
                stroke="#e8ddc2"
                strokeWidth="0.8"
              />
              <ellipse
                cx="-3"
                cy="-57"
                rx="3.2"
                ry="7"
                transform="rotate(180 -3 -50)"
                fill="#fffdf5"
                stroke="#e8ddc2"
                strokeWidth="0.8"
              />
              <ellipse
                cx="-3"
                cy="-57"
                rx="3.2"
                ry="7"
                transform="rotate(240 -3 -50)"
                fill="#fffdf5"
                stroke="#e8ddc2"
                strokeWidth="0.8"
              />
              <ellipse
                cx="-3"
                cy="-57"
                rx="3.2"
                ry="7"
                transform="rotate(300 -3 -50)"
                fill="#fffdf5"
                stroke="#e8ddc2"
                strokeWidth="0.8"
              />
              <circle cx="-3" cy="-50" r="4.5" fill="#f6c94a" />
            </g>
            <g id="clover">
              <path
                d="M0 0 C 0 -5 -1 -9 -2 -12"
                stroke="#5c9444"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="-6" cy="-15" r="4.2" fill="#6fae52" />
              <circle cx="2" cy="-15" r="4.2" fill="#6fae52" />
              <circle cx="-2" cy="-19.5" r="4.2" fill="#7fb761" />
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
            {/* オニオン風ポッド */}
            <g transform="translate(330 340)">
              <path d="M-14 4 L -30 26" stroke="#b9986b" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M14 4 L 30 26" stroke="#b9986b" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M0 8 L 0 28" stroke="#b9986b" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="0" cy="-14" rx="26" ry="23" fill="#e8533f" />
              <path
                d="M-11 -33 C -13 -22 -13 -6 -11 5"
                stroke="#f2937f"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0 -37 C 0 -24 0 -8 0 8"
                stroke="#f2937f"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M11 -33 C 13 -22 13 -6 11 5"
                stroke="#f2937f"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M0 -37 L 0 -43" stroke="#4d8038" strokeWidth="2" />
              <g className="prop">
                <ellipse cx="0" cy="-45" rx="11" ry="2.8" fill="#b9d9a0" />
                <ellipse
                  cx="0"
                  cy="-45"
                  rx="11"
                  ry="2.8"
                  transform="rotate(60 0 -45)"
                  fill="#b9d9a0"
                />
                <ellipse
                  cx="0"
                  cy="-45"
                  rx="11"
                  ry="2.8"
                  transform="rotate(120 0 -45)"
                  fill="#b9d9a0"
                />
              </g>
            </g>
            {/* 木 */}
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
            {FLORA.map(([kind, x, s, d], i) => (
              <g key={i} transform={`translate(${x} 514) scale(${i % 3 === 1 ? -s : s} ${s})`}>
                <g className="sway" style={rd(d)}>
                  <use href={`#${kind}`} />
                </g>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* こびとたちの行進 (スペースバー運搬中) */}
      <div className="march">
        <svg viewBox="0 -58 230 62" overflow="visible">
          <g transform="translate(16 0)">
            <g className="bob" style={bd(0)}>
              <Walker color="#e8533f" dark="#c23a28" top="leaf" stemDelay={0} face="nose" />
            </g>
          </g>
          <g transform="translate(58 0)">
            <g className="bob" style={bd(0.12)}>
              <Walker color="#f2c14e" dark="#cf9d33" top="bud" stemDelay={0.4} face="ear" />
            </g>
          </g>
          <g transform="translate(104 0)">
            <g className="bob" style={bd(0.06)}>
              <Walker color="#4f86c6" dark="#3a69a3" top="flower" stemDelay={0.2} face="mouth" />
              <g transform="translate(48 0)">
                <Walker color="#e8533f" dark="#c23a28" top="leaf" stemDelay={0.55} face="nose" />
              </g>
              <path d="M5 -15 L 10 -30" stroke="#3a69a3" strokeWidth="2" strokeLinecap="round" />
              <path d="M43 -15 L 38 -30" stroke="#c23a28" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M-2 -31 L 50 -31 L 45 -40 L 3 -40 Z"
                fill="#fffdf5"
                stroke="#d8c9a8"
                strokeWidth="1.5"
              />
              <path d="M2 -33.5 L 46 -33.5" stroke="#ece0c6" strokeWidth="1" />
            </g>
          </g>
          <g transform="translate(204 0)">
            <g className="bob" style={bd(0.2)}>
              <Walker color="#f2c14e" dark="#cf9d33" top="leaf" stemDelay={0.8} face="ear" />
            </g>
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
