"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { INITIAL_PRODUCTS, getProductByHandleOrId } from "@/lib/products-data";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Scroll3DText from "@/components/Scroll3DText";
import {
  Check,
  ShoppingBag,
  Zap,
  Truck,
  RefreshCw,
  ShieldCheck,
  Ruler,
  ChevronRight,
  ChevronLeft,
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [selectedSize, setSelectedSize] = useState<Product["sizes"][0]>(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Touch swipe support for smooth mobile photo navigation
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const images = product.images.length > 0 ? product.images : ["/images/star-logo.png"];

  const handlePrevImage = () => {
    setSlideDirection("prev");
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSlideDirection("next");
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNextImage();
    } else if (diff < -45) {
      handlePrevImage();
    }
    setTouchStartX(null);
  };

  // Indian Pincode check simulator
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryStatus(`Express delivery by Delhivery: 3-4 days to Pincode ${pincode}`);
    } else {
      setDeliveryStatus("Please enter a valid 6-digit Indian pincode");
    }
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        size: selectedSize,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        size: selectedSize,
      },
      quantity
    );
    router.push("/checkout");
  };

  const allProducts = INITIAL_PRODUCTS;
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 md:pb-12 bg-[#070709] text-[#f4f4f6]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8 uppercase tracking-wider font-tech font-medium">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight size={12} className="text-zinc-500" />
        <Link href="/shop" className="hover:text-white transition-colors">
          Shop
        </Link>
        <ChevronRight size={12} className="text-zinc-500" />
        <span className="text-zinc-200 line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* ================= PHOTO GALLERY WITH SMOOTH LEFT/RIGHT TRANSITIONS ================= */}
        <div className="space-y-4">
          <div
            className="relative aspect-3/4 w-full bg-[#0b0b10] rounded-md sm:rounded-lg overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.8)] group select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Subtle Star Aura Behind Garment */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="w-56 h-56 bg-radial-star-glow rounded-full blur-2xl opacity-40" />
            </div>

            {/* Active Product Image with Silky Slide & Cross-fade Transition */}
            <div className="relative w-full h-full overflow-hidden">
              {images.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className={`absolute inset-0 transition-all duration-500 ease-out transform-gpu ${
                    idx === activeImageIndex
                      ? "opacity-100 scale-100 z-10 translate-x-0"
                      : idx < activeImageIndex
                      ? "opacity-0 scale-98 z-0 -translate-x-full"
                      : "opacity-0 scale-98 z-0 translate-x-full"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - View ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>

            {/* Top Tag */}
            {product.tag && (
              <span className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-white/10 rounded-full">
                {product.tag}
              </span>
            )}

            {/* Photo Counter Pill: [ 01 / 02 ] */}
            <span className="absolute bottom-4 right-4 z-20 bg-black/80 backdrop-blur-md text-zinc-400 font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-full border border-white/10">
              {activeImageIndex + 1 < 10 ? `0${activeImageIndex + 1}` : activeImageIndex + 1} / {images.length < 10 ? `0${images.length}` : images.length}
            </span>

            {/* Left & Right Smooth Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-[#ff1a2a] text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-70 hover:opacity-100 transition-all duration-200"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-[#ff1a2a] text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-70 hover:opacity-100 transition-all duration-200"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip with Smooth Transitions */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSlideDirection(idx > activeImageIndex ? "next" : "prev");
                    setActiveImageIndex(idx);
                  }}
                  className={`relative w-20 h-24 rounded-md overflow-hidden border transition-all duration-300 shrink-0 ${
                    activeImageIndex === idx
                      ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] opacity-100 scale-102"
                      : "border-[#1e1e28] opacity-60 hover:opacity-90"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= PRODUCT DETAILS & PURCHASE FORM ================= */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239] animate-pulse" />
              <span>{product.category} // {product.gsm} GSM HEAVYWEIGHT</span>
            </div>
            <div>
              <Scroll3DText
                as="h1"
                variant="chrome"
                className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight block leading-tight"
              >
                {product.name}
              </Scroll3DText>
            </div>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-black text-white font-mono">
                Rs. {product.price.toLocaleString("en-IN")}.00
              </span>
              <span className="text-base text-zinc-500 line-through font-mono">
                Rs. {product.originalPrice.toLocaleString("en-IN")}.00
              </span>
              <span className="bg-white/[0.1] border border-white/20 text-zinc-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wider">
                SAVE {discountPercent}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">Inclusive of all Indian taxes • Free express shipping over ₹999.</p>
          </div>

          {/* Sizing Section */}
          <div className="pt-3 border-t border-[#181822]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
                SELECT SIZE: <span className="text-white font-bold">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="text-xs font-bold text-zinc-400 hover:text-[#ff1a2a] flex items-center gap-1 transition-colors"
              >
                <Ruler size={13} />
                <span>Size Chart</span>
              </button>
            </div>

            {/* Size Pills */}
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-11 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer ${
                    selectedSize === size
                      ? "border-white bg-white text-black shadow-lg scale-105"
                      : "border-[#222230] bg-[#0d0d12] text-zinc-300 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Size Chart Popup */}
            {showSizeChart && (
              <div className="mt-4 p-5 bg-[#0e0e14] border border-[#222230] rounded-2xl text-xs space-y-2 animate-in fade-in duration-300">
                <div className="font-black uppercase tracking-wider text-white">THVIZN Streetwear Sizing (Inches)</div>
                <div className="grid grid-cols-4 gap-2 text-center border-t border-[#1e1e28] pt-2 font-mono text-zinc-300">
                  <span className="font-bold text-left text-zinc-400">Size</span>
                  <span className="font-bold text-zinc-400">Chest</span>
                  <span className="font-bold text-zinc-400">Length</span>
                  <span className="font-bold text-zinc-400">Shoulder</span>
                  <span className="text-left font-bold">S</span><span>42&quot;</span><span>28&quot;</span><span>21&quot;</span>
                  <span className="text-left font-bold">M</span><span>44&quot;</span><span>29&quot;</span><span>22&quot;</span>
                  <span className="text-left font-bold">L</span><span>46&quot;</span><span>30&quot;</span><span>23&quot;</span>
                  <span className="text-left font-bold">XL</span><span>48&quot;</span><span>31&quot;</span><span>24&quot;</span>
                </div>
                <p className="text-[10px] text-zinc-500 italic pt-1">
                  *True oversized drop-shoulder cut. Order your normal size for a relaxed drape.
                </p>
              </div>
            )}
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-[#14141c] hover:bg-[#1f1f2c] text-white border border-white/10"
                }`}
              >
                {added ? (
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

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-white hover:bg-zinc-200 text-black py-4 px-6 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Zap size={16} />
                <span>BUY IT NOW</span>
              </button>
            </div>
          </div>

          {/* Indian Pincode Delivery Estimator */}
          <div className="p-5 bg-[#0a0a0f] border border-[#1a1a24] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <Truck size={15} className="text-zinc-300" />
              <span>ESTIMATE DELIVERY TO YOUR PINCODE</span>
            </div>
            <form onSubmit={checkPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode (e.g. 110001)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 bg-[#12121a] border border-[#222230] rounded-xs px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
              <button
                type="submit"
                className="bg-[#1e1e28] hover:bg-[#2c2c3c] text-white px-4 py-1.5 text-xs font-bold uppercase rounded-xs transition-colors"
              >
                Check
              </button>
            </form>
            {deliveryStatus && (
              <p className="text-[11px] font-mono text-zinc-400">{deliveryStatus}</p>
            )}
          </div>

          {/* Garment Specifications */}
          <div className="border-t border-[#181822] pt-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200">
              GARMENT SPECIFICATIONS
            </h3>
            <div className="grid grid-cols-2 gap-y-2.5 text-xs font-medium">
              <div className="text-zinc-400">Fabric Composition:</div>
              <div className="font-bold text-white">{product.fabric}</div>
              <div className="text-zinc-400">Fit Silhouette:</div>
              <div className="font-bold text-white">{product.fit}</div>
              <div className="text-zinc-400">Fabric Weight:</div>
              <div className="font-bold text-white">{product.gsm} GSM Heavyweight</div>
              <div className="text-zinc-400">Country of Origin:</div>
              <div className="font-bold text-white">Made in India</div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-zinc-400 border-t border-[#181822]">
            <div className="flex items-center gap-2">
              <RefreshCw size={15} className="text-zinc-300" />
              <span>7 Days Easy Size Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-zinc-300" />
              <span>Razorpay Verified UPI / Cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-12 border-t border-[#181822]">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-8">
            YOU MIGHT ALSO LIKE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick Buy Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#07070a]/95 backdrop-blur-2xl border-t border-white/10 p-3 flex items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="min-w-0">
          <div className="text-xs font-mono font-black text-white truncate">
            Rs. {product.price.toLocaleString("en-IN")}.00
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            Size: <span className="text-white font-bold">{selectedSize}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            className={`py-2.5 px-4 rounded-full font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              added ? "bg-emerald-600 text-white" : "bg-[#14141c] text-white border border-white/15"
            }`}
          >
            {added ? <Check size={14} /> : <ShoppingBag size={14} />}
            <span>{added ? "Added" : "Add"}</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-white hover:bg-zinc-200 text-black py-2.5 px-5 rounded-full font-tech font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95"
          >
            <Zap size={14} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
