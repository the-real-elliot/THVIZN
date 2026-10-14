"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ArrowUpRight, Flame } from "lucide-react";

interface CatalogueLoopProps {
  products: Product[];
}

export default function CatalogueLoop({ products }: CatalogueLoopProps) {
  if (!products || products.length === 0) return null;

  // Duplicate items for infinite seamless scroll
  const loopItems = [...products, ...products, ...products];

  return (
    <section className="py-14 bg-[#060608] border-b border-[#181822] overflow-hidden relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-zinc-300 text-[11px] font-black uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239] animate-pulse" />
            <span>LIVE DROP STREAM // MOVING SILHOUETTES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            INFINITE CATALOGUE REEL
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            Auto-gliding streetwear reel • Hover any card to pause & inspect drop details.
          </p>
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 transition-colors self-start sm:self-auto font-mono"
        >
          <span>View All Drops ({products.length})</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Infinite Moving Loop Moving RIGHT */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#060608] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#060608] to-transparent z-10" />

        {/* Marquee Container moving to the RIGHT */}
        <div className="animate-marquee-right flex gap-5 px-4 cursor-pointer">
          {loopItems.map((prod, idx) => (
            <Link
              key={`${prod.id}-${idx}`}
              href={`/product/${prod.handle}`}
              className="group relative w-64 sm:w-72 shrink-0 bg-[#0b0b0f] border border-[#181822] rounded-md sm:rounded-lg overflow-hidden hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-3/4 bg-[#08080c] overflow-hidden rounded-t-md sm:rounded-t-lg">
                {/* Subtle calm star aura */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                  <div className="w-32 h-32 bg-radial-star-glow rounded-full blur-xl" />
                </div>

                <Image
                  src={prod.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000"}
                  alt={prod.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 260px, 300px"
                />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
                  {prod.tag ? (
                    <span className="bg-black/85 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/10">
                      {prod.tag}
                    </span>
                  ) : (
                    <span className="bg-[#12121a] text-zinc-300 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/10">
                      {prod.category}
                    </span>
                  )}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 z-20">
                  <span className="bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <span>Inspect Drop</span>
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>

              {/* Product Meta */}
              <div className="p-3.5 space-y-1.5 bg-[#0b0b0f] flex-1 flex flex-col justify-between border-t border-[#161620]">
                <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                    {prod.category} • {prod.gsm} GSM
                  </div>
                  <h3 className="font-bold text-xs uppercase text-[#d4d4d8] line-clamp-1 group-hover:text-white transition-colors">
                    {prod.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#181822]">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-black text-xs text-white">Rs. {prod.price}.00</span>
                    <span className="text-[10px] text-zinc-600 line-through">Rs. {prod.originalPrice}.00</span>
                  </div>

                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                    In Stock
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
