"use client";

import React from "react";
import Leaderboard from "@/components/Leaderboard";
import Scroll3DText from "@/components/Scroll3DText";
import Link from "next/link";
import { ArrowLeft, Sparkles, ArrowRight } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="min-h-[90vh] bg-transparent text-[#090a10] relative">
      {/* Top Navigation Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-tech font-bold text-slate-700 hover:text-black uppercase tracking-widest px-4 py-2 rounded-full bg-white/90 border border-black/10 hover:border-black/30 backdrop-blur-xl transition-all hover:scale-105 shadow-sm group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Main Leaderboard Section with Animated Monochrome Spotlight */}
      <Leaderboard />

      {/* Bottom VIP CTA Card */}
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white/90 p-8 sm:p-10 rounded-[28px] border border-black/10 shadow-md space-y-4 backdrop-blur-2xl curved-landscape-card relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-black/10 text-[#090a10] text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={11} className="text-slate-700" />
            <span>JOIN THE HALL OF FAME</span>
          </div>

          <div>
            <Scroll3DText
              as="h3"
              variant="chrome"
              className="text-lg sm:text-2xl font-display font-black uppercase tracking-tight block text-[#090a10]"
            >
              WANT TO REACH THE TOP 5?
            </Scroll3DText>
          </div>

          <p className="text-xs text-slate-600 font-tech max-w-md mx-auto leading-relaxed">
            Browse our latest streetwear drops, 420 GSM heavyweight hoodies, and acid-washed specimens. Collect drops to claim early VIP reservations.
          </p>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#090a10] hover:bg-black text-white text-xs font-display font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-md hover:scale-105 cursor-pointer"
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
