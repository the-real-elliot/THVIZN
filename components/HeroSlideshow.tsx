"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";

interface Slide {
  id: number;
  tag: string;
  tagBadge: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
  specs: string[];
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: "NEW SEASON // DROP 01",
    tagBadge: "280 GSM HEAVYWEIGHT",
    title: "Heavyweight Silhouettes.",
    highlightText: "Raw Everyday Comfort.",
    description: "280–420 GSM pure combed cotton engineered and crafted in India. Relaxed boxy drape, drop shoulder architecture, and non-bacon ribbed collars.",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1200&auto=format&fit=crop&q=80",
    ctaText: "Shop Collection",
    ctaLink: "/shop",
    secondaryText: "Explore Tees",
    secondaryLink: "/shop?cat=Oversized%20Tees",
    specs: ["100% Cotton", "Pre-Shrunk", "Drop Shoulder"]
  },
  {
    id: 2,
    tag: "WINTER 2026 // FLEECE DROP",
    tagBadge: "420 GSM FRENCH TERRY",
    title: "Sculpted French Terry.",
    highlightText: "Built For The Streets.",
    description: "Ultra-heavyweight 420 GSM loopback cotton fleece. Double-layered structured hood that never collapses, paired with antique silver hardware.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&auto=format&fit=crop&q=80",
    ctaText: "Shop Hoodies",
    ctaLink: "/shop?cat=Hoodies",
    secondaryText: "View 420 GSM",
    secondaryLink: "/product/thvizn-cyber-eye-heavy-hoodie",
    specs: ["420 GSM Terry", "Silver Zipper", "Ribbed Cuffs"]
  },
  {
    id: 3,
    tag: "MINERAL STONE WASH // ZERO PLASTIC",
    tagBadge: "INDIVIDUALLY DYE-WASHED",
    title: "Acid Mineral Wash.",
    highlightText: "Zero Duplicate Finishes.",
    description: "Artisanal stone-washed charcoal and mineral tones. Each garment possesses a unique vintage distress gradient with zero-crack discharge prints.",
    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1200&auto=format&fit=crop&q=80",
    ctaText: "Shop Acid Wash",
    ctaLink: "/shop?cat=Acid%20Wash",
    secondaryText: "View All Drops",
    secondaryLink: "/shop",
    specs: ["Vintage Fading", "Discharge Print", "Breathable"]
  }
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-white border-b border-zinc-200 overflow-hidden bg-street-grid"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left transition-all duration-500 ease-out">
            <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-zinc-700">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-pulse" />
              <span>{slide.tag}</span>
              <span className="text-zinc-300">|</span>
              <span className="font-mono font-bold text-black">{slide.tagBadge}</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111113] leading-[1.08]">
                {slide.title} <br className="hidden sm:inline" />
                <span className="text-[#ff2a2a]">{slide.highlightText}</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed mx-auto lg:mx-0">
              {slide.description}
            </p>

            {/* Quick Specs Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {slide.specs.map((sp, idx) => (
                <span
                  key={idx}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded"
                >
                  {sp}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href={slide.ctaLink}
                className="w-full sm:w-auto bg-[#111113] hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href={slide.secondaryLink}
                className="w-full sm:w-auto bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded transition-colors flex items-center justify-center"
              >
                {slide.secondaryText}
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-[11px] font-medium text-zinc-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-zinc-700" />
                Free Shipping Above ₹999
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-zinc-700" />
                Instant UPI &amp; Express Courier
              </span>
            </div>
          </div>

          {/* Right Slideshow Photo Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-sm overflow-hidden border border-zinc-200 bg-zinc-100 shadow-md">
              <Image
                key={slide.id}
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover transition-opacity duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Floating Silhouette Tag */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="bg-black/85 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded flex items-center gap-2 border border-white/10 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a]" />
                  <span>THVIZN // DROP VERIFIED</span>
                </div>

                <div className="bg-white/90 backdrop-blur-md text-black text-[10px] font-mono font-bold px-2.5 py-1.5 rounded shadow">
                  0{currentSlide + 1} / 0{SLIDES.length}
                </div>
              </div>

              {/* Prev / Next Slide Arrows */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
                  }}
                  className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-md transition-all hover:scale-105"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
                  }}
                  className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-md transition-all hover:scale-105"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Slide Progress Indicator Bars */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? "w-8 bg-[#111113]"
                      : "w-2 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
