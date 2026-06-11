import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Phase = "day" | "dusk" | "night" | "dawn";

// 仮想時刻から空のフェーズを決める
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

// 昼夜はゆっくり自動で巡る: 12時間 = 40秒 (太陽も月も40秒かけて空を渡る)。
// reduced-motion 時は自動進行なし (実時刻のみ)。
const RATE = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 12 / 40;
const T0 = performance.now();

// 実時刻スタートで、そこから加速した時間が流れる
const virtualNow = () => hourNow() + ((performance.now() - T0) / 1000) * RATE;

// 太陽/月が描く弧: 中心 (50vw, 80vh)、半径 (42vw, 66vh) の楕円の上半分
const ARC = { cx: 50, cy: 80, rx: 42, ry: 66 };

const clampP = (p: number) => Math.min(Math.max(p, -0.06), 1.06);

const posOf = (p: number) => ({
  left: `${ARC.cx - ARC.rx + p * ARC.rx * 2}vw`,
  top: `${ARC.cy - Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI) * ARC.ry}vh`,
});

const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

// 太陽と月。ゆっくり自動で巡りつつ、クリックで一気に昼夜反転、ダイヤルで自由に操作。
export function DayNight() {
  const [offset, setOffset] = useState(() => {
    const saved = window.sessionStorage.getItem("tod-offset");
    return saved === null ? 0 : Number(saved);
  });
  const [, setTick] = useState(0);
  const [dialDragging, setDialDragging] = useState(false);
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

  // 800ms ごとに再描画。位置は CSS transition が滑らかに補間する
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 800);
    return () => {
      window.clearInterval(id);
      if (tweenRaf.current !== null) window.cancelAnimationFrame(tweenRaf.current);
    };
  }, []);

  const apply = (v: number) => {
    setOffset(v);
    window.sessionStorage.setItem("tod-offset", String(v));
  };

  // クリックで +12時間: 弧に沿って一気に滑るアニメーション
  const flip = () => {
    if (tweenRaf.current !== null) return;
    if (RATE === 0) {
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

  const vhRaw = virtualNow() + offset;
  const vh24 = ((vhRaw % 24) + 24) % 24;
  const phase = phaseOf(vh24);
  const isDay = vh24 >= 6 && vh24 < 18;

  useLayoutEffect(() => {
    document.documentElement.dataset.phase = phase;
  }, [phase]);

  // 太陽と月は別要素: それぞれ自分の進行度を持ち、沈んでいる間は透明のまま反対側へ戻る
  const sunRaw = (vh24 - 6) / 12;
  const moonRaw = ((vh24 - 18 + 24) % 24) / 12;
  const sunUp = sunRaw > -0.03 && sunRaw < 1.03;
  const moonUp = moonRaw > -0.03 && moonRaw < 1.03;

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
      vh: virtualNow() + offset,
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
      apply(d.vh - virtualNow());
    }
    d.lastAng = ang;
  };

  const onDialUp = () => {
    const d = dialDrag.current;
    dialDrag.current = null;
    setDialDragging(false);
    if (d && !d.moved) flip();
  };

  // 巻き戻さず回り続けるよう、mod しない時刻で角度を出す (正午が真上)
  const dialAngle = (vhRaw - 12) * 15;

  return (
    <>
      <div
        className={`sky-body${tweening ? " dragging" : ""}${sunUp ? "" : " hidden"}`}
        style={posOf(clampP(sunRaw))}
        title="クリックで夜にする"
        onClick={flip}
      >
        <div className="sun-core" />
      </div>

      <div
        className={`sky-body${tweening ? " dragging" : ""}${moonUp ? "" : " hidden"}`}
        style={posOf(clampP(moonRaw))}
        title="クリックで昼にする"
        onClick={flip}
      >
        <div className="moon-core" />
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
