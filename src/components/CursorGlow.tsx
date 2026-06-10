import { useEffect, useRef } from "react";

// マウスを遅れて追いかける光。ついでに視差用の CSS 変数 (--mx / --my) も更新する。
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    const root = document.documentElement;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
    };

    const loop = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      root.style.setProperty("--mx", (x / window.innerWidth - 0.5).toFixed(4));
      root.style.setProperty("--my", (y / window.innerHeight - 0.5).toFixed(4));
      raf = window.requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
