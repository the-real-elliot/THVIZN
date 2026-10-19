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
    <section className="py-14 bg-transparent border-b border-black/[0.08] overflow-hidden relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/90 border border-black/10 px-3 py-1 rounded-full text-[#090a10] text-[11px] font-black uppercase tracking-widest mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 animate-pulse" />
            <span>LIVE DROP STREAM // MOVING SILHOUETTES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#090a10]">
            INFINITE CATALOGUE REEL
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-mono">
            Auto-gliding streetwear reel • Hover any card to pause & inspect drop details.
          </p>
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-black flex items-center gap-1 transition-colors self-start sm:self-auto font-mono bg-white/80 border border-black/10 px-3.5 py-1.5 rounded-full shadow-sm"
        >
          <span>View All Drops ({products.length})</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Infinite Moving Loop Moving RIGHT */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#f5f8fc] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#f5f8fc] to-transparent z-10" />

        {/* Marquee Container moving to the RIGHT */}
        <div className="animate-marquee-right flex gap-5 px-4 cursor-pointer">
          {loopItems.map((prod, idx) => (
            <Link
              key={`${prod.id}-${idx}`}
              href={`/product/${prod.handle}`}
              className="group relative w-64 sm:w-72 shrink-0 bg-white/95 border border-black/10 rounded-md sm:rounded-lg overflow-hidden hover:border-black/30 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.10)] transition-all duration-500 ease-out flex flex-col shadow-sm"
            >
              {/* Product Image */}
              <div className="relative aspect-3/4 bg-[#f0f4f9] overflow-hidden rounded-t-md sm:rounded-t-lg">
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
                    <span className="bg-white/95 backdrop-blur-md text-[#090a10] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black/10 shadow-sm">
                      {prod.tag}
                    </span>
                  ) : (
                    <span className="bg-white/90 text-slate-700 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black/10 shadow-sm">
                      {prod.category}
                    </span>
                  )}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 z-20">
                  <span className="bg-[#090a10] hover:bg-black text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <span>Inspect Drop</span>
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>

              {/* Product Meta */}
              <div className="p-3.5 space-y-1.5 bg-white flex-1 flex flex-col justify-between border-t border-black/[0.06]">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                    {prod.category} • {prod.gsm} GSM
                  </div>
                  <h3 className="font-bold text-xs uppercase text-[#090a10] line-clamp-1 group-hover:text-black transition-colors">
                    {prod.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-black/[0.06]">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-black text-xs text-[#090a10]">Rs. {prod.price}.00</span>
                    <span className="text-[10px] text-slate-400 line-through">Rs. {prod.originalPrice}.00</span>
                  </div>

                  <span className="text-[10px] text-emerald-700 font-mono font-bold uppercase">
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
