import { useEffect, useState } from "react";

type Ripple = { id: number; x: number; y: number };

// クリックした場所に笛のような金色のリングが広がる。
export function Whistle() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let nextId = 0;
    const onDown = (e: PointerEvent) => {
      const ripple = { id: nextId++, x: e.clientX, y: e.clientY };
      setRipples((rs) => [...rs.slice(-4), ripple]);
      window.setTimeout(() => {
        setRipples((rs) => rs.filter((r) => r.id !== ripple.id));
      }, 700);
    };

    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div className="whistles" aria-hidden="true">
      {ripples.map((r) => (
        <span key={r.id} className="whistle-ring" style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}
