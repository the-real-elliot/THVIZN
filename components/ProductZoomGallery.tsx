"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductDetailShot } from "@/lib/types";

interface ProductZoomGalleryProps {
  shots: ProductDetailShot[];
  productName: string;
  tag?: string;
  gsm?: number;
}

export default function ProductZoomGallery({
  shots,
  productName,
  tag,
  gsm,
}: ProductZoomGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [previewSize, setPreviewSize] = useState(480);

  // Desktop Hover & Zoom Lens state
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);
  const [lensState, setLensState] = useState<{
    lensX: number;
    lensY: number;
    lensSize: number;
    boxWidth: number;
    boxHeight: number;
  } | null>(null);

  // Mobile Carousel state
  const [mobileIndex, setMobileIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const ZOOM_SCALE = 2.0;

  useEffect(() => {
    setMounted(true);

    const updateSize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 1440) {
        setPreviewSize(440);
      } else if (window.innerWidth >= 1280) {
        setPreviewSize(420);
      } else {
        setPreviewSize(390);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Cleanly dismiss lens during active page scroll to prevent ghost lenses
    const handleScroll = () => {
      setActiveHoverIndex(null);
      setLensState(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Generous 2X zoom lens: covers previewSize / 2 (e.g. ~210px - 220px) to cover more of product
      const targetLens = Math.round(previewSize / ZOOM_SCALE);
      // Ensure lens doesn't overflow container width or height on smaller tiles
      const maxLensAllowed = Math.round(Math.min(rect.width * 0.82, rect.height * 0.82));
      const currentLensSize = Math.min(targetLens, maxLensAllowed);

      const maxX = Math.max(0, rect.width - currentLensSize);
      const maxY = Math.max(0, rect.height - currentLensSize);

      const lensX = Math.max(0, Math.min(maxX, mouseX - currentLensSize / 2));
      const lensY = Math.max(0, Math.min(maxY, mouseY - currentLensSize / 2));

      setActiveHoverIndex(index);
      setLensState({
        lensX,
        lensY,
        lensSize: currentLensSize,
        boxWidth: rect.width,
        boxHeight: rect.height,
      });
    },
    [previewSize]
  );

  const handleMouseLeave = useCallback(() => {
    setActiveHoverIndex(null);
    setLensState(null);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      setMobileIndex((prev) => (prev === shots.length - 1 ? 0 : prev + 1));
    } else if (diff < -45) {
      setMobileIndex((prev) => (prev === 0 ? shots.length - 1 : prev - 1));
    }
    setTouchStartX(null);
  };

  const activeShot = activeHoverIndex !== null ? shots[activeHoverIndex] : null;

  return (
    <div className="relative w-full">
      {/* ================= 1. DESKTOP GALLERY: TIGHT EDITORIAL GRID (GAP REDUCED, ZERO OVERLAY TEXTS) ================= */}
      <div className="hidden md:grid grid-cols-2 gap-2 sm:gap-2.5 relative">
        {shots.map((shot, idx) => {
          const isFirstLong = idx === 0;

          return (
            <div
              key={`${shot.url}-${idx}`}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={handleMouseLeave}
              className={`group relative w-full bg-[#f4f7fa] overflow-hidden shadow-xs hover:border-black/30 transition-colors cursor-crosshair select-none border border-black/10 ${
                isFirstLong
                  ? "col-span-2 aspect-[2/3] rounded-xl"
                  : "col-span-1 aspect-[3/4] sm:aspect-[4/5] rounded-lg"
              }`}
            >
              {/* High-Resolution Streetwear Image (100% Pure & Clean, Zero Overlay Texts) */}
              <div className="relative w-full h-full overflow-hidden pointer-events-none">
                <Image
                  src={shot.url}
                  alt={`${productName} — Angle ${idx + 1}`}
                  fill
                  sizes={
                    isFirstLong
                      ? "(max-width: 1024px) 100vw, 60vw"
                      : "(max-width: 1024px) 50vw, 30vw"
                  }
                  className="object-cover object-top select-none pointer-events-none"
                  priority={idx < 2}
                />
              </div>

              {/* Clean Amazon / Flipkart Style Square Cursor Lens Overlay (Enlarged for 2X Zoom) */}
              {activeHoverIndex === idx && lensState && (
                <div
                  className="absolute pointer-events-none border-2 border-black/70 bg-white/25 backdrop-blur-[0.5px] rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.12)] z-20"
                  style={{
                    width: `${lensState.lensSize}px`,
                    height: `${lensState.lensSize}px`,
                    left: `${lensState.lensX}px`,
                    top: `${lensState.lensY}px`,
                  }}
                >
                  {/* Subtle Technical Corner Reticles */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-black" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-black" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-black" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-black" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= 2. CLEAN SQUARE ZOOM PREVIEW: EXACTLY 2X DETAIL ZOOM ================= */}
      {mounted &&
        activeHoverIndex !== null &&
        lensState &&
        activeShot &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            aria-hidden="true"
            className="hidden lg:block fixed top-24 xl:top-28 right-6 xl:right-10 z-[9999] bg-[#f4f7fa] rounded-2xl border border-black/15 shadow-[0_25px_65px_rgba(0,0,0,0.22)] overflow-hidden pointer-events-none select-none animate-in fade-in zoom-in-95 duration-100"
            style={{
              width: `${lensState.lensSize * ZOOM_SCALE}px`,
              height: `${lensState.lensSize * ZOOM_SCALE}px`,
            }}
          >
            {/* Pure Square Magnified Viewport (Zero Stretch, Exactly 2X Magnification, Zero Overlay Text) */}
            <div className="relative w-full h-full overflow-hidden bg-[#f4f7fa]">
              <div
                className="absolute top-0 left-0 will-change-transform pointer-events-none"
                style={{
                  width: `${lensState.boxWidth * ZOOM_SCALE}px`,
                  height: `${lensState.boxHeight * ZOOM_SCALE}px`,
                  transform: `translate3d(-${lensState.lensX * ZOOM_SCALE}px, -${lensState.lensY * ZOOM_SCALE}px, 0)`,
                }}
              >
                <img
                  src={activeShot.url}
                  alt={activeShot.label}
                  draggable={false}
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ================= 3. MOBILE VIEW: CLEAN SWIPEABLE CAROUSEL & THUMBNAILS ================= */}
      <div className="md:hidden space-y-3">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-[3/4] w-full bg-[#f4f7fa] rounded-xl border border-black/10 overflow-hidden shadow-xs select-none"
        >
          {shots.map((shot, idx) => (
            <div
              key={`${shot.url}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-300 ${
                idx === mobileIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={shot.url}
                alt={`${productName} — Angle ${idx + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          ))}

          {/* Simple Counter Badge */}
          <span className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-md text-slate-800 font-mono text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border border-black/10 shadow-xs">
            0{mobileIndex + 1} / 0{shots.length}
          </span>

          {/* Nav Arrows */}
          {shots.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setMobileIndex((p) => (p === 0 ? shots.length - 1 : p - 1))}
                aria-label="Previous image"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center border border-black/10 shadow-xs"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setMobileIndex((p) => (p === shots.length - 1 ? 0 : p + 1))}
                aria-label="Next image"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center border border-black/10 shadow-xs"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip for Quick Tap */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {shots.map((shot, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMobileIndex(idx)}
              className={`relative w-16 h-20 rounded-md overflow-hidden border transition-all shrink-0 bg-[#f4f7fa] ${
                mobileIndex === idx
                  ? "border-[#090a10] ring-1 ring-black shadow-xs scale-102"
                  : "border-black/10 opacity-70"
              }`}
            >
              <Image src={shot.url} alt={`Angle ${idx + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
