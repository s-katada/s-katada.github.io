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

// 太陽と月。実時刻で弧の上を移動し、ドラッグで時間そのものを動かせる。
// 端 (地平線) を越えるか、クリックすると昼夜が入れ替わる。
export function DayNight() {
  const [offset, setOffset] = useState(() => {
    const saved = window.sessionStorage.getItem("tod-offset");
    return saved === null ? 0 : Number(saved);
  });
  const [, setTick] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number; startY: number; base: 6 | 18; moved: boolean } | null>(
    null,
  );

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
  // 弧上の進行度: 0 = 東の地平線 (昇る)、1 = 西の地平線 (沈む)
  const p = isDay ? (vh24 - 6) / 12 : ((vh24 - 18 + 24) % 24) / 12;

  useLayoutEffect(() => {
    document.documentElement.dataset.phase = phase;
  }, [phase]);

  const clamped = Math.min(Math.max(p, -0.06), 1.06);
  const xvw = 8 + clamped * 84;
  const yvh = 80 - Math.sin(Math.min(Math.max(clamped, 0), 1) * Math.PI) * 66;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // 合成イベント等で pointerId が無効な場合は capture なしで続行
    }
    drag.current = { startX: e.clientX, startY: e.clientY, base: isDay ? 6 : 18, moved: false };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;
    d.moved = true;
    const np = Math.min(Math.max((e.clientX / window.innerWidth - 0.08) / 0.84, -0.08), 1.08);
    apply(d.base + np * 12 - hourNow());
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (d && !d.moved) apply(offset + 12); // タップで昼夜反転
  };

  return (
    <div
      className={`sky-body${dragging ? " dragging" : ""}`}
      style={{ left: `${xvw}vw`, top: `${yvh}vh` }}
      title={
        isDay ? "クリックで夜に / ドラッグで太陽を動かす" : "クリックで昼に / ドラッグで月を動かす"
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {isDay ? <div className="sun-core" /> : <div className="moon-core" />}
    </div>
  );
}
