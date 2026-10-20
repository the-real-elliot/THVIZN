"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ArrowDown, ChevronRight, Sparkles } from "lucide-react";
import { TOP_CUSTOMERS } from "@/lib/products-data";
import Scroll3DText from "@/components/Scroll3DText";

export default function HeroLandscapeFrame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const customers = TOP_CUSTOMERS;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[#090a10] text-white border-black shadow-sm";
      case 2:
        return "bg-[#334155] text-white border-[#334155]";
      case 3:
        return "bg-[#64748b] text-white border-[#64748b]";
      default:
        return "bg-black/[0.06] text-[#090a10] border-black/10";
    }
  };

  const getTierColor = (badge: string) => {
    switch (badge) {
      case "DIAMOND COLLECTOR":
        return "bg-black/[0.06] text-[#090a10] border-black/20 shadow-sm";
      case "PLATINUM VIP":
        return "bg-black/[0.04] text-[#1e293b] border-black/15";
      case "GOLD MEMBER":
        return "bg-black/[0.03] text-slate-700 border-black/10";
      default:
        return "bg-black/[0.02] text-slate-500 border-black/5";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-none border-y border-black/10 bg-white/95 sm:bg-white/75 sm:backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-row items-stretch h-[410px] sm:h-[450px] md:h-[540px] lg:h-[590px] xl:h-[620px] select-none"
    >
      {/* ========================================================================= */}
      {/* LEFT COLUMN: LANDSCAPE PHOTO VISUAL (Streetwear / Urban Architecture)   */}
      {/* ========================================================================= */}
      <div className="relative w-[50%] sm:w-[52%] md:w-[78%] lg:w-[80%] xl:w-[82%] h-full overflow-hidden flex flex-col justify-between p-3 sm:p-5 md:p-8 lg:p-10 group">
        {/* Background Landscape Photo with Soft Parallax */}
        <div
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{
            transform: `scale(1.04) translate3d(${mousePos.x * 10}px, ${mousePos.y * 8}px, 0px)`,
            transition: "transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)",
          }}
        >
          <Image
            src="/images/hero-urban-silver.jpg"
            alt="THVIZN Urban Streetwear Landscape"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 50vw, 80vw"
            className="object-cover object-center filter grayscale contrast-[118%] brightness-[82%]"
          />
        </div>

        {/* Sophisticated Silver-Noir Lighting & Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/30 via-transparent to-black/20" />

        {/* TOP ACCENT: Brand Tag / HUD */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/15 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wider text-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">THVIZN // ARCHIVE FW26</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono font-bold text-zinc-300 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded border border-white/15">
            420 GSM
          </div>
        </div>

        {/* BOTTOM HUD: Brand Typography & Direct Action */}
        <div className="relative z-10 space-y-1.5 sm:space-y-3">
          <div className="space-y-0.5 sm:space-y-1">
            <div className="hidden sm:inline-flex items-center gap-1.5 text-[9.5px] font-tech font-bold text-zinc-300 uppercase tracking-widest">
              <span>DROP 01</span>
              <span>•</span>
              <span>LIMITED SPECIMENS</span>
            </div>

            <h1 className="font-display font-black text-xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.14em] sm:tracking-[0.16em] uppercase text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              THVIZN
            </h1>

            <p className="text-[9px] sm:text-xs md:text-sm font-bold text-zinc-200 tracking-wider uppercase drop-shadow-sm line-clamp-1 sm:line-clamp-none">
              THE VISION • MUMBAI / TOKYO // 420 GSM SPECIMENS
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-0.5 sm:pt-1 flex items-center gap-2">
            <a
              href="#catalogue"
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-zinc-200 text-[#090a10] px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[8.5px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>EXPLORE</span>
              <ArrowDown size={11} className="transition-transform group-hover:translate-y-0.5 shrink-0" />
            </a>

            <span className="hidden md:inline-block text-[10px] font-mono text-zinc-300">
              [PAN-INDIA EXPRESS SHIPPING]
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: CORNER-RIGHT TOP 5 LEADERBOARD                             */}
      {/* ========================================================================= */}
      <div className="relative w-[52%] sm:w-[50%] md:w-[24%] lg:w-[22%] xl:w-[20%] h-full flex flex-col justify-between p-2 sm:p-3 md:p-3.5 lg:p-4 border-l border-black/10 bg-white/92 backdrop-blur-2xl overflow-hidden">
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-radial-star-glow rounded-full blur-2xl opacity-20 pointer-events-none" />

        {/* ----------------- MOBILE VIEW (< md): HIGHLY COMPACT 5-ROW LEADERBOARD ----------------- */}
        <div className="flex md:hidden flex-col justify-between h-full w-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-black/[0.08]">
            <div className="flex items-center gap-1 min-w-0">
              <div className="w-4 h-4 rounded-full bg-black/[0.06] border border-black/10 flex items-center justify-center text-[#090a10] shrink-0">
                <Trophy size={9} />
              </div>
              <span className="font-display font-black text-[10.5px] sm:text-xs uppercase tracking-tight text-[#090a10] truncate">
                TOP 5
              </span>
            </div>

            <div className="flex items-center gap-1 bg-black/[0.04] border border-black/10 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-[#090a10] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse shrink-0" />
              <span>LIVE</span>
            </div>
          </div>

          {/* All 5 Ranks: Sleek Micro-Rows with Zero Glitches & Zero Overflow */}
          <div className="space-y-1.5 my-auto py-1">
            {customers.slice(0, 5).map((cust) => (
              <div
                key={cust.rank}
                className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-md border transition-all ${
                  cust.rank === 1
                    ? "bg-white border-black/20 shadow-2xs"
                    : "bg-white/60 border-black/[0.07]"
                }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <span
                    className={`w-3.5 h-3.5 rounded text-[8px] font-bold font-tech flex items-center justify-center shrink-0 border ${getRankBadgeClass(
                      cust.rank
                    )}`}
                  >
                    #{cust.rank}
                  </span>
                  <span className="font-display font-bold text-[9.5px] sm:text-[10.5px] text-[#090a10] truncate">
                    {cust.name}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] font-tech font-extrabold text-[#090a10]">
                    {cust.orderCount} drops
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Footer Link */}
          <div className="pt-1 border-t border-black/[0.08] flex items-center justify-between text-[8.5px] font-bold">
            <span className="text-slate-500 uppercase tracking-wider font-mono">
              VERIFIED
            </span>
            <Link
              href="/leaderboard"
              className="text-[#090a10] hover:text-black flex items-center gap-0.5 uppercase tracking-wider font-tech hover:underline"
            >
              <span>BOARD</span>
              <ChevronRight size={10} />
            </Link>
          </div>
        </div>

        {/* ----------------- DESKTOP VIEW (>= md): SLEEK CORNER-RIGHT HIGH DENSITY COLUMN ----------------- */}
        <div className="hidden md:flex flex-col justify-between h-full w-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-black/[0.05] border border-black/10 flex items-center justify-center text-[#090a10] shadow-sm">
                <Trophy size={13} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] lg:text-xs font-display font-black uppercase tracking-tight text-[#090a10] block truncate">
                  TOP 5 COLLECTORS
                </span>
                <p className="text-[8.5px] lg:text-[9px] text-slate-500 font-bold tracking-wider truncate">
                  Verified Street Ranks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-black/[0.04] border border-black/10 px-2 py-0.5 rounded-full text-[8.5px] font-bold text-[#090a10] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* High-Density Top 5 Rows */}
          <div className="space-y-1.5 my-auto py-1">
            {customers.slice(0, 5).map((cust) => (
              <div
                key={cust.rank}
                className={`p-2 rounded-lg border backdrop-blur-md transition-all ${
                  cust.rank === 1
                    ? "bg-white border-black/25 shadow-xs"
                    : "bg-white/60 border-black/10 hover:border-black/20 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded font-bold text-[9px] flex items-center justify-center border font-tech shrink-0 shadow-2xs ${getRankBadgeClass(
                        cust.rank
                      )}`}
                    >
                      #{cust.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-display font-bold text-[10.5px] lg:text-[11.5px] uppercase tracking-tight text-[#090a10] truncate">
                          {cust.name}
                        </span>
                        {cust.rank <= 3 && (
                          <span
                            className={`text-[6.5px] font-tech font-bold uppercase px-1 py-0.2 rounded border tracking-wider shrink-0 ${getTierColor(
                              cust.badge
                            )}`}
                          >
                            {cust.badge.split(" ")[0]}
                          </span>
                        )}
                      </div>
                      <span className="text-[8px] text-slate-500 font-tech block truncate">
                        {cust.city}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10.5px] lg:text-[11px] font-tech font-extrabold text-[#090a10]">
                      ₹{cust.totalSpent.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[8px] font-tech text-slate-500">
                      {cust.orderCount} drops
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Footer Info & Link */}
          <div className="pt-2 border-t border-black/[0.08] flex items-center justify-between text-[9.5px]">
            <span className="text-[8px] text-slate-500 font-tech truncate">
              UPDATED HOURLY
            </span>
            <Link
              href="/leaderboard"
              className="font-bold text-[#090a10] hover:text-black flex items-center gap-0.5 font-tech uppercase tracking-wider text-[9px] group hover:underline shrink-0"
            >
              <span>VIEW FULL</span>
              <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
