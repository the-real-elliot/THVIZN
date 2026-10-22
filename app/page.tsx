"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { INITIAL_PRODUCTS } from "@/lib/products-data";
import ProductCard from "@/components/ProductCard";
import HeroLandscapeFrame from "@/components/HeroLandscapeFrame";
import CatalogueLoop from "@/components/CatalogueLoop";
import Scroll3DText from "@/components/Scroll3DText";
import {
  ArrowRight,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  X
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

      {/* ================= 1. INFINITE SCROLLING CATALOGUE REEL (DIRECTLY DOWNSIDE THE PHOTO) ================= */}
      <CatalogueLoop products={products} />

      {/* ================= 2. PRODUCT CATALOGUE DIRECTLY BELOW THE VIDEO (EXPANDED STREETWEAR SHOWCASE) ================= */}
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
    </div>
  );
}
