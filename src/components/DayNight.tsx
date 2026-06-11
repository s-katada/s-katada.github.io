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

const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

// 太陽と月。実時刻で弧の上を移動する。
// 操作はシンプルに: 太陽/月 (またはダイヤル) をクリック = 12時間ぶん空が回って昼夜反転。
// 細かく動かしたいときは右下のダイヤルを回す (1周 = 24時間)。
export function DayNight() {
  const [offset, setOffset] = useState(() => {
    const saved = window.sessionStorage.getItem("tod-offset");
    return saved === null ? 0 : Number(saved);
  });
  const [, setTick] = useState(0);
  const [dialDragging, setDialDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const [tweening, setTweening] = useState(false);
  const tweenRaf = useRef<number | null>(null);
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
    return () => {
      window.clearInterval(id);
      if (tweenRaf.current !== null) window.cancelAnimationFrame(tweenRaf.current);
    };
  }, []);

  const apply = (v: number) => {
    setOffset(v);
    window.sessionStorage.setItem("tod-offset", String(v));
  };

  // クリックで +12時間: 太陽が弧を滑り降りて月が昇るアニメーション
  const flip = () => {
    if (tweenRaf.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(offset + 12);
      return;
    }
    const from = offset;
    const start = performance.now();
    const DURATION = 1800;
    setTweening(true);
    const step = (t: number) => {
      const k = Math.min((t - start) / DURATION, 1);
      setOffset(from + 12 * easeInOut(k));
      if (k < 1) {
        tweenRaf.current = window.requestAnimationFrame(step);
      } else {
        tweenRaf.current = null;
        setTweening(false);
        apply(from + 12);
      }
    };
    tweenRaf.current = window.requestAnimationFrame(step);
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

  /* ---- 時計ダイヤル: 回して時間を動かす (1周 = 24時間) ---- */

  const onDialDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // 合成イベント等で pointerId が無効な場合は capture なしで続行
    }
    dialDrag.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      lastAng: null,
      vh: hourNow() + offset,
    };
    setDialDragging(true);
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
    setDialDragging(false);
    if (d && !d.moved) flip();
  };

  const dialAngle = (vh24 - 12) * 15; // 正午が真上、深夜0時が真下

  return (
    <>
      <svg
        className={`arc-guide${hover || tweening ? " show" : ""}`}
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
        className={`sky-body${tweening ? " dragging" : ""}`}
        style={{ left: `${xvw}vw`, top: `${yvh}vh` }}
        title={isDay ? "クリックで夜にする" : "クリックで昼にする"}
        onClick={flip}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        {isDay ? <div className="sun-core" /> : <div className="moon-core" />}
      </div>

      <div
        ref={dialRef}
        className={`time-dial${dialDragging ? " dragging" : ""}`}
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
