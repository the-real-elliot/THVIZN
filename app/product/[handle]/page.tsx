"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { INITIAL_PRODUCTS, getProductByHandleOrId, getProductDetailShots } from "@/lib/products-data";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Scroll3DText from "@/components/Scroll3DText";
import ProductZoomGallery from "@/components/ProductZoomGallery";
import {
  Check,
  ShoppingBag,
  Zap,
  Truck,
  RefreshCw,
  ShieldCheck,
  Ruler,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Sparkles,
  Layers,
  Flame
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const router = useRouter();
  const { handle } = use(params);
  const product = getProductByHandleOrId(handle);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<Product["sizes"][0]>(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Indian Pincode check simulator
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryStatus(`Express delivery via Delhivery / Shiprocket: Estimated 3-4 days to Pincode ${pincode}`);
    } else {
      setDeliveryStatus("Please enter a valid 6-digit Indian postal pincode");
    }
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const detailShots = getProductDetailShots(product);

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: detailShots[0]?.url || product.images[0] || "/images/star-logo.png",
        size: selectedSize,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: detailShots[0]?.url || product.images[0] || "/images/star-logo.png",
        size: selectedSize,
      },
      quantity
    );
    router.push("/checkout");
  };

  const allProducts = INITIAL_PRODUCTS;
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-16 bg-transparent text-[#090a10]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[11px] text-slate-500 mb-6 uppercase tracking-wider font-tech font-bold">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight size={12} className="text-slate-400" />
        <Link href="/shop" className="hover:text-black transition-colors">
          Catalogue
        </Link>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="text-[#090a10] font-black line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Grid: 2-Column Photo Gallery on Left + Sticky Purchase Box on Right (TheSagacity reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start relative">
        {/* ================= LEFT SIDE: 2-COLUMN PHOTO GALLERY (COLLAR, QUALITY, ARMS, SHOULDERS, ETC.) ================= */}
        <div className="lg:col-span-7 w-full">
          <ProductZoomGallery
            shots={detailShots}
            productName={product.name}
            tag={product.tag}
            gsm={product.gsm}
          />
        </div>

        {/* ================= RIGHT SIDE: STICKY PRODUCT PURCHASE & SPECIFICATIONS FORM ================= */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:self-start bg-white/95 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-black/10 shadow-[0_10px_35px_rgba(0,0,0,0.05)]">
          {/* Header & Category Badge */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-black tracking-widest uppercase bg-black/5 text-[#090a10] px-2.5 py-1 rounded-full border border-black/10">
                {product.category} // {product.gsm} GSM HEAVYWEIGHT
              </span>
              {product.inStock ? (
                <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  IN STOCK ({product.stockCount} AVAILABLE)
                </span>
              ) : (
                <span className="text-[10px] font-mono text-red-600 font-bold flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  OUT OF STOCK // SOLD OUT
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight block leading-tight text-[#090a10]">
              {product.name}
            </h1>

            {/* Reviews Rating Stars */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">
                4.9 // 28 Verified Streetwear Reviews
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-3.5 pt-3 border-t border-black/[0.08]">
              <span className="text-2xl sm:text-3xl font-black text-[#090a10] font-mono tracking-tight">
                Rs. {product.price.toLocaleString("en-IN")}.00
              </span>
              <span className="text-base text-slate-400 line-through font-mono">
                Rs. {product.originalPrice.toLocaleString("en-IN")}.00
              </span>
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider font-mono">
                SAVE {discountPercent}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Inclusive of all taxes • Free express shipping over ₹999.
            </p>
          </div>

          {/* Sizing Section */}
          <div className="pt-3 border-t border-black/[0.08]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                SELECT SIZE: <span className="text-[#090a10] font-mono font-extrabold">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="text-xs font-bold text-slate-600 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Ruler size={13} />
                <span className="underline underline-offset-4">Size Guide</span>
              </button>
            </div>

            {/* Size Pills */}
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-12 h-11 px-3.5 rounded-lg font-tech font-bold text-xs uppercase transition-all duration-200 border cursor-pointer ${
                    selectedSize === size
                      ? "bg-[#090a10] text-white border-black ring-2 ring-black/15 shadow-sm scale-102 font-black"
                      : "bg-white hover:bg-slate-100 text-slate-800 border-black/15 hover:border-black/35 shadow-2xs"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Size Chart Modal */}
            {showSizeChart && (
              <div className="mt-3 p-4 bg-slate-50 border border-black/10 rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#090a10] uppercase tracking-wider font-mono text-[10px]">
                    GARMENT DIMENSIONS (INCHES)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(false)}
                    className="text-slate-400 hover:text-black text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center border-t border-black/[0.08] pt-2 font-mono text-slate-700">
                  <span className="font-bold text-left text-slate-500">Size</span>
                  <span className="font-bold text-slate-500">Chest</span>
                  <span className="font-bold text-slate-500">Length</span>
                  <span className="font-bold text-slate-500">Shoulder</span>
                  <span className="text-left font-bold">S</span><span>42&quot;</span><span>28&quot;</span><span>21&quot;</span>
                  <span className="text-left font-bold">M</span><span>44&quot;</span><span>29&quot;</span><span>22&quot;</span>
                  <span className="text-left font-bold">L</span><span>46&quot;</span><span>30&quot;</span><span>23&quot;</span>
                  <span className="text-left font-bold">XL</span><span>48&quot;</span><span>31&quot;</span><span>24&quot;</span>
                </div>
                <p className="text-[10px] text-slate-500 italic pt-1 font-mono">
                  *True oversized drop-shoulder fit. Choose normal size for signature boxy streetwear silhouette.
                </p>
              </div>
            )}
          </div>

          {/* Quantity Stepper & ADD TO BAG (Matching thesagacity reference) */}
          <div className="space-y-3 pt-2 border-t border-black/[0.08]">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper: [- 1 +] */}
              <div className="flex items-center bg-white border border-black/15 rounded-full p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-[#090a10]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* ADD TO BAG Button */}
              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  !product.inStock
                    ? "bg-zinc-200 text-zinc-400 border border-zinc-300 cursor-not-allowed"
                    : added
                    ? "bg-emerald-600 text-white cursor-pointer"
                    : "bg-white hover:bg-slate-50 text-[#090a10] border border-black/20 shadow-xs hover:border-black/40 cursor-pointer"
                }`}
              >
                {!product.inStock ? (
                  <span>OUT OF STOCK</span>
                ) : added ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>
            </div>

            {/* Full-width BUY IT NOW CTA */}
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleBuyNow}
              className={`w-full py-4 px-6 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all ${
                !product.inStock
                  ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                  : "bg-[#090a10] hover:bg-black text-white hover:scale-[1.01] active:scale-95 cursor-pointer"
              }`}
            >
              {!product.inStock ? (
                <span>ITEM SOLD OUT</span>
              ) : (
                <>
                  <Zap size={16} />
                  <span>BUY IT NOW</span>
                </>
              )}
            </button>
          </div>

          {/* Product Meta: SKU & Categories */}
          <div className="pt-2 text-[10px] font-mono text-slate-500 space-y-1">
            <div>
              SKU: <strong className="text-slate-800">TVZ-{product.id.toUpperCase()}-FW26</strong>
            </div>
            <div>
              CATEGORIES: <strong className="text-slate-800">All, {product.category}, Streetwear Drop 01</strong>
            </div>
          </div>

          {/* Indian Pincode Delivery Estimator */}
          <div className="p-4 bg-slate-50 border border-black/10 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Truck size={14} className="text-slate-700" />
              <span>CHECK DELIVERY ESTIMATE</span>
            </div>
            <form onSubmit={checkPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode (e.g. 560001)"
                className="flex-1 bg-white border border-black/15 rounded-lg px-3 py-2 text-xs font-mono text-[#090a10] placeholder-slate-400 focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="bg-[#090a10] hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                CHECK
              </button>
            </form>
            {deliveryStatus && (
              <p className="text-[11px] font-mono font-bold text-emerald-700 mt-1">
                {deliveryStatus}
              </p>
            )}
          </div>

          {/* Detailed Garment Specifications Accordion/Table */}
          <div className="pt-3 border-t border-black/[0.08] space-y-2.5">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#090a10] font-mono">
              GARMENT SPECIFICATIONS
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-slate-500 font-mono">Fabric Composition:</span>
                <span className="font-bold text-[#090a10]">{product.fabric}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-slate-500 font-mono">Fit Silhouette:</span>
                <span className="font-bold text-[#090a10]">{product.fit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-slate-500 font-mono">Fabric Weight:</span>
                <span className="font-bold text-[#090a10]">{product.gsm} GSM Heavyweight</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-slate-500 font-mono">Wash Care:</span>
                <span className="font-bold text-[#090a10]">Cold Machine Wash / Inside Out</span>
              </div>
            </div>
          </div>

          {/* Streetwear Assurances */}
          <div className="pt-3 border-t border-black/[0.08] grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-slate-800" />
              <span>Free Express Shipping &gt; ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-slate-800" />
              <span>7 Days Size Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-slate-800" />
              <span>Razorpay Verified UPI</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-slate-800" />
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-black/[0.08]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#090a10]">
              COMPLETE YOUR STREETWEAR SET
            </h2>
            <Link
              href="/shop"
              className="text-xs font-bold font-mono tracking-wider text-slate-600 hover:text-black uppercase flex items-center gap-1"
            >
              <span>View All Archive</span>
              <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick Buy Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-black/10 p-3 flex items-center justify-between gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.08)]">
        <div className="min-w-0">
          <div className="text-xs font-mono font-black text-[#090a10] truncate">
            Rs. {product.price.toLocaleString("en-IN")}.00
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Size: <span className="text-[#090a10] font-bold">{selectedSize}</span> • Qty: {quantity}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            className={`py-2.5 px-4 rounded-full font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              added ? "bg-emerald-600 text-white" : "bg-white text-[#090a10] border border-black/20"
            }`}
          >
            {added ? <Check size={14} /> : <ShoppingBag size={14} />}
            <span>{added ? "Added" : "Add"}</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-[#090a10] hover:bg-black text-white py-2.5 px-5 rounded-full font-tech font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <Zap size={14} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
