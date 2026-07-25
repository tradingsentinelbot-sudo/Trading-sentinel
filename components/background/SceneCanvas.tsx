"use client";

import { useEffect, useRef } from "react";

const ASSETS = {
  environment: "/hero-composed/environment.png",
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
  // Distant fragments: sparse and small, subordinate to the environment.
  { key: "backgroundFragments", depth: 0.10, width: 0.10, x: 0.84, y: 0.28, driftX: 3, driftY: 1.5, rotation: -0.004 },
  { key: "midground", depth: 0.22, width: 0.11, x: 0.88, y: 0.48, driftX: 5, driftY: 2, rotation: 0.005 },
  { key: "foregroundTop", depth: 0.34, width: 0.10, x: 0.92, y: 0.20, driftX: 7, driftY: 3, rotation: -0.005 },
  { key: "foregroundBottom", depth: 0.44, width: 0.15, x: 0.22, y: 0.84, driftX: 9, driftY: 4, rotation: 0.004 },
  { key: "foregroundLower", depth: 0.50, width: 0.10, x: 0.82, y: 0.86, driftX: 11, driftY: 4, rotation: -0.004 },
  // The core is larger again, but remains embedded in the environment.
  { key: "hero", depth: 1, width: 0.36, x: 0.76, y: 0.39, driftX: 15, driftY: 6, rotation: 0.002 },
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

    const drawEnvironment = (image: HTMLImageElement) => {
      const scale = Math.max(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      context.save();
      context.globalAlpha = 0.88;
      context.drawImage(image, x, y, drawWidth, drawHeight);
      context.restore();
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
      context.globalAlpha = layer.key === "hero" ? 0.90 : 0.30 + layer.depth * 0.20;
      context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      context.restore();
    };

    const render = (time: number) => {
      if (!running) return;
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;
      context.clearRect(0, 0, width, height);

      const environment = images.get("environment");
      if (environment) drawEnvironment(environment);

      // The asset layers are embedded in the same environment, not floating over an empty canvas.
      for (const layer of LAYERS) {
        const image = images.get(layer.key);
        if (image) drawImageLayer(image, layer, time);
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
