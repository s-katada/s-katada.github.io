import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Phase = "day" | "dusk" | "night" | "dawn";

// 仮想時刻 (実時刻 + オフセット) から空のフェーズを決める
const phaseOf = (h: number): Phase => {
  if (h >= 7 && h < 16.5) return "day";
  if (h >= 16.5 && h < 19) return "dusk";
  if (h >= 19 || h < 5) return "night";
  return "dawn";
};

const hourNow = () => {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
};

// 太陽/月が描く弧: 中心 (50vw, 80vh)、半径 (42vw, 66vh) の楕円の上半分
const ARC = { cx: 50, cy: 80, rx: 42, ry: 66 };

// ポインタ位置を弧上の進行度 p (0 = 東の地平線, 1 = 西の地平線) に投影する。
// x 座標だけでなく角度で追従するので、弧を描くジェスチャーが素直に効く。
const arcP = (clientX: number, clientY: number) => {
  const u = ((clientX / window.innerWidth) * 100 - ARC.cx) / ARC.rx;
  const v = (ARC.cy - (clientY / window.innerHeight) * 100) / ARC.ry;
  const ang = Math.atan2(Math.max(v, -0.25), u);
  return Math.min(Math.max(1 - ang / Math.PI, -0.08), 1.08);
};

// 太陽と月。実時刻で弧の上を移動する。
// 操作: 本体をクリック/ダイヤルをクリック = 昼夜反転、
//       本体を弧に沿ってドラッグ or 右下のダイヤルを回す = 時間を直接動かす。
export function DayNight() {
  const [offset, setOffset] = useState(() => {
    const saved = window.sessionStorage.getItem("tod-offset");
    return saved === null ? 0 : Number(saved);
  });
  const [, setTick] = useState(0);
  const [dragging, setDragging] = useState<"body" | "dial" | null>(null);
  const [hover, setHover] = useState(false);
  const bodyDrag = useRef<{ startX: number; startY: number; base: 6 | 18; moved: boolean } | null>(
    null,
  );
  const dialDrag = useRef<{
    startX: number;
    startY: number;
    moved: boolean;
    lastAng: number | null;
    vh: number;
  } | null>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30000);
    return () => window.clearInterval(id);
  }, []);

  const apply = (v: number) => {
    setOffset(v);
    window.sessionStorage.setItem("tod-offset", String(v));
  };

  const vh24 = (((hourNow() + offset) % 24) + 24) % 24;
  const phase = phaseOf(vh24);
  const isDay = vh24 >= 6 && vh24 < 18;
  const p = isDay ? (vh24 - 6) / 12 : ((vh24 - 18 + 24) % 24) / 12;

  useLayoutEffect(() => {
    document.documentElement.dataset.phase = phase;
  }, [phase]);

  const clamped = Math.min(Math.max(p, -0.06), 1.06);
  const xvw = ARC.cx - ARC.rx + clamped * ARC.rx * 2;
  const yvh = ARC.cy - Math.sin(Math.min(Math.max(clamped, 0), 1) * Math.PI) * ARC.ry;

  const capture = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // 合成イベント等で pointerId が無効な場合は capture なしで続行
    }
  };

  /* ---- 本体 (太陽/月) のドラッグ ---- */

  const onBodyDown = (e: React.PointerEvent<HTMLDivElement>) => {
    capture(e);
    bodyDrag.current = { startX: e.clientX, startY: e.clientY, base: isDay ? 6 : 18, moved: false };
    setDragging("body");
  };

  const onBodyMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = bodyDrag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;
    d.moved = true;
    apply(d.base + arcP(e.clientX, e.clientY) * 12 - hourNow());
  };

  const onBodyUp = () => {
    const d = bodyDrag.current;
    bodyDrag.current = null;
    setDragging(null);
    if (d && !d.moved) apply(offset + 12); // タップで昼夜反転
  };

  /* ---- 時計ダイヤル: 回して時間を動かす (1周 = 24時間) ---- */

  const onDialDown = (e: React.PointerEvent<HTMLDivElement>) => {
    capture(e);
    dialDrag.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      lastAng: null,
      vh: hourNow() + offset,
    };
    setDragging("dial");
  };

  const onDialMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dialDrag.current;
    const dial = dialRef.current;
    if (!d || !dial) return;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 5) return;
    d.moved = true;
    const r = dial.getBoundingClientRect();
    // 文字盤の上方向を 0° とした時計回りの角度
    const ang =
      (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) *
        180) /
      Math.PI;
    if (d.lastAng !== null) {
      const delta = ((ang - d.lastAng + 540) % 360) - 180;
      d.vh += delta / 15; // 15° = 1時間
      apply(d.vh - hourNow());
    }
    d.lastAng = ang;
  };

  const onDialUp = () => {
    const d = dialDrag.current;
    dialDrag.current = null;
    setDragging(null);
    if (d && !d.moved) apply(offset + 12);
  };

  const dialAngle = (vh24 - 12) * 15; // 正午が真上、深夜0時が真下

  return (
    <>
      <svg
        className={`arc-guide${hover || dragging === "body" ? " show" : ""}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="arc-path"
          d={`M ${ARC.cx - ARC.rx} ${ARC.cy} A ${ARC.rx} ${ARC.ry} 0 0 1 ${ARC.cx + ARC.rx} ${ARC.cy}`}
          fill="none"
          strokeWidth="0.35"
          strokeDasharray="1.4 2"
          strokeLinecap="round"
        />
      </svg>

      <div
        className={`sky-body${dragging === "body" ? " dragging" : ""}`}
        style={{ left: `${xvw}vw`, top: `${yvh}vh` }}
        title={
          isDay
            ? "クリックで夜に / ドラッグで太陽を動かす"
            : "クリックで昼に / ドラッグで月を動かす"
        }
        onPointerDown={onBodyDown}
        onPointerMove={onBodyMove}
        onPointerUp={onBodyUp}
        onPointerCancel={onBodyUp}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        {isDay ? <div className="sun-core" /> : <div className="moon-core" />}
      </div>

      <div
        ref={dialRef}
        className={`time-dial${dragging === "dial" ? " dragging" : ""}`}
        title="まわして時間を動かす / クリックで昼夜反転"
        onPointerDown={onDialDown}
        onPointerMove={onDialMove}
        onPointerUp={onDialUp}
        onPointerCancel={onDialUp}
      >
        <div className="dial-face" />
        <div className="dial-rot" style={{ transform: `rotate(${dialAngle}deg)` }}>
          <div className="dial-stick" />
          <div className={`dial-tip ${isDay ? "day" : "night"}`} />
        </div>
        <div className="dial-pin" />
      </div>
    </>
  );
}
