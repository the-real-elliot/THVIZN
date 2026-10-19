"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth, rhythmic progress from 0% to 100% over ~1.1s
    const startTime = Date.now();
    const duration = 1100;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFading(true);
          setTimeout(() => {
            setVisible(false);
          }, 450);
        }, 150);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      aria-label="Skip Loading"
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-400 ease-out ${
        fading ? "opacity-0 pointer-events-none scale-102" : "opacity-100 scale-100"
      }`}
    >
      {/* Minimal Skip Button Top Right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 z-50 text-[9px] font-mono font-bold tracking-widest text-slate-400 hover:text-black uppercase px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
      >
        <span>SKIP</span>
        <span>✕</span>
      </button>

      {/* Center Group: Black Logo + Sleek Aesthetic Progress Bar */}
      <div className="flex flex-col items-center justify-center">
        {/* Solid Black THVIZN Logo */}
        <div className="relative w-16 sm:w-20 h-11 sm:h-14 transition-transform duration-300">
          <Image
            src="/images/star-logo-black.png"
            alt="THVIZN Logo"
            fill
            sizes="80px"
            className="object-contain"
            priority
          />
        </div>

        {/* Minimal Aesthetic Loading Bar */}
        <div className="w-32 sm:w-40 h-[2px] bg-black/10 rounded-full overflow-hidden mt-6 relative">
          <div
            className="h-full bg-black rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Subtle Micro-Typography */}
        <div className="flex items-center justify-between w-32 sm:w-40 mt-2 text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          <span>THVIZN</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
