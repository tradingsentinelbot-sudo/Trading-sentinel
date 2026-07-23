"use client";

import { useEffect, useRef } from "react";

const ASSETS = {
  hero: "/hero-composed/hero-core.png",
  foregroundTop: "/hero-composed/foreground-top.png",
  midground: "/hero-composed/midground.png",
  foregroundBottom: "/hero-composed/foreground-bottom.png",
  backgroundFragments: "/hero-composed/background-fragments.png",
  foregroundLower: "/hero-composed/foreground-lower.png",
  dust: "/hero-composed/atmospheric-dust.png",
} as const;

type Layer = {
  key: keyof typeof ASSETS;
  depth: number;
  width: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  rotation: number;
};

const LAYERS: Layer[] = [
  // Background: rare, small fragments. They establish the distant field.
  { key: "backgroundFragments", depth: 0.10, width: 0.14, x: 0.86, y: 0.25, driftX: 5, driftY: 2, rotation: -0.006 },
  // Atmospheric dust sits behind the sculpture, not as a second object cluster.
  { key: "dust", depth: 0.06, width: 0.40, x: 0.78, y: 0.52, driftX: 4, driftY: 2, rotation: 0 },
  // Midground: a small number of clearly separated masses.
  { key: "midground", depth: 0.24, width: 0.15, x: 0.88, y: 0.47, driftX: 9, driftY: 4, rotation: 0.008 },
  { key: "foregroundTop", depth: 0.38, width: 0.15, x: 0.90, y: 0.18, driftX: 12, driftY: 5, rotation: -0.008 },
  // Lower foreground creates a visual base and frames the hero instead of competing with it.
  { key: "foregroundBottom", depth: 0.48, width: 0.22, x: 0.24, y: 0.84, driftX: 16, driftY: 7, rotation: 0.006 },
  { key: "foregroundLower", depth: 0.56, width: 0.15, x: 0.82, y: 0.88, driftX: 20, driftY: 8, rotation: -0.006 },
  // Core: deliberately smaller and further away than the previous pass.
  { key: "hero", depth: 1, width: 0.29, x: 0.78, y: 0.40, driftX: 24, driftY: 10, rotation: 0.003 },
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let frame = 0;
    let running = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let scrollProgress = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const images = new Map<keyof typeof ASSETS, HTMLImageElement>();
    const particles = Array.from({ length: 92 }, (_, index) => ({
      x: (index * 47.13) % 1,
      y: (index * 83.71) % 1,
      size: 0.7 + (index % 4) * 0.55,
      depth: 0.15 + ((index * 17) % 100) / 100,
      phase: index * 1.73,
      speed: 0.08 + (index % 5) * 0.018,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    };

    const updateScroll = () => {
      const host = canvas.parentElement;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, -rect.top / travel));
    };

    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / Math.max(1, width) - 0.5) * 2;
      pointer.ty = (event.clientY / Math.max(1, height) - 0.5) * 2;
    };

    const drawImageLayer = (image: HTMLImageElement, layer: Layer, time: number) => {
      const mobile = width < 768;
      const baseWidth = width * (mobile ? Math.min(0.86, layer.width * 1.32) : layer.width);
      const ratio = image.height / image.width;
      const drawWidth = baseWidth;
      const drawHeight = drawWidth * ratio;
      const scrollX = (scrollProgress - 0.35) * layer.driftX;
      const scrollY = (scrollProgress - 0.35) * layer.driftY;
      const presenceX = Math.sin(time * (0.00018 + layer.depth * 0.00008) + layer.depth * 4) * 4 * layer.depth;
      const presenceY = Math.cos(time * (0.00016 + layer.depth * 0.00006) + layer.depth * 3) * 3 * layer.depth;
      const pointerX = pointer.x * 18 * layer.depth;
      const pointerY = pointer.y * -12 * layer.depth;
      const x = width * (mobile ? 0.52 + (layer.x - 0.5) * 0.65 : layer.x) - drawWidth / 2 + scrollX + presenceX + pointerX;
      const y = height * (mobile ? 0.48 + (layer.y - 0.5) * 0.68 : layer.y) - drawHeight / 2 + scrollY + presenceY + pointerY;

      context.save();
      context.translate(x + drawWidth / 2, y + drawHeight / 2);
      context.rotate(layer.rotation + pointer.x * 0.003 * layer.depth);
      const sceneFade = Math.max(0, 1 - Math.max(0, scrollProgress - 0.18) / 0.72);
      context.globalAlpha = (layer.key === "hero" ? 0.84 : 0.42 + layer.depth * 0.26) * sceneFade;
      context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      context.restore();
    };

    const render = (time: number) => {
      if (!running) return;
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;
      context.clearRect(0, 0, width, height);

      // A very soft spatial haze preserves the sense of air between depth planes.
      const haze = context.createRadialGradient(width * 0.66, height * 0.42, 0, width * 0.66, height * 0.42, Math.max(width, height) * 0.72);
      haze.addColorStop(0, "rgba(160, 166, 174, 0.055)");
      haze.addColorStop(0.48, "rgba(90, 98, 108, 0.025)");
      haze.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = haze;
      context.fillRect(0, 0, width, height);

      for (const layer of LAYERS) {
        const image = images.get(layer.key);
        if (image) drawImageLayer(image, layer, time);
      }

      // Independent micro-particles: always moving, visible but not decorative noise.
      for (const particle of particles) {
        const drift = Math.sin(time * 0.001 * particle.speed + particle.phase);
        const x = particle.x * width + drift * 18 * particle.depth + pointer.x * 8 * particle.depth;
        const y = particle.y * height + Math.cos(time * 0.0008 * particle.speed + particle.phase) * 12 * particle.depth + pointer.y * -5 * particle.depth;
        const alpha = 0.18 + (Math.sin(time * 0.001 + particle.phase) + 1) * 0.11;
        context.beginPath();
        context.fillStyle = `rgba(199, 204, 212, ${alpha})`;
        context.shadowBlur = 0;
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      frame = requestAnimationFrame(render);
    };

    resize();
    updateScroll();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    Promise.all(Object.entries(ASSETS).map(async ([key, src]) => [key, await loadImage(src)] as const))
      .then((loaded) => {
        loaded.forEach(([key, image]) => images.set(key as keyof typeof ASSETS, image));
        frame = requestAnimationFrame(render);
      })
      .catch(() => {
        frame = requestAnimationFrame(render);
      });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
