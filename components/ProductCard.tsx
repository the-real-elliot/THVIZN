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
      className="group relative flex flex-col glass-panel glass-panel-hover rounded-md sm:rounded-lg overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.7)] border border-white/10 hover:border-white/25 transition-all duration-500 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame with Dual-Image Morphing Transition (Sagacity Reference) */}
      <Link
        href={`/product/${product.handle}`}
        className="relative aspect-3/4 w-full bg-[#08080c]/80 overflow-hidden block rounded-t-md sm:rounded-t-lg"
      >
        {/* Subtle, calm atmospheric star backlight */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-24 sm:w-36 h-24 sm:h-36 bg-radial-star-glow rounded-full blur-2xl opacity-20 group-hover:opacity-45 transition-opacity duration-700" />
          
          <div className="absolute w-20 sm:w-28 h-10 sm:h-14 opacity-15 group-hover:opacity-35 transition-opacity duration-700">
            <Image
              src="/images/star-logo.png"
              alt="Brand Halo"
              fill
              sizes="(max-width: 640px) 80px, 112px"
              className="object-contain filter drop-shadow-[0_0_12px_rgba(255,26,42,0.35)]"
            />
          </div>
        </div>

        {/* PRIMARY IMAGE (Base layer) */}
        <div
          className={`absolute inset-0 z-10 transition-all duration-700 ease-out ${
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

        {/* Subtle dark vignette at bottom for text contrast */}
        <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-[#07070a] via-transparent to-transparent z-15 pointer-events-none" />

        {/* Top Tag Badge */}
        {product.tag && (
          <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 z-20 bg-black/75 backdrop-blur-xl text-[#f4f4f6] text-[8px] sm:text-[10px] font-thinoo font-bold uppercase tracking-[0.16em] px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-lg">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#9f1239] animate-pulse" />
            <span>{product.tag}</span>
          </div>
        )}

        {/* Quick Add Pill (Compact on mobile 3-row, full on desktop) */}
        <div className="absolute inset-x-0 bottom-2 sm:bottom-4 z-25 flex items-center justify-center px-1.5 sm:px-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full max-w-[110px] sm:max-w-[220px] py-1 sm:py-2.5 px-2 sm:px-4 rounded-full text-[9px] sm:text-xs font-thinoo font-bold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 shadow-2xl backdrop-blur-xl border transition-all active:scale-95 cursor-pointer ${
              added
                ? "bg-emerald-600 text-white border-emerald-400"
                : "bg-white hover:bg-zinc-200 text-black border-white/40 hover:border-white sm:hover:scale-105"
            }`}
          >
            {added ? (
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
      <div className="p-2 sm:p-5 flex flex-col justify-between gap-1.5 sm:gap-3 bg-black/50 backdrop-blur-md border-t border-white/[0.06] rounded-b-md sm:rounded-b-lg">
        <div>
          <Link
            href={`/product/${product.handle}`}
            className="text-[10px] sm:text-sm font-fashion font-bold uppercase tracking-tight text-[#f4f4f6] group-hover:text-white transition-colors duration-200 line-clamp-1 block text-contrast-crisp"
          >
            {product.name}
          </Link>

          {/* Clean Price Format */}
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2">
            <span className="text-[11px] sm:text-lg font-extrabold text-white font-tech text-contrast-crisp">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="hidden min-[360px]:inline text-[9px] sm:text-xs text-zinc-400 line-through font-tech">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
            <span className="hidden min-[480px]:inline ml-auto text-[8px] sm:text-[10px] font-tech font-bold text-zinc-300 bg-white/[0.08] border border-white/15 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 rounded-full">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </div>
        </div>

        {/* Minimalist Size Selector Pills (Desktop Only to keep Mobile 3-Row Clean) */}
        <div className="hidden sm:flex items-center gap-1.5 pt-1.5 border-t border-white/[0.04]">
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
                  ? "bg-white text-black border-white shadow-md scale-105"
                  : "bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white hover:border-white/20"
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
