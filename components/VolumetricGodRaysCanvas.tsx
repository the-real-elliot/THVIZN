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

    let animId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let frame = 0;

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      frame++;
      // Only redraw every 3 frames for buttery 60fps performance and minimal CPU
      if (frame % 3 === 0) {
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
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-1 w-full h-full opacity-40 mix-blend-screen"
    />
  );
}
