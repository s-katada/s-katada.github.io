import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  phase: number;
  speed: number;
};

// 奥行き付きの星空。ゆっくり上昇しつつ瞬き、マウスに合わせて視差で揺れる。
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let t = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const px = s.x + pointer.x * -28 * s.z;
        let py = s.y - (reduced ? 0 : t * s.speed);
        py = ((py % height) + height) % height;
        py += pointer.y * -28 * s.z;
        const twinkle = reduced ? 0.75 : 0.55 + 0.45 * Math.sin(t * (0.6 + s.z) + s.phase);
        ctx.globalAlpha = twinkle * (0.3 + 0.7 * s.z);
        ctx.fillStyle = s.z > 0.7 ? "#d6ecff" : "#93aed1";
        ctx.beginPath();
        ctx.arc(px, py, s.r * s.z + 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.floor((width * height) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.25 + Math.random() * 0.75,
        r: 0.4 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        speed: 6 + Math.random() * 14,
      }));
      if (reduced) draw();
    };

    const frame = () => {
      t += 1 / 60;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      draw();
      raf = window.requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / width - 0.5;
      pointer.ty = e.clientY / height - 0.5;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    if (!reduced) raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
