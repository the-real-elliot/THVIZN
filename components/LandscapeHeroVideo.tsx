"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowDown, Sparkles } from "lucide-react";

export default function LandscapeHeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // 3D / 4D Scroll & Spatial Tilt States
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Active Infinite Looping & Autoplay Watchdog across all devices & browsers
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Enforce HTML5 video policies strictly for iOS Safari, Chrome Android & Desktop
    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
    vid.loop = true;

    const playVideo = () => {
      const p = vid.play();
      if (p !== undefined) {
        p.catch(() => {
          // Autoplay retry with mute ensured
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    };

    playVideo();

    // 100% Seamless Infinite Loop: If browser pauses at EOF or fails native loop
    const handleEnded = () => {
      vid.currentTime = 0;
      playVideo();
    };

    // If currentTime stalls or approaches EOF, cycle back to 0 seamlessly
    const handleTimeUpdate = () => {
      if (vid.duration && !isNaN(vid.duration) && isFinite(vid.duration) && vid.duration > 0) {
        if (vid.currentTime >= vid.duration - 0.08) {
          vid.currentTime = 0;
          playVideo();
        }
      }
    };

    // Auto-resume if tab was hidden and becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden && vid.paused) {
        playVideo();
      }
    };

    vid.addEventListener("ended", handleEnded);
    vid.addEventListener("timeupdate", handleTimeUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      vid.removeEventListener("ended", handleEnded);
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const heroHeight = 600;
  const scrollProgress = Math.min(1, Math.max(0, scrollY / heroHeight));

  const videoScale = 1.02 + scrollProgress * 0.15;
  const tiltX = -mousePos.y * 3.5;
  const tiltY = mousePos.x * 4.5;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] sm:h-[520px] md:h-[560px] lg:h-full lg:min-h-[580px] xl:min-h-[620px] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/[0.12] shadow-[0_30px_70px_rgba(0,0,0,0.9),inset_0_0_60px_rgba(0,0,0,0.65)] bg-[#050507] curved-landscape-screen"
      style={{ perspective: "1200px" }}
    >
      {/* Subtle Panoramic Curved Screen Cylindrical Lighting Overlay */}
      <div className="absolute inset-0 z-[4] pointer-events-none bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      <div className="absolute inset-0 z-[4] pointer-events-none rounded-[24px] sm:rounded-[32px] ring-1 ring-inset ring-white/10" />

      {/* ================= 1. 3D VIDEO BACKGROUND PLANE (Y2K STREETWEAR MODELS) ================= */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
        style={{
          transform: `scale(${videoScale}) rotateX(${tiltX * 0.4}deg) rotateY(${tiltY * 0.4}deg)`,
          transformOrigin: "center center",
          transition: "transform 0.12s cubic-bezier(0.1, 0.9, 0.2, 1)",
        }}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onError={() => setVideoError(true)}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {});
              }
            }}
            className="w-full h-full object-cover object-center filter grayscale contrast-[122%] brightness-[72%]"
          >
            <source src="/videos/thvizn-landscape-hero.webm" type="video/webm" />
            <source src="/videos/thvizn-landscape-hero.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src="/images/urban-landscape-hero.jpg"
              alt="THVIZN Streetwear Editorial"
              fill
              sizes="100vw"
              priority
              className="object-cover object-center filter grayscale contrast-[125%] brightness-[60%]"
            />
          </div>
        )}
      </div>

      {/* ================= 2. GOTHIC NOIR VIGNETTE & FILM OVERLAYS ================= */}
      <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[#050507]/95 via-transparent to-[#050507]/80" />
      <div className="absolute inset-0 z-[2] pointer-events-none bg-radial-vignette opacity-80" />

      {/* 35mm Analog Grain Texture */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-25 mix-blend-overlay bg-repeat bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* ================= 3. Y2K CAMCORDER HUD CORNER ACCENTS ================= */}
      {/* Top Right: Streetwear Tag */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-md text-[10px] font-thinoo font-bold tracking-wider text-zinc-300">
          <span className="text-white font-bold">THVIZN</span> // ARCHIVE FW26
        </div>
      </div>

      {/* ================= 4. CENTER FLOATING BRAND CREST (PLATINUM CHROME & WHITE) ================= */}
      <div
        className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(${mousePos.x * 15}px, ${mousePos.y * 10}px, 20px) rotateX(${tiltX * 0.6}deg) rotateY(${tiltY * 0.6}deg)`,
          transition: "transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1)",
        }}
      >
        <div className="space-y-2 mb-4">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full text-[10px] font-thinoo font-bold tracking-widest text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239] animate-ping" />
            <span className="text-white font-bold tracking-widest">STREETWEAR FILM // Y2K</span>
          </div>

          <h1 className="font-thinoo font-bold text-3xl sm:text-5xl lg:text-6xl tracking-[0.22em] uppercase text-white/95 drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] text-contrast-deep">
            THVIZN
          </h1>

          <p className="text-xs sm:text-sm font-thinoo font-bold text-zinc-200 tracking-[0.16em] uppercase text-contrast-crisp">
            THE VISION • MUMBAI / TOKYO // 420 GSM SPECIMENS
          </p>
        </div>

        {/* Bottom Specs & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 pointer-events-auto">
          <div className="flex items-center gap-2 text-[10px] font-thinoo font-bold tracking-wider text-zinc-400">
            <span className="text-zinc-200 font-bold">DROP 01</span>
            <span>•</span>
            <span>OVERSIZED HOODIES & TEES</span>
          </div>

          <a
            href="#catalogue"
            className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-[10px] font-thinoo font-bold uppercase tracking-[0.16em] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <span>EXPLORE CATALOGUE</span>
            <ArrowDown size={12} className="transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
