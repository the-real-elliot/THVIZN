"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Check, Plus } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<Product["sizes"][0]>(product.sizes[0] || "M");
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const hasAlternateImage = Boolean(product.images && product.images[1] && product.images[1] !== product.images[0]);

  return (
    <div
      className="group relative flex flex-col bg-white sm:bg-white/90 sm:backdrop-blur-xl rounded-md sm:rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_45px_rgba(0,0,0,0.12)] border border-black/[0.08] hover:border-black/20 transition-all duration-300 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame with Dual-Image Morphing Transition (Sagacity Reference) */}
      <Link
        href={`/product/${product.handle}`}
        className="relative aspect-3/4 w-full bg-[#f0f4f9] overflow-hidden block rounded-t-md sm:rounded-t-lg"
      >
        {/* PRIMARY IMAGE (Base layer) */}
        <div
          className={`absolute inset-0 z-10 transition-all duration-500 ease-out ${
            hasAlternateImage
              ? "opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105"
              : "opacity-100 scale-100 group-hover:scale-105"
          }`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* SECONDARY ALTERNATE IMAGE */}
        {hasAlternateImage && (
          <div className="absolute inset-0 z-12 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out pointer-events-none">
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Top Tag Badge */}
        {product.tag && (
          <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 z-20 bg-white/90 backdrop-blur-xl text-[#090a10] text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.16em] px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-black/10 flex items-center gap-1 shadow-sm">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-700 animate-pulse" />
            <span>{product.tag}</span>
          </div>
        )}

        {/* Out of Stock Top Right Pill */}
        {!product.inStock && (
          <div className="absolute top-2 sm:top-3.5 right-2 sm:right-3.5 z-20 bg-red-600/95 backdrop-blur-md text-white text-[8px] sm:text-[9.5px] font-bold uppercase tracking-[0.16em] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/20 shadow-md">
            OUT OF STOCK
          </div>
        )}

        {/* Quick Add Pill (Compact on mobile 3-row, full on desktop) */}
        <div className="absolute inset-x-0 bottom-2 sm:bottom-4 z-25 flex items-center justify-center px-1.5 sm:px-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={product.inStock ? handleQuickAdd : (e) => { e.preventDefault(); e.stopPropagation(); }}
            className={`w-full max-w-[110px] sm:max-w-[220px] py-1 sm:py-2.5 px-2 sm:px-4 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg backdrop-blur-xl border transition-all ${
              !product.inStock
                ? "bg-zinc-800/85 text-zinc-300 border-zinc-700 cursor-not-allowed opacity-90"
                : added
                ? "bg-emerald-600 text-white border-emerald-500 active:scale-95 cursor-pointer"
                : "bg-[#090a10] hover:bg-[#222634] text-white border-black sm:hover:scale-105 active:scale-95 cursor-pointer"
            }`}
          >
            {!product.inStock ? (
              <span className="truncate">SOLD OUT</span>
            ) : added ? (
              <>
                <Check size={11} className="text-white sm:w-3.5 sm:h-3.5" />
                <span className="truncate">Added</span>
              </>
            ) : (
              <>
                <Plus size={11} className="sm:w-3.5 sm:h-3.5" />
                <span className="truncate">Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Clean Meta: Scaled Up for Bigger 3-per-row Layout on PC, Compact on Mobile */}
      <div className="p-2 sm:p-5 flex flex-col justify-between gap-1.5 sm:gap-3 bg-white/95 backdrop-blur-md border-t border-black/[0.06] rounded-b-md sm:rounded-b-lg">
        <div>
          <Link
            href={`/product/${product.handle}`}
            className="text-[10px] sm:text-sm font-fashion font-bold uppercase tracking-tight text-[#090a10] hover:text-slate-600 transition-colors duration-200 line-clamp-1 block"
          >
            {product.name}
          </Link>

          {/* Clean Price Format */}
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2">
            <span className="text-[11px] sm:text-lg font-extrabold text-[#090a10] font-tech">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="hidden min-[360px]:inline text-[9px] sm:text-xs text-slate-400 line-through font-tech">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
            <span className="hidden min-[480px]:inline ml-auto text-[8px] sm:text-[10px] font-tech font-bold text-[#090a10] bg-black/[0.05] border border-black/10 px-1.5 sm:px-2.5 py-0.5 rounded-full">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </div>
        </div>

        {/* Minimalist Size Selector Pills (Desktop Only to keep Mobile 3-Row Clean) */}
        <div className="hidden sm:flex items-center gap-1.5 pt-1.5 border-t border-black/[0.05]">
          {product.sizes.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedSize(sz);
              }}
              className={`text-[10px] font-tech font-bold px-3 py-1 rounded-md transition-all border ${
                selectedSize === sz
                  ? "bg-[#090a10] text-white border-[#090a10] shadow-sm scale-105"
                  : "bg-black/[0.04] text-slate-700 border-black/10 hover:text-black hover:border-black/25"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
