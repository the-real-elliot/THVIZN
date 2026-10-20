"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * THVIZN Variant 2: High-End White Tone Curved Gradient with Deeper Stone Silver Contrast
 * - Defined white curved gradient spotlight with a slightly darker, richer stone-silver backdrop
 * - Maintains 100% monochromatic clean stone/lunar palette
 * - Radiant white core tapering into sleek metallic stone shadows
 * - Sculpted lateral vignettes for enhanced depth and runway contrast
 * - Smooth scroll parallax
 * - Subtle 35mm micro-grain texture
 */
export default function MonochromeBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. BASE STUDIO CANVAS: Deeper Stone Silver & Platinum Slate Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, 
              #e4ebf4 0%, 
              #d5deeb 20%, 
              #c3cedd 48%, 
              #b2bdce 76%, 
              #a1adc0 100%
            )
          `,
        }}
      />

      {/* 2. PRIMARY CELESTIAL WHITE DOME: Focused overhead white radiance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 1150px 650px at 50% -60px, 
              #ffffff 0%, 
              rgba(255, 255, 255, 0.85) 24%, 
              rgba(244, 248, 254, 0.55) 48%, 
              rgba(215, 226, 240, 0.20) 72%, 
              transparent 100%
            )
          `,
        }}
      />

      {/* 3. CURVED WHITE CRESCENT ARC: Curved white horizon beam */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 1350px 420px at 50% 150px, 
              rgba(255, 255, 255, 0.80) 0%, 
              rgba(255, 255, 255, 0.50) 30%, 
              rgba(225, 235, 248, 0.20) 62%, 
              transparent 95%
            )
          `,
        }}
      />

      {/* 4. MID-VIEWPORT STUDIO SPOTLIGHT: Focused circular white spotlight illuminating drops */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 850px at 50% 48%, 
              rgba(255, 255, 255, 0.78) 0%, 
              rgba(245, 249, 255, 0.45) 35%, 
              rgba(212, 224, 238, 0.15) 68%, 
              transparent 100%
            )
          `,
        }}
      />

      {/* 5. DEEPER SCULPTED LATERAL & CORNER VIGNETTES: Darker stone-silver framing for visible contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 42% 90% at 0% 50%, 
              rgba(142, 158, 180, 0.52) 0%, 
              rgba(170, 185, 206, 0.25) 50%, 
              transparent 85%
            ),
            radial-gradient(ellipse 42% 90% at 100% 50%, 
              rgba(142, 158, 180, 0.52) 0%, 
              rgba(170, 185, 206, 0.25) 50%, 
              transparent 85%
            )
          `,
        }}
      />

      {/* 6. LOWER BASE SHADING: Deepens the page bottom and footer area */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 1100px 500px at 50% 100%, 
              rgba(148, 164, 186, 0.40) 0%, 
              rgba(175, 190, 210, 0.20) 45%, 
              transparent 85%
            ),
            radial-gradient(ellipse 1000px 400px at 50% 88%, 
              rgba(255, 255, 255, 0.65) 0%, 
              rgba(235, 243, 252, 0.35) 40%, 
              transparent 85%
            )
          `,
        }}
      />

      {/* 7. Fine 35mm Analog Micro-Grain Texture */}
      <div className="absolute inset-0 opacity-[0.024] mix-blend-multiply bg-repeat bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
}
