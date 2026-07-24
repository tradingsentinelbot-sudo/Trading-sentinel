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
  { key: "backgroundFragments", depth: 0.10, width: 0.08, x: 0.80, y: 0.28, driftX: 2, driftY: 1, rotation: -0.003 },
  { key: "midground", depth: 0.20, width: 0.09, x: 0.84, y: 0.50, driftX: 3, driftY: 1.5, rotation: 0.003 },
  { key: "foregroundTop", depth: 0.28, width: 0.08, x: 0.90, y: 0.22, driftX: 4, driftY: 2, rotation: -0.003 },
  { key: "foregroundBottom", depth: 0.34, width: 0.12, x: 0.20, y: 0.84, driftX: 5, driftY: 2, rotation: 0.003 },
  { key: "foregroundLower", depth: 0.38, width: 0.08, x: 0.82, y: 0.82, driftX: 6, driftY: 2, rotation: -0.003 },
  // The monolith remains centered in the environment. Desktop is intentionally ~10% smaller.
  { key: "hero", depth: 1, width: 0.36, x: 0.50, y: 0.43, driftX: 9, driftY: 4, rotation: 0.0015 },
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
      scrollProgress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
    };

    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / Math.max(1, width) - 0.5) * 2;
      pointer.ty = (event.clientY / Math.max(1, height) - 0.5) * 2;
    };

    const drawEnvironment = (image: HTMLImageElement, time: number) => {
      const scale = Math.max(width / image.width, height / image.height) * 1.025;
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const cameraX = pointer.x * 4 + Math.sin(time * 0.00012) * 1.5 + scrollProgress * 5;
      const cameraY = pointer.y * -3 + Math.cos(time * 0.00010) * 1.2 + scrollProgress * 2;
      const x = (width - drawWidth) / 2 + cameraX;
      const y = (height - drawHeight) / 2 + cameraY;
      context.save();
      context.globalAlpha = 0.88;
      context.drawImage(image, x, y, drawWidth, drawHeight);
      context.restore();
    };

    const drawImageLayer = (image: HTMLImageElement, layer: Layer, time: number) => {
      const mobile = width < 768;
      const baseWidth = width * (mobile ? Math.min(0.86, layer.width * 1.47) : layer.width);
      const ratio = image.height / image.width;
      const drawWidth = baseWidth;
      const drawHeight = drawWidth * ratio;
      const scrollX = (scrollProgress - 0.35) * layer.driftX;
      const scrollY = (scrollProgress - 0.35) * layer.driftY;
      const presenceX = Math.sin(time * (0.00014 + layer.depth * 0.00006) + layer.depth * 4) * 2.4 * layer.depth;
      const presenceY = Math.cos(time * (0.00012 + layer.depth * 0.00005) + layer.depth * 3) * 1.8 * layer.depth;
      const pointerX = pointer.x * 10 * layer.depth;
      const pointerY = pointer.y * -7 * layer.depth;
      const x = width * (mobile ? 0.52 + (layer.x - 0.5) * 0.65 : layer.x) - drawWidth / 2 + scrollX + presenceX + pointerX;
      const y = height * (mobile ? 0.48 + (layer.y - 0.5) * 0.68 : layer.y) - drawHeight / 2 + scrollY + presenceY + pointerY;

      context.save();
      context.translate(x + drawWidth / 2, y + drawHeight / 2);
      context.rotate(layer.rotation + pointer.x * 0.002 * layer.depth);
      context.globalAlpha = layer.key === "hero" ? 0.88 : 0.18 + layer.depth * 0.16;
      context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      context.restore();
    };

    const render = (time: number) => {
      if (!running) return;
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;
      context.clearRect(0, 0, width, height);

      const environment = images.get("environment");
      if (environment) drawEnvironment(environment, time);
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

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true" />;
}
