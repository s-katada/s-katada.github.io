import { useEffect } from "react";

// マウスに合わせて --mx / --my を更新するだけの描画なしコンポーネント。
// 雲や丘がゆっくり視差で動く。
export function ParallaxDriver() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    const root = document.documentElement;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      root.style.setProperty("--mx", x.toFixed(4));
      root.style.setProperty("--my", y.toFixed(4));
      raf = window.requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
