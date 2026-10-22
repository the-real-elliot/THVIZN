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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh] bg-transparent text-[#090a10]">
      {/* Page Header */}
      <div className="mb-8 border-b border-black/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Scroll3DText
            as="h1"
            variant="chrome"
            className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight block"
          >
            <span className="text-[#090a10]">STREETWEAR</span>{" "}
            <span className="text-slate-600">CATALOGUE</span>
          </Scroll3DText>
          <p className="text-xs text-slate-600 uppercase tracking-[0.16em] mt-1.5 font-bold">
            Showing {filteredProducts.length} drops // All designed in India
          </p>
        </div>

        {/* Sort & Search Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/90 border border-black/15 rounded-full pl-9 pr-4 py-2 text-xs text-[#090a10] placeholder-slate-500 focus:outline-none focus:border-black/40 w-full sm:w-56 font-mono shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white/90 border border-black/15 rounded-full px-3 py-2 text-xs shadow-sm">
            <ArrowUpDown size={13} className="text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold uppercase text-[#090a10] focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-white text-[#090a10]">Featured Drops</option>
              <option value="price-asc" className="bg-white text-[#090a10]">Price: Low to High</option>
              <option value="price-desc" className="bg-white text-[#090a10]">Price: High to Low</option>
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
            className={`text-xs sm:text-sm font-bold uppercase tracking-[0.14em] px-5 sm:px-7 py-3 sm:py-3.5 rounded-full border transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#090a10] text-white border-black shadow-md font-black scale-105"
                : "bg-white/80 text-[#1a202c] border-black/10 hover:text-black hover:border-black/25 hover:bg-white shadow-sm"
            }`}
          >
            {cat}
          </button>

        ))}
      </div>

      {/* Mobile Layout Switcher: 3 Rows Small vs 2 Col */}
      <div className="flex sm:hidden items-center justify-between mb-3 px-1 text-[11px] font-tech text-slate-700">
        <span className="uppercase font-bold tracking-wider">Mobile View:</span>
        <div className="flex items-center gap-1 bg-white/90 border border-black/15 p-0.5 rounded-full backdrop-blur-md shadow-sm">
          <button
            type="button"
            onClick={() => setMobileGridCols(3)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
              mobileGridCols === 3
                ? "bg-[#090a10] text-white shadow-sm font-black"
                : "text-slate-500 hover:text-black"
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
                : "text-slate-500 hover:text-black"
            }`}
          >
            2 Col
          </button>
        </div>
      </div>

      {/* Products Grid with Refined Micro-Hover Animations */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white/80 border border-black/10 rounded-3xl shadow-sm">
          <SlidersHorizontal size={32} className="mx-auto text-slate-500 mb-3" />
          <h3 className="font-bold text-base text-[#090a10] uppercase tracking-wider mb-1">
            No Streetwear Drops Found
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-mono">
            Try resetting your search query or picking another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-xs font-bold uppercase tracking-wider bg-[#090a10] hover:bg-[#202432] text-white px-6 py-2.5 rounded-full transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={`grid ${
          mobileGridCols === 3 ? "grid-cols-3 gap-2 sm:gap-6" : "grid-cols-2 gap-3 sm:gap-6"
        } md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 md:gap-5 lg:gap-6`}>
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
