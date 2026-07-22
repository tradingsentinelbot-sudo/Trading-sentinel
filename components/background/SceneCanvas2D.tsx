"use client";

import { useEffect, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const ASSETS = {
  environment: "/scene/environment.png",
  monolith: "/scene/monolith.png",
  dust: "/scene/dust.png",
  rocks: [
    "/scene/rock-1.png",
    "/scene/rock-2.png",
    "/scene/rock-3.png",
    "/scene/rock-4.png",
    "/scene/rock-5.png",
    "/scene/rock-6.png",
  ],
} as const;

type Layer = {
  image: HTMLImageElement;
  x: number;
  y: number;
  scale: number;
  depth: number;
  rotation: number;
  opacity: number;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/**
 * Lightweight 2D scene compositor.
 *
 * The artwork is deliberately split into independent layers: environment,
 * monolith, debris and atmospheric dust. The canvas remains persistent while
 * scroll changes the depth offsets of those layers, creating a 3D-like scene
 * without a heavy realtime WebGL sculpture.
 */
export function SceneCanvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useScrollProgress();
  const progressRef = useRef(progress);
  const pointerRef = useRef({ x: 0, y: 0 });
  const targetPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      targetPointerRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      targetPointerRef.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let resizeObserver: ResizeObserver | undefined;

    const run = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      const [environment, monolith, dust, ...rocks] = await Promise.all([
        loadImage(ASSETS.environment),
        loadImage(ASSETS.monolith),
        loadImage(ASSETS.dust),
        ...ASSETS.rocks.map(loadImage),
      ]);
      if (cancelled) return;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      const draw = (time: number) => {
        if (cancelled) return;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const p = Math.max(0, Math.min(1, progressRef.current));
        const t = time * 0.001;

        pointerRef.current.x += (targetPointerRef.current.x - pointerRef.current.x) * 0.035;
        pointerRef.current.y += (targetPointerRef.current.y - pointerRef.current.y) * 0.035;

        context.clearRect(0, 0, w, h);
        context.fillStyle = "#080A0D";
        context.fillRect(0, 0, w, h);

        // Environment: large, calm, slightly oversized to preserve spatial air.
        const envScale = Math.max(w / environment.width, h / 410);
        const envW = environment.width * envScale;
        const envH = 410 * envScale;
        const envX = (w - envW) * 0.5 + pointerRef.current.x * -8 + p * -18;
        const envY = (h - envH) * 0.52 + pointerRef.current.y * -5 + p * -10;
        context.drawImage(environment, 0, 0, environment.width, 410, envX, envY, envW, envH);

        // Soft depth veil: keeps the left reading zone calm without flattening the scene.
        const leftVeil = context.createLinearGradient(0, 0, w * 0.72, 0);
        leftVeil.addColorStop(0, "rgba(8,10,13,0.82)");
        leftVeil.addColorStop(0.38, "rgba(8,10,13,0.48)");
        leftVeil.addColorStop(0.72, "rgba(8,10,13,0.08)");
        leftVeil.addColorStop(1, "rgba(8,10,13,0)");
        context.fillStyle = leftVeil;
        context.fillRect(0, 0, w, h);

        // Separate debris layer: each fragment has its own depth coefficient.
        const rockLayout = [
          [0.17, 0.34, 0.95, -0.18, 0.04],
          [0.24, 0.56, 0.72, 0.13, -0.03],
          [0.76, 0.36, 0.9, -0.12, 0.05],
          [0.83, 0.58, 0.74, 0.15, -0.04],
          [0.38, 0.27, 0.58, 0.08, 0.03],
          [0.63, 0.29, 0.52, -0.08, -0.02],
        ] as const;
        rocks.forEach((rock, index) => {
          const [nx, ny, scale, drift, rotation] = rockLayout[index];
          const depth = 0.55 + index * 0.09;
          const x = w * nx + pointerRef.current.x * 14 * depth + p * drift * 70;
          const y = h * ny + pointerRef.current.y * 10 * depth + p * drift * 28;
          const size = Math.min(w, h) * 0.075 * scale;
          context.save();
          context.globalAlpha = 0.72;
          context.translate(x, y);
          context.rotate(rotation + Math.sin(t * 0.18 + index) * 0.008);
          context.drawImage(rock, -size / 2, -size / 2, size, size * (rock.height / rock.width));
          context.restore();
        });

        // Monolith: crop only the actual structure from the source cutout.
        const source = { x: 180, y: 0, width: 300, height: 380 };
        const monoH = Math.min(h * 0.86, 760);
        const monoW = monoH * (source.width / source.height);
        const monoX = w * 0.59 + pointerRef.current.x * 20 + p * 42;
        const monoY = h * 0.05 + pointerRef.current.y * -12 + p * -24;
        const monoScale = 0.96 + Math.sin(t * 0.12) * 0.006;
        context.save();
        context.globalAlpha = 0.99;
        context.translate(monoX, monoY);
        context.rotate(Math.sin(t * 0.08) * 0.003 + p * 0.012);
        context.drawImage(
          monolith,
          source.x,
          source.y,
          source.width,
          source.height,
          -monoW / 2,
          0,
          monoW * monoScale,
          monoH * monoScale
        );
        context.restore();

        // Very restrained atmospheric particles, behind the interface.
        context.save();
        context.globalAlpha = 0.16;
        const dustX = -p * 22 + pointerRef.current.x * -8;
        const dustY = -p * 10 + pointerRef.current.y * -5;
        context.drawImage(dust, dustX, dustY, w, h);
        context.restore();

        // Bottom fade keeps the scene continuous into the next section.
        const bottom = context.createLinearGradient(0, h * 0.72, 0, h);
        bottom.addColorStop(0, "rgba(8,10,13,0)");
        bottom.addColorStop(1, "rgba(8,10,13,0.96)");
        context.fillStyle = bottom;
        context.fillRect(0, h * 0.72, w, h * 0.28);

        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
    };

    run();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
