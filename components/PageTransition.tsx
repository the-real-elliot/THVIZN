"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsTransitioning(true);
      setProgress(15);

      // Fast cinematic progression
      const t1 = setTimeout(() => setProgress(65), 80);
      const t2 = setTimeout(() => setProgress(100), 220);
      const t3 = setTimeout(() => {
        setIsTransitioning(false);
        setProgress(0);
      }, 420);

      window.scrollTo({ top: 0, behavior: "instant" });

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname]);

  return (
    <>
      {/* Top Luxury Progress Indicator (High-End Streetwear Bar) */}
      <div
        className={`fixed top-0 inset-x-0 h-[2.5px] z-50 pointer-events-none transition-opacity duration-300 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-[#9f1239] via-white to-zinc-200 shadow-[0_0_18px_rgba(255,255,255,0.6)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Anamorphic Horizon Lens Flash on Route Change */}
      <div
        className={`fixed inset-x-0 top-0 h-28 pointer-events-none z-45 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent transition-opacity duration-500 ease-out ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Main Content with Spring Slide & Crossfade */}
      <div
        key={pathname}
        className="animate-route-enter w-full min-h-full"
      >
        {children}
      </div>
    </>
  );
}
