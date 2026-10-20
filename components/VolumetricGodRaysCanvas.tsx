"use client";

import React, { useEffect, useRef } from "react";

/**
 * Clean Gothic Noir Atmospheric Canvas
 * Replaces gaming-like lasers and flying embers with an ultra-subtle,
 * high-fashion 35mm film grain & dark obsidian vignette (Sagacity / Genrage style).
 */
export default function VolumetricGodRaysCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const drawVignette = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // Ultra-subtle light stone pearlescent ambient sweep
      const vignette = ctx.createRadialGradient(
        width / 2,
        height * 0.2,
        Math.min(width, height) * 0.2,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      vignette.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      vignette.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    drawVignette();
    window.addEventListener("resize", drawVignette);

    return () => {
      window.removeEventListener("resize", drawVignette);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-1 w-full h-full opacity-40 mix-blend-screen"
    />
  );
}
