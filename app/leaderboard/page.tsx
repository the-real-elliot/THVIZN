"use client";

import React from "react";
import Leaderboard from "@/components/Leaderboard";
import Scroll3DText from "@/components/Scroll3DText";
import Link from "next/link";
import { ArrowLeft, Sparkles, ArrowRight } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="min-h-[90vh] bg-transparent text-white relative">
      {/* Top Navigation Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-tech font-bold text-zinc-400 hover:text-white uppercase tracking-widest px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 backdrop-blur-xl transition-all hover:scale-105 shadow-lg group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Main Leaderboard Section with Animated Monochrome Spotlight */}
      <Leaderboard />

      {/* Bottom VIP CTA Card */}
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-8 sm:p-10 rounded-[28px] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] space-y-4 backdrop-blur-2xl curved-landscape-card relative overflow-hidden">
          {/* Subtle ambient light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-zinc-300 text-[10px] font-tech font-bold uppercase tracking-widest">
            <Sparkles size={11} className="text-[#9f1239]" />
            <span>JOIN THE HALL OF FAME</span>
          </div>

          <div>
            <Scroll3DText
              as="h3"
              variant="chrome"
              className="text-lg sm:text-2xl font-display font-black uppercase tracking-tight block"
            >
              WANT TO REACH THE TOP 5?
            </Scroll3DText>
          </div>

          <p className="text-xs text-zinc-400 font-tech max-w-md mx-auto leading-relaxed">
            Browse our latest streetwear drops, 420 GSM heavyweight hoodies, and acid-washed specimens. Collect drops to claim early VIP reservations.
          </p>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black text-xs font-display font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105"
            >
              <span>Shop Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
