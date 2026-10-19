"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { INITIAL_PRODUCTS } from "@/lib/products-data";
import ProductCard from "@/components/ProductCard";
import Leaderboard from "@/components/Leaderboard";
import LiquidWaveText from "@/components/LiquidWaveText";
import HeroLandscapeFrame from "@/components/HeroLandscapeFrame";
import ScrollReveal from "@/components/ScrollReveal";
import Scroll3DText from "@/components/Scroll3DText";
import CatalogueLoop from "@/components/CatalogueLoop";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Truck,
  RefreshCw,
  ShieldCheck,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Trophy
} from "lucide-react";
import { Product } from "@/lib/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [mobileGridCols, setMobileGridCols] = useState<2 | 3>(2);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
        if (list.length > 0) {
          setProducts(list);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ["All", "Oversized Tees", "Hoodies", "Acid Wash", "Bottoms"];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;
        const q = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !q ||
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          (product.tag && product.tag.toLowerCase().includes(q));
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const displayProducts = useMemo(() => {
    // Show 9 items on homepage: exactly 3 rows of 3 on phone and desktop!
    return filteredProducts.slice(0, selectedCategory === "All" && !searchQuery ? 9 : 15);
  }, [filteredProducts, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-[#090a10] overflow-hidden selection:bg-[#090a10] selection:text-white relative">
      {/* ================= 0. FIRST SCREEN: Y2K MODELS STREETWEAR VIDEO (LEFT) + LEADERBOARD (TOP RIGHT) ================= */}
      <section className="relative w-full bg-transparent overflow-hidden">
        {/* Lighter Aesthetic Monochrome Ambient Spotlight behind Hero Video & Leaderboard */}
        <div
          className="absolute -top-16 inset-x-0 h-[105vh] pointer-events-none z-0 will-change-transform"
          style={{
            background: `
              radial-gradient(ellipse 115% 80% at 50% 25%, 
                rgba(255, 255, 255, 0.70) 0%, 
                rgba(235, 242, 252, 0.45) 30%, 
                rgba(210, 222, 238, 0.20) 60%, 
                transparent 100%
              )
            `,
          }}
        />

        <div className="w-full pl-0 pr-0 pt-2 sm:pt-2.5 pb-2 relative z-10">
          <HeroLandscapeFrame />
        </div>
      </section>

      {/* ================= 1. PRODUCT CATALOGUE DIRECTLY BELOW THE VIDEO (EXPANDED STREETWEAR SHOWCASE) ================= */}
      <section id="catalogue" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-b border-black/[0.08] scroll-mt-20">
        {/* Lighter Ambient Monochrome Sheen with High Contrast */}
        <div
          className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[98vw] h-[600px] blur-3xl opacity-40 z-0"
          style={{
            background: `radial-gradient(ellipse 95% 70% at 50% 50%, rgba(255, 255, 255, 0.75) 0%, rgba(215, 225, 240, 0.35) 45%, transparent 75%)`,
          }}
        />
        {/* Catalogue Section Header */}
        <div className="mb-8 border-b border-black/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/90 border border-black/10 px-3.5 py-1 rounded-full text-[#090a10] text-[11px] font-bold uppercase tracking-[0.2em] mb-2.5 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
              <span>DROP 01 // 2026 ARCHIVE</span>
            </div>
            <div>
              <Scroll3DText
                as="h2"
                variant="chrome"
                className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight block"
              >
                <span className="text-[#090a10]">STREETWEAR</span>{" "}
                <span className="text-slate-600">CATALOGUE</span>
              </Scroll3DText>
            </div>
            <p className="text-xs text-slate-600 uppercase tracking-[0.16em] mt-2 font-bold">
              Showing {displayProducts.length} curated drops // {products.length}+ specimens in archive
            </p>
          </div>

          {/* Sort & In-Page Search Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filter current drops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/90 backdrop-blur-xl border border-black/15 focus:border-black/50 focus:ring-1 focus:ring-black/20 rounded-full pl-9 pr-7 py-2.5 text-xs text-[#090a10] placeholder-slate-500 focus:outline-none w-full sm:w-60 font-tech transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black text-xs"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xl border border-black/15 rounded-full px-4 py-2 text-xs shadow-sm">
              <ArrowUpDown size={13} className="text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-tech font-bold uppercase text-[#090a10] focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-white text-[#090a10]">Featured Drops</option>
                <option value="price-asc" className="bg-white text-[#090a10]">Price: Low to High</option>
                <option value="price-desc" className="bg-white text-[#090a10]">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Softened Landscape Curves) */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-10 relative z-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs sm:text-sm font-bold uppercase tracking-[0.14em] px-5 sm:px-7 py-3 sm:py-3.5 rounded-full border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#090a10] text-white border-black shadow-md scale-105 font-black"
                  : "bg-white/80 backdrop-blur-md text-[#1a202c] border-black/10 hover:text-black hover:border-black/25 hover:bg-white shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid: 3 per row on Desktop, Bigger & Majestic Impact */}
        {displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/80 border border-black/10 rounded-2xl shadow-sm">
            <SlidersHorizontal size={32} className="mx-auto text-slate-500 mb-3" />
            <h3 className="font-bold text-base text-[#090a10] uppercase tracking-wider mb-1">
              No Streetwear Drops Match Your Filter
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              Try resetting your search query or picking another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="bg-[#090a10] hover:bg-[#222533] text-white text-xs font-bold uppercase px-6 py-2.5 rounded-full transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Layout Switcher: 3 Rows Small vs 2 Col */}
            <div className="flex sm:hidden items-center justify-between mb-3 px-1 text-[11px] font-tech text-slate-700">
              <span className="uppercase font-bold tracking-wider text-[#090a10]">Mobile View:</span>
              <div className="flex items-center gap-1 bg-white/90 border border-black/10 p-0.5 rounded-full backdrop-blur-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setMobileGridCols(3)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    mobileGridCols === 3
                      ? "bg-[#090a10] text-white shadow-sm font-black"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  3 Rows (Mini)
                </button>
                <button
                  type="button"
                  onClick={() => setMobileGridCols(2)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    mobileGridCols === 2
                      ? "bg-[#090a10] text-white shadow-sm font-black"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  2 Col
                </button>
              </div>
            </div>

            <div className={`grid ${
              mobileGridCols === 3 ? "grid-cols-3 gap-2 sm:gap-6" : "grid-cols-2 gap-3 sm:gap-6"
            } md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10`}>
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* View Full Streetwear Archive Button */}
            <div className="mt-14 text-center border-t border-white/[0.06] pt-10">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-[#090a10] hover:bg-[#202432] text-white px-9 py-4 rounded-full text-xs font-tech font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group cursor-pointer"
              >
                <span>VIEW ALL {products.length}+ DROPS IN ARCHIVE</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-[11px] font-tech text-slate-600 uppercase tracking-widest mt-3">
                All 280–420 GSM pure combed cotton drops available in store
              </p>
            </div>
          </>
        )}
      </section>

      {/* ================= 2. BRAND MANIFESTO TEXT & LIVE LEADERBOARD (DOWN BELOW CATALOGUE) ================= */}
      <section id="manifesto-section" className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center border-b border-black/[0.08] overflow-hidden bg-transparent">
        {/* Lighter Ambient Monochrome Spotlight behind WEAR DIFFERENT */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] blur-3xl opacity-35 z-0"
          style={{
            background: `radial-gradient(ellipse 85% 65% at 50% 50%, rgba(255, 255, 255, 0.70) 0%, rgba(210, 222, 238, 0.25) 45%, transparent 75%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Clean Luxury Headline with Internal Surfing Sea Waves */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Micro Subtitle */}
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xl border border-black/10 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] text-[#090a10] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
                <span>TRUE STYLE NEVER DIES</span>
              </div>

              {/* SURFING STONE SILVER & PLATINUM CHROME SEA WAVES TEXT */}
              <div className="space-y-1.5 sm:space-y-3">
                <div>
                  <LiquidWaveText
                    text="WEAR DIFFERENT."
                    className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-[#090a10] block"
                  />
                </div>
                <div>
                  <LiquidWaveText
                    text="STAND APART."
                    className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-[#334155] block"
                  />
                </div>
                <div>
                  <LiquidWaveText
                    text="BECOME THE STATEMENT."
                    className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-[#090a10] block"
                  />
                </div>
              </div>

              {/* Streetwear Statement */}
              <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed mx-auto lg:mx-0 font-body font-medium">
                Where shadows become identity. Where every drop tells a story. 280–420 GSM pure combed cotton, raw streetwear silhouettes engineered for the unforgotten.
              </p>

              {/* Quick Specs Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                {["280-420 GSM", "100% COMBED COTTON", "PRE-SHRUNK", "DROP SHOULDER"].map((spec, i) => (
                  <span
                    key={i}
                    className="bg-white/80 backdrop-blur-md border border-black/10 text-[#090a10] text-[10px] font-bold uppercase tracking-[0.14em] px-3.5 py-1 rounded-full shadow-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>


              {/* High-Contrast Luxury CTAs (Smooth Landscape Curves) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#catalogue"
                  className="w-full sm:w-auto bg-[#090a10] hover:bg-[#202432] text-white text-xs font-display font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:scale-105 cursor-pointer"
                >
                  <span>SHOP COLLECTION</span>
                  <ArrowRight size={15} />
                </a>
                <Link
                  href="/shop?cat=Hoodies"
                  className="w-full sm:w-auto bg-white/90 hover:bg-white backdrop-blur-xl border border-black/15 text-[#090a10] text-xs font-display font-bold uppercase tracking-wider px-7 py-3.5 rounded-full transition-all flex items-center justify-center hover:scale-105 shadow-sm"
                >
                  EXPLORE 420 GSM
                </Link>
              </div>
            </div>

            {/* Right Column: ARCHIVAL SPECIMEN CARD / VIP ACCESS */}
            <div className="lg:col-span-5 w-full">
              <div className="relative bg-white/90 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden curved-landscape-card text-[#090a10]">
                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-[0.18em]">
                      ARCHIVAL SPECIMEN 01
                    </span>
                    <span className="text-[10px] font-bold text-[#090a10] uppercase tracking-[0.16em]">
                      ● MUMBAI / TOKYO
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-2xl uppercase text-[#090a10] tracking-tight">
                      HEAVYWEIGHT DROP 01
                    </h3>
                    <p className="text-xs text-slate-600 font-body leading-relaxed">
                      All specimens engineered from ultra-dense 420 GSM combed loop terry with shape-retaining micro-ribbed collars and dropped shoulders.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-black/[0.03] border border-black/10 rounded-xl p-3 text-center">
                      <div className="text-lg font-display font-black text-[#090a10]">420 GSM</div>
                      <div className="text-[10px] font-tech text-slate-600 uppercase mt-0.5">Heavyweight Drape</div>
                    </div>
                    <div className="bg-black/[0.03] border border-black/10 rounded-xl p-3 text-center">
                      <div className="text-lg font-display font-black text-[#090a10]">100%</div>
                      <div className="text-[10px] font-tech text-slate-600 uppercase mt-0.5">Combed Cotton</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/leaderboard"
                      className="w-full flex items-center justify-between bg-black/[0.04] hover:bg-black/[0.08] border border-black/10 text-[#090a10] p-3.5 rounded-xl transition-all group text-xs font-tech font-bold uppercase tracking-wider shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-amber-500" />
                        <span>VIP Drop Collectors Club</span>
                      </div>
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. MOVING TICKER RIBBON ================= */}
      <div className="bg-white/80 backdrop-blur-xl text-slate-700 py-3.5 overflow-hidden border-y border-black/[0.08]">
        <div className="animate-marquee flex gap-8 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.25em]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="text-[#090a10] font-bold">DISCOVER THE LATEST COLLECTION</span>
              <span className="text-slate-400">●</span>
              <span className="text-[#090a10] font-black tracking-[0.15em] text-xs uppercase">Thvizn Atelier</span>
              <span className="text-slate-400">●</span>
              <span className="text-[#090a10] font-bold">TRUE STYLE NEVER DIES</span>
              <span className="text-slate-400">●</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 4. INFINITE MOVING CATALOGUE REEL ================= */}
      <CatalogueLoop products={products} />

      {/* ================= 5. NEW SEASON, NEW PERSPECTIVE CATEGORY CHAPTERS ================= */}
      <ScrollReveal>
        <section className="relative py-20 bg-transparent border-y border-black/[0.08] overflow-hidden">
          {/* Subtle Curved Ambient Glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-radial-star-glow blur-3xl opacity-20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[#090a10]">
                <span className="text-[#090a10]">NEW SEASON,</span>{" "}
                <span className="text-slate-600">NEW PERSPECTIVE</span>
              </h2>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">
                Four chapters of heavy engineering
              </p>
            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  chapter: "CHAPTER 01",
                  title: "STREETWEAR TEES",
                  spec: "280 GSM Heavy Combed Cotton",
                  cat: "Oversized Tees",
                  image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                },
                {
                  chapter: "CHAPTER 02",
                  title: "CROPPED WAFFLE",
                  spec: "320 GSM Knit Thermal",
                  cat: "Acid Wash",
                  image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80"
                },
                {
                  chapter: "CHAPTER 03",
                  title: "ETHEREAL BOTTOMS",
                  spec: "Tactical Cotton Twill",
                  cat: "Bottoms",
                  image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"
                },
                {
                  chapter: "CHAPTER 04",
                  title: "SILENT MOTION",
                  spec: "420 GSM Brushed Fleece",
                  cat: "Hoodies",
                  image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
                }
              ].map((ch, idx) => (
                <Link
                  key={idx}
                  href={`/shop?cat=${encodeURIComponent(ch.cat)}`}
                  className="group relative aspect-4/5 rounded-md sm:rounded-lg overflow-hidden border border-black/10 hover:border-black/25 hover:-translate-y-1 hover:shadow-lg bg-white/80 p-4 flex flex-col justify-between transition-all duration-500 ease-out"
                >
                  {/* Subtle glowing star in background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <div className="w-32 h-32 bg-radial-star-glow rounded-full blur-xl" />
                  </div>

                  <Image
                    src={ch.image}
                    alt={ch.title}
                    fill
                    className="object-cover relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 z-15" />

                  <div className="relative z-20 flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black text-white tracking-widest bg-black/80 px-2.5 py-0.5 rounded-full border border-white/10">
                      {ch.chapter}
                    </span>
                  </div>

                  <div className="relative z-20 space-y-1">
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white group-hover:text-slate-200 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-[10px] text-slate-300 font-mono">{ch.spec}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================= 6. EDITORIAL STORY BANNER ================= */}
      <ScrollReveal>
        <section className="relative py-20 sm:py-28 border-b border-black/[0.08] bg-transparent overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Model & Script Branding */}
              <div className="lg:col-span-6 relative aspect-16/10 rounded-sm overflow-hidden border border-black/15 shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&auto=format&fit=crop&q=80"
                  alt="Beyond Fashion Model"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />

                <div className="absolute bottom-5 left-5 z-20">
                  <span className="font-display font-black text-3xl sm:text-4xl tracking-[0.12em] uppercase text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                    THVIZN ATELIER
                  </span>
                  <div className="font-bold text-[9px] sm:text-[10px] tracking-[0.22em] text-slate-300 uppercase mt-1">
                    HAUTE STREETWEAR ARCHIVE // FW26
                  </div>
                </div>
              </div>

              {/* Right Headline & Statement */}
              <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-600 font-bold">
                  BEYOND FASHION // THIS IS IDENTITY
                </div>

                <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[#090a10] leading-tight">
                  BUILT FOR THE BOLD.
                </h2>

                <p className="font-body italic text-base sm:text-lg text-slate-700 tracking-wide leading-relaxed max-w-lg mx-auto lg:mx-0">
                  &ldquo;Where raw subculture meets architectural tailoring. Engineered for those who refuse to blend in.&rdquo;
                </p>


                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-body">
                  Rewrite the rules with THVIZN. Heavyweight fabrics engineered to drape right and last years. No compromises on stitch density, fabric weight, or hardware.
                </p>

                <div className="pt-2">
                  <a
                    href="#catalogue"
                    className="inline-flex items-center gap-2 bg-[#090a10] hover:bg-[#202432] text-white text-xs font-tech font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>EXPLORE DROP 01</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================= 7. MACRO FABRIC SHOWCASE ================= */}
      <ScrollReveal>
        <section className="bg-transparent border-y border-black/[0.08] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Macro Weave Texture */}
              <div className="lg:col-span-6 relative aspect-16/10 rounded-md sm:rounded-lg overflow-hidden border border-black/15 group shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=80"
                  alt="Heavyweight Cotton Texture Close Up"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 z-10 text-[10px] font-tech text-slate-300 font-bold uppercase tracking-widest">
                  MACRO WEAVE // 420 GSM FRENCH TERRY
                </div>
              </div>

              {/* Right: Exact Brand Text Box */}
              <div className="lg:col-span-6 bg-white/90 border border-black/10 p-8 sm:p-10 rounded-md sm:rounded-lg space-y-4 shadow-md text-[#090a10]">
                <span className="text-[11px] font-tech text-slate-500 uppercase tracking-widest font-bold">
                  was created for those who see fashion as more than something to wear.
                </span>

                <h2 className="text-2xl sm:text-4xl font-aesthetic-wide font-black uppercase tracking-[0.2em] text-[#090a10] border-b border-black/[0.08] pb-3">
                  THVIZN
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                  We blend bold graphics, experimental silhouettes and raw street subculture into pieces that feel unapologetically individual. Every design is built with intention — from the heavyweight yarns and textured minerals to the smallest details.
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs font-tech font-bold text-slate-700">
                  <span>280–420 GSM</span>
                  <span>•</span>
                  <span>100% COTTON</span>
                  <span>•</span>
                  <span>MADE IN INDIA</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================= 8. VALUE BADGES ================= */}
      <ScrollReveal>
        <section className="bg-transparent py-16 border-t border-black/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center text-xs">
              <div className="p-5 bg-white/80 border border-black/10 rounded-md sm:rounded-lg space-y-2 backdrop-blur-md shadow-sm">
                <Truck size={22} className="text-slate-700 mx-auto" />
                <div className="font-display font-black uppercase tracking-wider text-[#090a10] text-xs">FAST DELIVERY</div>
                <div className="text-[10px] text-slate-600 font-tech">Pan-India Express Shipping</div>
              </div>

              <div className="p-5 bg-white/80 border border-black/10 rounded-md sm:rounded-lg space-y-2 backdrop-blur-md shadow-sm">
                <RefreshCw size={22} className="text-slate-700 mx-auto" />
                <div className="font-display font-black uppercase tracking-wider text-[#090a10] text-xs">7 DAYS EXCHANGE</div>
                <div className="text-[10px] text-slate-600 font-tech">Hassle-free size replacement</div>
              </div>

              <div className="p-5 bg-white/80 border border-black/10 rounded-md sm:rounded-lg space-y-2 backdrop-blur-md shadow-sm">
                <ShieldCheck size={22} className="text-slate-700 mx-auto" />
                <div className="font-display font-black uppercase tracking-wider text-[#090a10] text-xs">SECURE PAYMENT</div>
                <div className="text-[10px] text-slate-600 font-tech">UPI, Cards, Netbanking</div>
              </div>

              <div className="p-5 bg-white/80 border border-black/10 rounded-md sm:rounded-lg space-y-2 backdrop-blur-md shadow-sm">
                <span className="inline-block text-[#090a10] font-tech font-bold text-lg">★</span>
                <div className="font-display font-black uppercase tracking-wider text-[#090a10] text-xs">AUTHENTIC QUALITY</div>
                <div className="text-[10px] text-slate-600 font-tech">100% Combed Heavyweight Cotton</div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
