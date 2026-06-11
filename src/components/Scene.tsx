import type { CSSProperties } from "react";
import { DayNight } from "./DayNight";

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

const rd = (s: number) => ({ "--rd": `${s}s` }) as CSSProperties;
const cd = (s: number) => ({ "--cd": `${s}s` }) as CSSProperties;
const pd = (s: number) => ({ "--pd": `${s}s` }) as CSSProperties;

const KEY_FILL = "#fffdf5";
const KEY_EDGE = "#d8c9a8";
const ACCENT_LEAF = "#b5d39a";
const ACCENT_PEACH = "#f0b9a4";

function Keycap({
  x,
  y,
  w = 10,
  h = 10,
  fill = KEY_FILL,
  rotate,
  clack,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill?: string;
  rotate?: number;
  clack?: number;
}) {
  // CSS の transform アニメ (.clack) は属性 transform を上書きするので、回転は親 g に分離する
  const rect = (
    <rect
      className={clack === undefined ? undefined : "clack"}
      style={clack === undefined ? undefined : cd(clack)}
      x={x}
      y={y}
      width={w}
      height={h}
      rx="2.5"
      fill={fill}
      stroke={KEY_EDGE}
      strokeWidth="0.8"
    />
  );
  if (rotate) {
    return <g transform={`rotate(${rotate} ${x + w / 2} ${y + h / 2})`}>{rect}</g>;
  }
  return rect;
}

// claw44 の片手分: 3行 x 6列のカラムスタガー + 扇形に並ぶ親指キー4つ
function Claw44Half() {
  const stagger = [9, 5, 0, 2, 6, 8];
  const keys = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      keys.push([c * 11, r * 11 + stagger[c]] as const);
    }
  }
  return (
    <g>
      <rect
        x="-5"
        y="-5"
        width="76"
        height="70"
        rx="9"
        fill="#f4e9d2"
        stroke="#dcc9a4"
        strokeWidth="1.2"
      />
      {keys.map(([x, y], i) => (
        <Keycap
          key={i}
          x={x}
          y={y}
          fill={i === 14 ? ACCENT_LEAF : KEY_FILL}
          clack={[1, 8, 16].includes(i) ? (i * 0.13) % 1.2 : undefined}
        />
      ))}
      <Keycap x={31} y={36} w={10} h={11} rotate={10} fill={ACCENT_PEACH} clack={0.45} />
      <Keycap x={42} y={39.5} w={10} h={11} rotate={18} />
      <Keycap x={52.5} y={44.5} w={10} h={11} rotate={26} />
      <Keycap x={62} y={51} w={10} h={11} rotate={34} />
    </g>
  );
}

// 小人キーの片手分: アーチ型スタガーの 5列 x 3行 + 内側へ下がる親指キー3つ + トラックボール
function KobitoHalf() {
  const stagger = [5, 2.5, 0, 2.5, 5];
  const keys = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      keys.push([c * 11, r * 11 + stagger[c]] as const);
    }
  }
  return (
    <g>
      <rect
        x="-5"
        y="-5"
        width="78"
        height="62"
        rx="8"
        fill="#f4e9d2"
        stroke="#dcc9a4"
        strokeWidth="1.2"
      />
      {keys.map(([x, y], i) => (
        <Keycap
          key={i}
          x={x}
          y={y}
          fill={i === 7 ? ACCENT_PEACH : KEY_FILL}
          clack={[3, 11].includes(i) ? (i * 0.21) % 1.2 : undefined}
        />
      ))}
      <Keycap x={22} y={35.5} clack={0.8} />
      <Keycap x={33} y={38} />
      <Keycap x={44} y={40.5} fill={ACCENT_LEAF} />
      <circle cx="61" cy="40" r="8.5" fill="#c9b08a" />
      <circle cx="61" cy="40" r="6.5" fill="#cf5b48" />
      <circle cx="58.8" cy="37.8" r="1.8" fill="#fff" opacity="0.85" />
    </g>
  );
}

// 庭の作業デスク: ノートPC + claw44 + 小人キー + コーヒー。カタカタ開発中。
function GardenDesk() {
  return (
    <div className="desk">
      <svg viewBox="0 0 430 250" overflow="visible" role="presentation">
        {/* 脚と足元の草 */}
        <rect x="42" y="188" width="13" height="50" rx="4" fill="#c69d6a" />
        <rect x="375" y="188" width="13" height="50" rx="4" fill="#c69d6a" />
        <path
          d="M36 238 C 34 230 30 226 26 223 M42 238 C 42 229 41 225 42 220"
          stroke="#4d8038"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M394 238 C 396 230 400 226 404 223 M388 238 C 388 229 389 225 388 220"
          stroke="#5d9a44"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* 植木鉢 */}
        <path d="M12 224 L 30 224 L 27 240 L 15 240 Z" fill="#e07a5f" />
        <path
          d="M21 222 C 21 216 20 212 19 208"
          stroke="#4d8038"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="15.5"
          cy="206.5"
          rx="4.6"
          ry="2.6"
          transform="rotate(-35 15.5 206.5)"
          fill="#74b153"
        />
        <ellipse
          cx="23.5"
          cy="205.5"
          rx="4.6"
          ry="2.6"
          transform="rotate(25 23.5 205.5)"
          fill="#8cc46a"
        />

        {/* ノートPC (奥の縁に開いて置いてある) */}
        <g>
          <rect x="150" y="6" width="110" height="72" rx="7" fill="#5a4a3a" />
          <rect x="156" y="12" width="98" height="58" rx="4" fill="#303b48" />
          <path d="M163 24 H 205" stroke="#9cc07a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M163 33 H 232" stroke="#e8c46a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M171 42 H 214" stroke="#7ea8d8" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M171 51 H 196" stroke="#d8e2ec" strokeWidth="3.5" strokeLinecap="round" />
          <rect className="blinkc" x="163" y="58" width="9" height="4" rx="1" fill="#9cc07a" />
          <rect x="138" y="76" width="134" height="9" rx="4" fill="#6b5a48" />
        </g>

        {/* 机 */}
        <rect
          x="8"
          y="80"
          width="414"
          height="116"
          rx="14"
          fill="#d9b585"
          stroke="#c69d6a"
          strokeWidth="2"
        />
        <path
          d="M30 110 C 120 106 210 108 300 106"
          stroke="#cfa873"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M150 178 C 240 175 330 177 405 174"
          stroke="#cfa873"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />

        {/* claw44 (左右の半身をハの字に) */}
        <g transform="translate(26 100)">
          <g transform="rotate(-7 35 30)">
            <Claw44Half />
          </g>
          <g transform="translate(172 0) scale(-1 1)">
            <g transform="rotate(-7 35 30)">
              <Claw44Half />
            </g>
          </g>
        </g>

        {/* 小人キー (ちいさい相棒) */}
        <g transform="translate(228 106) scale(0.88)">
          <g transform="rotate(-6 35 26)">
            <KobitoHalf />
          </g>
          <g transform="translate(158 0) scale(-1 1)">
            <g transform="rotate(-6 35 26)">
              <KobitoHalf />
            </g>
          </g>
        </g>

        {/* コーヒー */}
        <g>
          <circle cx="394" cy="106" r="13" fill="#fffdf5" stroke="#d8c9a8" strokeWidth="1.5" />
          <circle cx="394" cy="106" r="9" fill="#7a5236" />
          <path
            d="M394 92 C 391 86 396 82 393 76"
            className="steam"
            style={pd(0)}
            stroke="#fff"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M401 94 C 398 89 403 85 400 80"
            className="steam"
            style={pd(1.1)}
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* 組み立て中: ドライバーとキーキャップ */}
        <g transform="rotate(24 372 168)">
          <rect x="358" y="165" width="22" height="3.5" rx="1.5" fill="#9aa3ad" />
          <rect x="378" y="162.5" width="13" height="8.5" rx="3.5" fill="#e07a5f" />
        </g>
        <Keycap x={324} y={172} w={9} h={9} />
        <Keycap x={337} y={178} w={9} h={9} fill={ACCENT_LEAF} rotate={14} />

        {/* カタカタ */}
        <g transform="rotate(-5 64 62)">
          <text className="kata" style={pd(0)} x="64" y="62" fontSize="15" fill="#7c6a4d">
            カタカタ…
          </text>
        </g>
        <g transform="rotate(4 300 70)">
          <text className="kata" style={pd(1.4)} x="300" y="70" fontSize="12" fill="#8a7a5f">
            ｶﾀｶﾀ
          </text>
        </g>
      </svg>
    </div>
  );
}

// 夜空の星 (上空 65% に固定配置)
function Stars() {
  const dots: Array<[number, number, number, number?]> = [
    [6, 5, 0.28, 0],
    [14, 9, 0.2],
    [22, 4, 0.32, 0.6],
    [30, 12, 0.2],
    [38, 7, 0.26, 1.2],
    [46, 3, 0.2],
    [54, 10, 0.3, 0.3],
    [62, 6, 0.2],
    [70, 12, 0.26, 1.6],
    [78, 5, 0.32],
    [86, 9, 0.2, 0.9],
    [94, 4, 0.26],
    [10, 18, 0.2, 1.4],
    [26, 20, 0.28],
    [42, 17, 0.2, 0.5],
    [58, 21, 0.3],
    [74, 18, 0.2, 1.1],
    [90, 21, 0.26],
    [18, 28, 0.22, 0.2],
    [50, 27, 0.28],
    [82, 28, 0.2, 1.8],
    [34, 33, 0.24],
    [66, 32, 0.2, 0.7],
    [96, 30, 0.22],
  ];
  return (
    <div className="stars">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" role="presentation">
        {dots.map(([x, y, r, tw], i) =>
          tw === undefined ? (
            <circle key={i} cx={x} cy={y} r={r} fill="#fdfaf0" />
          ) : (
            <circle
              key={i}
              className="tw"
              style={{ "--td": `${tw}s` } as CSSProperties}
              cx={x}
              cy={y}
              r={r}
              fill="#fdfaf0"
            />
          ),
        )}
      </svg>
    </div>
  );
}

// 夜だけ灯る明かり (丘レイヤーと同じ座標系で重ねる)
function HillsGlow() {
  return (
    <div className="hills-glow">
      <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" role="presentation">
        <g className="layer-mid">
          <circle cx="316" cy="345" r="13" fill="rgba(255,214,130,0.35)" />
          <circle cx="316" cy="345" r="4.5" fill="#ffeaa6" />
        </g>
      </svg>
    </div>
  );
}

// 夜のノートPCの明かり
function DeskGlow() {
  return (
    <div className="desk-glow">
      <svg viewBox="0 0 430 250" overflow="visible" role="presentation">
        <defs>
          <filter id="soft-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <ellipse
          cx="205"
          cy="46"
          rx="92"
          ry="60"
          fill="rgba(150,190,255,0.15)"
          filter="url(#soft-glow)"
        />
        <rect x="156" y="12" width="98" height="58" rx="4" fill="rgba(165,200,255,0.22)" />
      </svg>
    </div>
  );
}

// ポツンと一軒家の庭で、自作キーボードをカタカタ打ちながら開発している風景。
// 空は実時刻に連動して昼夜が移り変わる (DayNight)。
export function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="sky-overlay sky-dusk" />
      <div className="sky-overlay sky-night" />
      <div className="sky-overlay sky-dawn" />
      <Stars />
      <DayNight />
      <div className="layer-sky">
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
            {/* 二ツ森山 (岐阜県中津川市福岡から望む双耳峰: 左が本峰の西峰 1,223.5m、右がやや低い東峰=東森山) */}
            <path
              d="M0 360 C 120 350 220 345 320 330 C 420 312 500 268 590 232 C 615 222 645 222 668 234 C 700 252 718 268 740 268 C 762 268 780 254 806 240 C 826 230 852 230 874 242 C 940 278 1010 318 1100 338 C 1200 352 1320 352 1440 348 L 1440 520 L 0 520 Z"
              fill="#a3c4a8"
              opacity="0.9"
            />
            {/* 山裾の霞 */}
            <path
              d="M0 402 C 240 382 480 390 720 398 C 960 406 1200 384 1440 396 L 1440 520 L 0 520 Z"
              fill="#b7d8a4"
              opacity="0.75"
            />
          </g>

          <g className="layer layer-mid">
            <path
              d="M0 392 C 280 318 520 316 760 372 C 1000 426 1180 338 1440 370 L 1440 520 L 0 520 Z"
              fill="#8fc06c"
            />
            {/* ポツンと一軒家 (煙突から湯気) */}
            <g transform="translate(330 352)">
              <circle className="smoke" style={pd(0)} cx="17" cy="-52" r="4.5" fill="#fff" />
              <circle className="smoke" style={pd(1.6)} cx="17" cy="-52" r="5.5" fill="#fff" />
              <circle className="smoke" style={pd(3.2)} cx="17" cy="-52" r="4" fill="#fff" />
              <rect x="11" y="-44" width="12" height="18" rx="2" fill="#c1705a" />
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

      <HillsGlow />
      <GardenDesk />
      <DeskGlow />

      <div className="firefly f1" />
      <div className="firefly f2" />
      <div className="firefly f3" />

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
