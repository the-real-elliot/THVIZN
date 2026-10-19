"use client";

import React from "react";

interface LiquidWaveTextProps {
  text: string;
  className?: string;
  subtext?: string;
}

export default function LiquidWaveText({ text, className = "", subtext }: LiquidWaveTextProps) {
  return (
    <div className={`relative select-none inline-block ${className}`}>
      {/* 
        ===================================================================
        SMOOTH FULLY-WHITE TEXT WITH CONTINUOUS LEFT-TO-RIGHT RED WAVES
        - Smooth, curved geometric typography (no jagged or sharp edges)
        - Crisp white base text
        - Continuous Left-to-Right Red Waves surfing inside letters
        ===================================================================
      */}
      <div className="relative inline-block overflow-hidden">
        {/* ================= LAYER 1: SMOOTH WHITE TEXT WITH LEFT-TO-RIGHT RED TSUNAMI SURGE ================= */}
        <span className="relative z-10 block font-extrabold uppercase tracking-tight transform-gpu tsunami-body">
          {text}
        </span>

        {/* ================= LAYER 2: UNDERTOW FLUID RED CROSS-CURRENT ================= */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-20 block font-extrabold uppercase tracking-tight pointer-events-none transform-gpu tsunami-undertow"
        >
          {text}
        </span>

        {/* ================= LAYER 3: RED WAVE CREST SHIMMER ================= */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-30 block font-extrabold uppercase tracking-tight pointer-events-none transform-gpu tsunami-crest"
        >
          {text}
        </span>
      </div>

      {subtext && (
        <span className="block text-[10px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase mt-1">
          {subtext}
        </span>
      )}
    </div>
  );
}
