"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/lib/products-data";
import ProductCard from "@/components/ProductCard";
import Scroll3DText from "@/components/Scroll3DText";
import { Product } from "@/lib/types";
import { SlidersHorizontal, Search, ArrowUpDown } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || "All";
  const initialQuery = searchParams.get("q") || "";

  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
        if (list.length > 0) {
          setAllProducts(list);
        }
      })
      .catch(() => {});
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [mobileGridCols, setMobileGridCols] = useState<2 | 3>(2);

  const categories = ["All", "Oversized Tees", "Hoodies", "Acid Wash", "Bottoms"];

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;
        const matchesQuery =
          !searchQuery.trim() ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh] bg-transparent text-[#f4f4f6]">
      {/* Page Header */}
      <div className="mb-8 border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Scroll3DText
            as="h1"
            variant="chrome"
            className="text-3xl sm:text-5xl md:text-6xl font-soria font-bold uppercase tracking-[0.08em] block drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            <span className="text-white">STREETWEAR</span>{" "}
            <span className="text-[#e11d48]">CATALOGUE</span>
          </Scroll3DText>
          <p className="text-xs text-zinc-300 uppercase tracking-[0.16em] mt-1.5 font-thinoo font-bold text-contrast-crisp">
            Showing {filteredProducts.length} drops // All designed in India
          </p>
        </div>

        {/* Sort & Search Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0f0f15] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-white/40 w-full sm:w-56 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#0f0f15] border border-white/10 rounded-full px-3 py-2 text-xs">
            <ArrowUpDown size={13} className="text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold uppercase text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#0f0f15] text-white">Featured Drops</option>
              <option value="price-asc" className="bg-[#0f0f15] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#0f0f15] text-white">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs sm:text-sm font-thinoo font-bold uppercase tracking-[0.14em] px-5 sm:px-7 py-3 sm:py-3.5 rounded-full border transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-white text-black border-white shadow-lg font-black scale-105"
                : "bg-[#0f0f15] text-zinc-300 border-white/15 hover:text-white hover:border-white/30 hover:bg-[#161624]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile Layout Switcher: 3 Rows Small vs 2 Col */}
      <div className="flex sm:hidden items-center justify-between mb-3 px-1 text-[11px] font-tech text-zinc-300">
        <span className="uppercase font-bold tracking-wider text-contrast-crisp">Mobile View:</span>
        <div className="flex items-center gap-1 bg-[#0c0c16]/90 border border-white/20 p-0.5 rounded-full backdrop-blur-md shadow-md">
          <button
            type="button"
            onClick={() => setMobileGridCols(3)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
              mobileGridCols === 3
                ? "bg-white text-black shadow-sm font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            3 Rows (Mini)
          </button>
          <button
            type="button"
            onClick={() => setMobileGridCols(2)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
              mobileGridCols === 2
                ? "bg-white text-black shadow-sm font-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            2 Col
          </button>
        </div>
      </div>

      {/* Products Grid with Refined Micro-Hover Animations */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#0c0c12] border border-white/10 rounded-3xl">
          <SlidersHorizontal size={32} className="mx-auto text-zinc-600 mb-3" />
          <h3 className="font-bold text-base text-zinc-200 uppercase tracking-wider mb-1">
            No Streetwear Drops Found
          </h3>
          <p className="text-xs text-zinc-500 mb-4 font-mono">
            Try resetting your search query or picking another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-xs font-bold uppercase tracking-wider bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-full transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={`grid ${
          mobileGridCols === 3 ? "grid-cols-3 gap-2 sm:gap-6" : "grid-cols-2 gap-3 sm:gap-6"
        } md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-zinc-500">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
