"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Global Curvy Circle Gradient Monochrome Background
 * - Dark noir gothic streetwear atmosphere (#060609 base)
 * - Curvy circular gradient layers with subtle silver/white luminance arcs
 * - Multiple layered circular radial gradients (upper, mid-body, and lower)
 * - Deep obsidian perimeter & cinematic edge vignette so text NEVER washes out
 * - Stable, fluid scroll parallax
 * - 35mm analog gritty micro-grain texture
 */
export default function MonochromeBackground() {
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      lastScrollY.current = currentScrollY;

      if (!ticking) {
        rafId.current = window.requestAnimationFrame(() => {
          setScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const parallaxOffset = (scrollY * 0.16) % 600;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Graphite Smoked Slate Base (Noticeably lighter than pitch-black void) */}
      <div className="absolute inset-0 bg-[#0e0f18]" />

      {/* 2. PRIMARY CURVY CIRCLE GRADIENT (Upper-center circular spotlight with silver-white luminescence) */}
      <div
        className="absolute inset-0 will-change-transform transition-transform duration-150 ease-out"
        style={{
          transform: `translate3d(0, ${-parallaxOffset * 0.35}px, 0)`,
          background: `
            radial-gradient(circle 1100px at 50% 18%, 
              rgba(255, 255, 255, 0.45) 0%, 
              rgba(235, 240, 255, 0.30) 25%, 
              rgba(180, 190, 225, 0.18) 48%, 
              rgba(40, 44, 68, 0.60) 72%, 
              #0e0f18 100%
            )
          `,
        }}
      />

      {/* 3. SECONDARY CURVY CIRCLE GRADIENT (Mid-body circular ambient orb) */}
      <div
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(0, ${-parallaxOffset * 0.22}px, 0)`,
          background: `
            radial-gradient(circle 950px at 50% 58%, 
              rgba(255, 255, 255, 0.35) 0%, 
              rgba(225, 232, 252, 0.20) 30%, 
              rgba(150, 162, 200, 0.12) 55%, 
              transparent 100%
            )
          `,
        }}
      />

      {/* 4. LATERAL CURVY CIRCULAR ACCENT ARCS (Left and Right curved luminous orbs) */}
      <div
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(0, ${-parallaxOffset * 0.15}px, 0)`,
          background: `
            radial-gradient(circle 800px at 12% 42%, rgba(255, 255, 255, 0.28) 0%, rgba(210, 220, 250, 0.14) 38%, transparent 70%),
            radial-gradient(circle 800px at 88% 52%, rgba(255, 255, 255, 0.26) 0%, rgba(210, 220, 250, 0.12) 38%, transparent 70%)
          `,
        }}
      />

      {/* 5. LOWER CURVY CIRCLE GRADIENT (Illuminates catalogue, bottom cards & footer) */}
      <div
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 900px at 50% 90%, 
              rgba(255, 255, 255, 0.30) 0%, 
              rgba(220, 230, 255, 0.15) 35%, 
              rgba(140, 150, 190, 0.08) 60%, 
              transparent 85%
            )
          `,
        }}
      />

      {/* 6. Delicate Ambient Crimson Micro Core */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[65vw] h-[45vh] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(159, 18, 57, 0.40) 0%, transparent 70%)`,
        }}
      />

      {/* 7. 35mm Gritty Analog Micro-Grain Texture */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay bg-repeat bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* 8. Soft Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45 pointer-events-none" />
    </div>
  );
}
