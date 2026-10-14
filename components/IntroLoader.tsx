"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [doorsOpening, setDoorsOpening] = useState(false);
  const [progress, setProgress] = useState(12);
  const [fullyOpened, setFullyOpened] = useState(false);

  useEffect(() => {
    // Smooth, rhythmic progress counter from 12% to 100% over ~850ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + 16);
      });
    }, 110);

    // Trigger 3D wardrobe doors swinging wide open
    const openTimer = setTimeout(() => {
      setDoorsOpening(true);
    }, 850);

    // Give user clear, ample time (~1.6s) to witness and admire the 3D wardrobe interior & clothes rack
    const closeTimer = setTimeout(() => {
      setFullyOpened(true);
      setTimeout(() => {
        setVisible(false);
      }, 450);
    }, 2450);

    return () => {
      clearInterval(interval);
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleDismiss = () => {
    setDoorsOpening(true);
    setTimeout(() => {
      setFullyOpened(true);
      setTimeout(() => {
        setVisible(false);
      }, 200);
    }, 120);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      aria-label="Skip Intro"
      className={`fixed inset-0 z-[100] bg-[#050508] overflow-hidden cursor-pointer select-none transition-all duration-500 ease-out ${
        fullyOpened ? "opacity-0 pointer-events-none scale-105 filter blur-sm" : "opacity-100 scale-100"
      }`}
      style={{ perspective: "1500px" }}
    >
      {/* Quick Skip Button Top Right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 bg-black/60 hover:bg-white text-zinc-300 hover:text-black border border-white/20 hover:border-white px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-widest backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 uppercase cursor-pointer"
      >
        <span>Skip</span>
        <span className="text-[12px] leading-none">✕</span>
      </button>
      {/* ================= 1. 3D ATELIER WARDROBE INTERIOR (BEHIND THE DOORS) ================= */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#08080f] via-[#050508] to-[#030305] flex flex-col items-center justify-center pointer-events-none overflow-hidden"
        style={{
          transform: doorsOpening ? "translateZ(0px) scale(1)" : "translateZ(-80px) scale(0.96)",
          transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Volumetric Overhead Atelier Downlight Beam */}
        <div
          className="absolute -top-24 inset-x-0 h-[70vh] pointer-events-none opacity-40 will-change-transform"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255, 255, 255, 0.45) 0%, rgba(220, 225, 250, 0.15) 45%, rgba(159, 18, 57, 0.08) 70%, transparent 100%)`,
          }}
        />

        {/* 3D Clothing Rail & Hangers Stage */}
        <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">
          {/* Top 3D Chrome Wardrobe Garment Rail Bar */}
          <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-zinc-800 via-zinc-200 to-zinc-800 shadow-[0_4px_25px_rgba(255,255,255,0.25)] border-y border-white/40 relative mb-2">
            <div className="absolute -top-3 left-10 w-2 h-3.5 bg-zinc-600 rounded-t" />
            <div className="absolute -top-3 right-10 w-2 h-3.5 bg-zinc-600 rounded-t" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-3.5 bg-zinc-500 rounded-t" />
          </div>

          {/* 3D Hanging Garments Container */}
          <div className="w-full flex items-start justify-center gap-4 sm:gap-8 pt-1">
            {/* GARMENT 1: 420 GSM Heavyweight Hoodie (Left Item) */}
            <div
              className={`flex flex-col items-center transition-all duration-700 ${
                doorsOpening ? "translate-y-0 opacity-100 rotate-[-1deg]" : "translate-y-3 opacity-80"
              }`}
            >
              {/* Chrome Wire Hanger */}
              <div className="w-16 sm:w-20 h-5 border-t-2 border-l-2 border-r-2 border-zinc-400 rounded-t-full relative -mb-1 opacity-75">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-3 border-t-2 border-l-2 border-zinc-300 rounded-tl-full" />
              </div>

              {/* Garment Silhouette Card */}
              <div className="w-20 min-[380px]:w-24 sm:w-32 h-32 min-[380px]:h-36 sm:h-44 rounded-lg bg-gradient-to-b from-[#181824] to-[#0c0c14] border border-white/15 p-2 sm:p-2.5 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.85)] relative overflow-hidden group">
                <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-zinc-400">
                  <span className="text-[#e11d48] font-bold">420 GSM</span>
                  <span>HOODIE</span>
                </div>
                <div className="my-auto text-center space-y-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center">
                    <span className="text-white text-xs font-black">H1</span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-thinoo font-bold tracking-wider text-zinc-300 block uppercase">
                    OBSIDIAN DROP
                  </span>
                </div>
                <span className="text-[7px] font-mono text-zinc-500 text-center uppercase">
                  DROP SHOULDER
                </span>
              </div>
            </div>

            {/* GARMENT 2: 280 GSM Signature Graphic Boxy Tee (Center Featured Item - Hero) */}
            <div
              className={`flex flex-col items-center transition-all duration-700 z-10 ${
                doorsOpening ? "translate-y-0 opacity-100 scale-105" : "translate-y-2 opacity-90 scale-100"
              }`}
            >
              {/* Center Polished Steel Hanger */}
              <div className="w-20 sm:w-24 h-6 border-t-2 border-l-2 border-r-2 border-white rounded-t-full relative -mb-1 shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-2.5 h-3.5 border-t-2 border-l-2 border-white rounded-tl-full" />
              </div>

              {/* Center Garment Silhouette Card */}
              <div className="w-24 min-[380px]:w-28 sm:w-36 h-36 min-[380px]:h-40 sm:h-48 rounded-lg bg-gradient-to-b from-[#202030] to-[#0f0f18] border border-white/30 p-2.5 sm:p-3 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.95)] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="flex items-center justify-between text-[7px] sm:text-[9px] font-thinoo font-bold">
                  <span className="text-emerald-400">FEATURED</span>
                  <span className="text-zinc-400 font-mono">280 GSM</span>
                </div>

                <div className="my-auto text-center space-y-1 sm:space-y-1.5">
                  <div className="relative w-14 h-8 sm:w-16 sm:h-9 mx-auto opacity-95 filter drop-shadow-[0_0_12px_rgba(255,26,42,0.45)]">
                    <Image
                      src="/images/star-logo.png"
                      alt="THVIZN Eye Star"
                      fill
                      sizes="64px"
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-thinoo font-bold tracking-[0.2em] text-white block uppercase">
                    CYBER EYE
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-mono text-zinc-400 block">
                    PURE COMBED COTTON
                  </span>
                </div>

                <div className="text-center bg-white/10 rounded-full py-0.5">
                  <span className="text-[7px] sm:text-[8px] font-mono text-zinc-200 uppercase font-bold tracking-wider">
                    ARCHIVE FW26
                  </span>
                </div>
              </div>
            </div>

            {/* GARMENT 3: Acid Wash Vintage Tee (Right Item) */}
            <div
              className={`flex flex-col items-center transition-all duration-700 ${
                doorsOpening ? "translate-y-0 opacity-100 rotate-[1deg]" : "translate-y-3 opacity-80"
              }`}
            >
              {/* Chrome Wire Hanger */}
              <div className="w-16 sm:w-20 h-5 border-t-2 border-l-2 border-r-2 border-zinc-400 rounded-t-full relative -mb-1 opacity-75">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-3 border-t-2 border-l-2 border-zinc-300 rounded-tl-full" />
              </div>

              {/* Garment Silhouette Card */}
              <div className="w-20 min-[380px]:w-24 sm:w-32 h-32 min-[380px]:h-36 sm:h-44 rounded-lg bg-gradient-to-b from-[#181824] to-[#0c0c14] border border-white/15 p-2 sm:p-2.5 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.85)] relative overflow-hidden group">
                <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-zinc-400">
                  <span className="text-zinc-300 font-bold">280 GSM</span>
                  <span>VINTAGE</span>
                </div>
                <div className="my-auto text-center space-y-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center">
                    <span className="text-zinc-300 text-xs font-black">AW</span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-thinoo font-bold tracking-wider text-zinc-300 block uppercase">
                    ACID WASH
                  </span>
                </div>
                <span className="text-[7px] font-mono text-zinc-500 text-center uppercase">
                  MINERAL DYED
                </span>
              </div>
            </div>
          </div>

          {/* Holographic 3D Status Banner below the Clothing Rack */}
          <div className="mt-8 text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/15 px-4 py-1.5 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239] animate-ping" />
              <span className="text-[10px] font-thinoo font-bold tracking-[0.25em] uppercase text-zinc-200">
                3D CLOTHING WARDROBE // ATELIER UNLOCKED
              </span>
            </div>
            <p className="text-[11px] font-thinoo font-bold tracking-[0.2em] text-zinc-400 uppercase">
              ENTERING STREETWEAR ARCHIVE
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. 3D LEFT WARDROBE DOOR ================= */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-[#090910] border-r border-white/20 shadow-[25px_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex items-center justify-end will-change-transform"
        style={{
          transformOrigin: "left center",
          transform: doorsOpening
            ? "rotateY(-110deg) translateZ(40px)"
            : "rotateY(0deg) translateZ(0px)",
          transition: "transform 1.05s cubic-bezier(0.16, 1, 0.3, 1)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Door Minimalist Metallic Vertical Paneling Lines */}
        <div className="absolute inset-y-0 left-8 sm:left-16 w-[1px] bg-white/[0.06]" />
        <div className="absolute inset-y-0 left-20 sm:left-40 w-[1px] bg-white/[0.03]" />
        <div className="absolute inset-y-0 right-12 w-[1px] bg-white/[0.04]" />

        {/* Satin-Steel Left Door Handle */}
        <div className="mr-3 sm:mr-6 w-2 h-24 sm:h-36 rounded-full bg-gradient-to-b from-white/35 via-white/15 to-zinc-700 border border-white/25 shadow-[0_0_15px_rgba(0,0,0,0.8)]" />
      </div>

      {/* ================= 3. 3D RIGHT WARDROBE DOOR ================= */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-[#090910] border-l border-white/20 shadow-[-25px_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex items-center justify-start will-change-transform"
        style={{
          transformOrigin: "right center",
          transform: doorsOpening
            ? "rotateY(110deg) translateZ(40px)"
            : "rotateY(0deg) translateZ(0px)",
          transition: "transform 1.05s cubic-bezier(0.16, 1, 0.3, 1)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Door Minimalist Metallic Vertical Paneling Lines */}
        <div className="absolute inset-y-0 right-8 sm:right-16 w-[1px] bg-white/[0.06]" />
        <div className="absolute inset-y-0 right-20 sm:right-40 w-[1px] bg-white/[0.03]" />
        <div className="absolute inset-y-0 left-12 w-[1px] bg-white/[0.04]" />

        {/* Satin-Steel Right Door Handle */}
        <div className="ml-3 sm:ml-6 w-2 h-24 sm:h-36 rounded-full bg-gradient-to-b from-white/35 via-white/15 to-zinc-700 border border-white/25 shadow-[0_0_15px_rgba(0,0,0,0.8)]" />
      </div>

      {/* ================= 4. CENTER VERTICAL LIGHT SLIT (THE UNLOCKING SEAM) ================= */}
      <div
        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-white/40 via-white to-[#e11d48] shadow-[0_0_25px_rgba(255,255,255,0.9)] transition-all duration-500 pointer-events-none ${
          doorsOpening ? "opacity-0 scale-y-150 blur-md" : "opacity-100 scale-y-100"
        }`}
      />

      {/* ================= 5. CENTER WARDROBE LOCK BADGE (DISSOLVES IMMEDIATELY ON DOOR OPEN) ================= */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-200 ease-out pointer-events-none ${
          doorsOpening ? "opacity-0 scale-90 blur-sm pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        <div className="relative p-7 sm:p-9 rounded-3xl bg-[#090912]/96 border border-white/25 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col items-center">
          {/* Translucent Brand Logo Emblem */}
          <div className="relative w-32 h-16 sm:w-40 sm:h-20 mb-2 opacity-90 filter drop-shadow-[0_0_20px_rgba(255,26,42,0.5)]">
            <Image
              src="/images/star-logo.png"
              alt="THVIZN Emblem"
              fill
              sizes="(max-width: 640px) 130px, 160px"
              className="object-contain"
              priority
            />
          </div>

          <span className="font-thinoo font-bold text-2xl sm:text-3xl tracking-[0.25em] uppercase text-white/95">
            THVIZN
          </span>

          <span className="text-[10px] font-thinoo font-bold tracking-[0.22em] uppercase text-zinc-400 mt-1">
            3D CLOTHING WARDROBE // 2026
          </span>

          {/* Linear Progress Bar */}
          <div className="w-32 sm:w-40 h-[2px] bg-white/10 mt-5 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-white via-zinc-200 to-[#e11d48] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-32 sm:w-40 mt-2 text-[9px] font-mono text-zinc-500">
            <span>{progress}%</span>
            <span>TAP TO ENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
}
