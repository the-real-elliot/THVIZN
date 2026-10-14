"use client";

import React from "react";
import Link from "next/link";
import { TOP_CUSTOMERS } from "@/lib/products-data";
import { Trophy, Award, Flame, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import Scroll3DText from "@/components/Scroll3DText";

export default function Leaderboard({ compact = false }: { compact?: boolean }) {
  const customers = TOP_CUSTOMERS;

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]";
      case 2:
        return "bg-zinc-300 text-black border-zinc-300";
      case 3:
        return "bg-zinc-400 text-black border-zinc-400";
      default:
        return "bg-[#181824] text-zinc-400 border-[#262636]";
    }
  };

  const getTierColor = (badge: string) => {
    switch (badge) {
      case "DIAMOND COLLECTOR":
        return "bg-white/[0.08] text-white border-white/40 shadow-sm";
      case "PLATINUM VIP":
        return "bg-white/[0.05] text-zinc-200 border-white/20";
      case "GOLD MEMBER":
        return "bg-white/[0.03] text-zinc-300 border-white/10";
      default:
        return "bg-[#121218] text-zinc-400 border-[#20202a]";
    }
  };

  // Compact / Hero Arrangement
  if (compact) {
    return (
      <div className="relative bg-[#090912]/90 rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-[0_30px_70px_rgba(0,0,0,0.92)] border border-white/15 backdrop-blur-2xl overflow-hidden h-full flex flex-col justify-between curved-landscape-card">
        {/* Subtle Ambient Star Backlight */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-radial-star-glow rounded-full blur-3xl opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/20 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Trophy size={15} />
            </div>
            <div>
              <Scroll3DText
                as="h3"
                variant="chrome"
                className="text-xs sm:text-sm font-soria font-bold uppercase tracking-[0.08em] block"
              >
                <span className="text-white">TOP 5</span>{" "}
                <span className="text-[#e11d48]">COLLECTORS</span>
              </Scroll3DText>
              <p className="text-[10px] text-zinc-300 font-thinoo font-bold tracking-wider">
                Hall of Fame // Verified Street Ranks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#12121e]/90 border border-white/15 px-3 py-1 rounded-full text-[10px] font-tech font-bold text-zinc-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239] animate-pulse" />
            <span>LIVE RANKINGS</span>
          </div>
        </div>

        {/* Podium Top 3 */}
        <div className="space-y-2.5 mb-4">
          {customers.slice(0, 3).map((cust) => (
            <div
              key={cust.rank}
              className={`p-3.5 rounded-xl border backdrop-blur-md transition-all ${
                cust.rank === 1
                  ? "bg-[#181826]/90 border-white/25 shadow-[0_0_25px_rgba(255,255,255,0.06)]"
                  : "bg-[#101018]/80 border-white/10 hover:border-white/20 hover:bg-[#151522]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full font-bold text-[11px] flex items-center justify-center border font-tech shrink-0 shadow-md ${getRankBadgeColor(
                      cust.rank
                    )}`}
                  >
                    #{cust.rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs uppercase tracking-wide text-white">
                        {cust.name}
                      </span>
                      <span
                        className={`text-[8px] font-tech font-bold uppercase px-2 py-0.5 rounded-full border tracking-wider ${getTierColor(
                          cust.badge
                        )}`}
                      >
                        {cust.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-300 font-tech">{cust.city}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-tech font-extrabold text-white">
                    ₹{cust.totalSpent.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] font-tech text-zinc-300">
                    {cust.orderCount} drops
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ranks 4 & 5 Mini Strip */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-tech mb-4">
          {customers.slice(3, 5).map((cust) => (
            <div
              key={cust.rank}
              className="p-2.5 bg-[#101018]/80 border border-white/10 rounded-xl flex items-center justify-between"
            >
              <span className="text-zinc-300 truncate mr-1">
                #{cust.rank} {cust.name}
              </span>
              <span className="text-zinc-200 font-bold shrink-0">{cust.orderCount} drops</span>
            </div>
          ))}
        </div>

        {/* Footer info & Link */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
          <span className="text-[10px] text-zinc-300 font-tech">
            ★ Early VIP access for top collectors
          </span>
          <Link
            href="/leaderboard"
            className="text-zinc-200 hover:text-white font-tech font-bold uppercase text-[10px] flex items-center gap-1 transition-colors"
          >
            <span>Full Hall of Fame</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  // Full Page Arrangement (used on /leaderboard)
  return (
    <section className="bg-transparent py-12 sm:py-16 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#090912]/90 border border-white/15 text-zinc-200 px-4 py-1.5 rounded-full text-[11px] font-thinoo font-bold uppercase tracking-[0.2em] shadow-md backdrop-blur-md">
            <Trophy size={14} className="text-[#9f1239]" />
            <span>HALL OF FAME // TOP 5 DROP COLLECTORS</span>
          </div>

          <div>
            <Scroll3DText
              as="h2"
              variant="chrome"
              className="text-3xl sm:text-5xl md:text-6xl font-soria font-bold uppercase tracking-[0.08em] block drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
            >
              <span className="text-white">MOST DEDICATED</span>{" "}
              <span className="text-[#e11d48]">COLLECTORS</span>
            </Scroll3DText>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto font-thinoo font-bold tracking-wider leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            Live public leaderboard ranking our top drops collectors. High-tier collectors unlock 1-hour early drop access, VIP mystery boxes, and private discord passes.
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {customers.slice(0, 3).map((cust) => (
            <div
              key={cust.rank}
              className={`relative bg-[#090912]/90 rounded-[26px] sm:rounded-[30px] border p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 backdrop-blur-2xl curved-landscape-card overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] ${
                cust.rank === 1
                  ? "border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.12)] md:-translate-y-2.5"
                  : "border-white/[0.12] hover:border-white/25"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center border font-mono shadow-md ${getRankBadgeColor(
                    cust.rank
                  )}`}
                >
                  #{cust.rank}
                </span>

                <span
                  className={`text-[9px] font-black uppercase px-2.5 py-0.5 border rounded-full font-mono tracking-wider ${getTierColor(
                    cust.badge
                  )}`}
                >
                  {cust.badge}
                </span>
              </div>

              <div className="space-y-1 my-2">
                <h3 className="font-display font-black text-lg uppercase tracking-wide text-white">
                  {cust.name}
                </h3>
                <p className="text-xs text-zinc-300 font-tech">{cust.city}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Total Drops</div>
                  <div className="font-bold text-white font-tech">{cust.orderCount} Orders</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Total Spent</div>
                  <div className="font-black text-white font-mono text-sm">
                    ₹{cust.totalSpent.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ranks #4 and #5 Horizontal Strips */}
        <div className="space-y-3">
          {customers.slice(3, 5).map((cust) => (
            <div
              key={cust.rank}
              className="bg-[#090912]/90 border border-white/[0.12] hover:border-white/25 p-4 sm:p-5 rounded-[22px] sm:rounded-[26px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all backdrop-blur-xl curved-landscape-card shadow-lg hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-white/[0.08] text-zinc-200 border border-white/15 font-mono font-bold text-xs flex items-center justify-center">
                  #{cust.rank}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold uppercase text-white">{cust.name}</span>
                    <span className={`text-[8px] font-mono uppercase px-2 py-0.5 border rounded-full ${getTierColor(cust.badge)}`}>
                      {cust.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-300 font-tech">{cust.city}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Drops</div>
                  <div className="font-bold text-white font-tech">{cust.orderCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Spent</div>
                  <div className="font-black text-white font-mono">₹{cust.totalSpent.toLocaleString("en-IN")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
