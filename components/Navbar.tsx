"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Search, X, ShieldCheck, Truck, Trophy, ChevronRight, MessageCircle, Copy, Check } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Store Settings (Announcement Bar & Promo)
  const [settings, setSettings] = useState({
    announcementText: "FREE EXPRESS SHIPPING > ₹999 // USE CODE: TVZ10 FOR 10% OFF",
    promoCode: "TVZ10",
    hoverText: "CLICK TO COPY CODE [TVZ10] FOR 10% OFF",
    showAnnouncement: true
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Error loading store settings:", err));
  }, []);

  // Lock body scroll and close on Escape when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(settings.promoCode || "TVZ10");
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2400);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    setSearchOpen(false);
    if (query) {
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/shop`);
    }
  };

  const handleNav = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all ${
      mobileMenuOpen
        ? "bg-[#07070a] border-b border-white/[0.08]"
        : "bg-[#07070a]/92 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
    }`}>
      {/* Top Announcement Bar with Interactive Hover & Click-to-Copy (Curved Floating Landscape Pill) */}
      {settings.showAnnouncement && (
        <div className="px-4 pt-2.5 pb-1 flex justify-center">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCopyCode}
            className="relative bg-[#0c0c16]/95 hover:bg-[#141424] cursor-pointer transition-all text-zinc-200 py-1.5 px-5 sm:px-6 text-center text-[10px] sm:text-[11px] font-thinoo font-bold tracking-[0.16em] uppercase flex items-center justify-center border border-white/15 rounded-full group overflow-hidden select-none shadow-[0_4px_20px_rgba(0,0,0,0.7)] hover:border-white/30 hover:scale-[1.01]"
            title="Click to copy promo code"
          >
            {/* Subtle bottom accent line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#9f1239]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {copiedCode ? (
              <div className="flex items-center gap-2 text-emerald-400 font-mono">
                <Check size={13} className="text-emerald-400" />
                <span>COPIED CODE [{settings.promoCode}] TO CLIPBOARD! APPLY AT CHECKOUT</span>
              </div>
            ) : isHovered ? (
              <div className="flex items-center gap-2 text-white">
                <Copy size={12} className="text-zinc-300 group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold tracking-widest">
                  {settings.hoverText || `CLICK TO COPY CODE [${settings.promoCode}] FOR 10% OFF`}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239] animate-pulse" />
                <span className="font-semibold">{settings.announcementText}</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-zinc-400 group-hover:text-zinc-200 transition-colors ml-1 font-mono font-bold">
                  [CLICK TO COPY]
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Animated 3-Lines Streetwear Hamburger Trigger & Desktop Links */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen((prev) => !prev);
            }}
            className="md:hidden w-11 h-11 -ml-2 flex flex-col items-center justify-center gap-1.5 p-2.5 text-white focus:outline-none group relative rounded-xl hover:bg-white/[0.08] active:bg-white/[0.15] transition-colors cursor-pointer z-50 touch-manipulation select-none"
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`h-[2px] bg-white rounded-full transition-all duration-300 ease-out origin-center ${
                mobileMenuOpen
                  ? "w-6 translate-y-2 rotate-45 !bg-white"
                  : "w-6 group-hover:bg-zinc-300"
              }`}
            />
            <span
              className={`h-[2px] rounded-full transition-all duration-300 ease-out ${
                mobileMenuOpen
                  ? "w-0 opacity-0 bg-transparent"
                  : "w-4 self-start ml-0.5 bg-zinc-400 group-hover:w-6 group-hover:bg-white"
              }`}
            />
            <span
              className={`h-[2px] bg-white rounded-full transition-all duration-300 ease-out origin-center ${
                mobileMenuOpen
                  ? "w-6 -translate-y-2 -rotate-45 !bg-white"
                  : "w-6 group-hover:bg-zinc-300"
              }`}
            />
          </button>

          <div className="hidden md:flex items-center space-x-6 text-[12px] font-thinoo font-bold tracking-[0.18em] uppercase text-zinc-300">
            <Link href="/" className="hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              HOME
            </Link>
            <Link href="/shop" className="hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              CATALOGUE
            </Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors flex items-center gap-1.5 text-zinc-200 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <Trophy size={13} className="text-zinc-300 group-hover:text-white" />
              <span>TOP 5</span>
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              SUPPORT
            </Link>
          </div>
        </div>

        {/* Center: Brand Logo (Enlarged Translucent Luminous Eye Emblem - Standalone Wordmark) */}
        <Link href="/" className="flex items-center justify-center group py-1" aria-label="THVIZN Home">
          <div className="relative w-24 h-11 sm:w-32 sm:h-14 md:w-36 md:h-16 opacity-85 hover:opacity-100 transition-all duration-500 hover:scale-105 filter drop-shadow-[0_0_18px_rgba(255,26,42,0.42)]">
            <Image
              src="/images/star-logo.png"
              alt="THVIZN Official Brandmark"
              fill
              sizes="(max-width: 640px) 110px, 150px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right: Search Bar, Tracking, Admin, Cart */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Desktop Sleek Search Input */}
          <div className="hidden lg:block">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search streetwear drops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0e0e18]/90 backdrop-blur-xl border border-white/20 hover:border-white/35 focus:border-white/70 focus:bg-[#141422] focus:ring-1 focus:ring-white/20 text-white placeholder-zinc-400 rounded-full pl-9 pr-8 py-1.5 text-xs w-48 xl:w-64 transition-all duration-300 outline-none font-tech shadow-inner"
              />
              <button
                type="submit"
                className="absolute left-2.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Submit search"
              >
                <Search size={14} />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-zinc-400 hover:text-white text-xs"
                >
                  <X size={13} />
                </button>
              )}
            </form>
          </div>

          {/* Mobile / Tablet Search Toggle Button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white transition-colors"
            aria-label="Toggle search bar"
          >
            <Search size={18} />
          </button>

          {/* Track Order Link */}
          <Link
            href="/track"
            className="hidden sm:flex items-center gap-1.5 text-xs font-tech font-bold text-zinc-200 hover:text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            <Truck size={14} />
            <span>TRACK</span>
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-white hover:text-zinc-300 transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-0.5 bg-white text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-white/20">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Expandable Search Input for Mobile/Tablet */}
      {searchOpen && (
        <div className="border-t border-[#1a1a24] bg-[#09090e] px-4 py-3 sm:px-8 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search oversized tees, hoodies, acid wash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121218] border border-[#232330] focus:border-zinc-300 rounded pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-white hover:bg-zinc-200 text-black px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-zinc-400 hover:text-white"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Luxury Overlay Drawer (Left Side Slide-In with Right Mosaic Backdrop like Cart) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[999] overflow-hidden">
          {/* Right Backdrop with smooth blur fade and mosaic effect like cart */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#08080d]/95 backdrop-blur-2xl border-r border-white/[0.12] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between text-[#f4f4f6] animate-in slide-in-from-left duration-300 ease-out h-full overflow-y-auto">
              {/* Top Bar inside Left Drawer */}
              <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] shrink-0 bg-[#08080d]/90">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center group cursor-pointer"
                  aria-label="THVIZN Home"
                >
                  <div className="relative w-24 h-10 opacity-85 hover:opacity-100 transition-opacity filter drop-shadow-[0_0_15px_rgba(255,26,42,0.4)]">
                    <Image
                      src="/images/star-logo.png"
                      alt="THVIZN Brandmark"
                      fill
                      sizes="96px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer"
                  aria-label="Close Mobile Menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 px-5 py-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Mobile Search Bar */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search drops, hoodies, tees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/15 focus:border-white/60 focus:bg-white/[0.08] rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-zinc-500 outline-none font-thinoo transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </form>

                  {/* Quick Category Shortcuts */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px] font-thinoo font-bold uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => handleNav("/shop")}
                      className="bg-white/15 hover:bg-white/25 active:scale-95 text-white border border-white/20 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                    >
                      All Drops
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/shop?cat=tees")}
                      className="bg-white/[0.05] hover:bg-white/15 active:scale-95 text-zinc-300 hover:text-white border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Tees
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/shop?cat=hoodies")}
                      className="bg-white/[0.05] hover:bg-white/15 active:scale-95 text-zinc-300 hover:text-white border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Hoodies
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/shop?cat=acid")}
                      className="bg-white/[0.05] hover:bg-white/15 active:scale-95 text-zinc-300 hover:text-white border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Acid Wash
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/shop?cat=bottoms")}
                      className="bg-white/[0.05] hover:bg-white/15 active:scale-95 text-zinc-300 hover:text-white border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                    >
                      Bottoms
                    </button>
                  </div>

                  {/* Menu Links with Staggered Typography & Index Badges */}
                  <nav className="flex flex-col space-y-1 text-sm font-thinoo font-bold uppercase tracking-wider divide-y divide-white/[0.05]">
                    <button
                      type="button"
                      onClick={() => handleNav("/")}
                      className="w-full flex items-center justify-between py-3.5 text-white hover:text-zinc-300 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-zinc-400">01</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em]">HOME</span>
                      </div>
                      <ChevronRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNav("/shop")}
                      className="w-full flex items-center justify-between py-3.5 text-white hover:text-zinc-300 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-zinc-400">02</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em]">CATALOGUE</span>
                      </div>
                      <ChevronRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNav("/leaderboard")}
                      className="w-full flex items-center justify-between py-3.5 text-white hover:text-zinc-300 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-zinc-400">03</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em] flex items-center gap-2">
                          <span>TOP 5</span>
                          <span className="text-[8px] font-thinoo font-bold text-zinc-300 bg-white/[0.08] border border-white/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239] animate-pulse" />
                            LIVE
                          </span>
                        </span>
                      </div>
                      <Trophy size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNav("/track")}
                      className="w-full flex items-center justify-between py-3.5 text-white hover:text-zinc-300 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-zinc-400">04</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em]">TRACK ORDER</span>
                      </div>
                      <Truck size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNav("/contact")}
                      className="w-full flex items-center justify-between py-3.5 text-white hover:text-zinc-300 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-zinc-400">05</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em]">CUSTOMER CARE</span>
                      </div>
                      <MessageCircle size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                    </button>
                  </nav>
                </div>

                {/* Bottom Fast VIP Actions for Mobile */}
                <div className="pt-5 border-t border-white/[0.08] space-y-3">
                  <a
                    href="https://wa.me/919876543210?text=Hi%20THVIZN,%20I%20need%20help%20with%20an%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-thinoo font-bold text-xs uppercase tracking-wider hover:bg-emerald-900/40 transition-colors"
                  >
                    <MessageCircle size={16} className="text-[#25D366]" />
                    <span>WHATSAPP VIP HELP</span>
                  </a>

                  <div className="text-center text-[10px] font-thinoo text-zinc-500 uppercase tracking-widest">
                    THVIZN // ARCHIVE FW26 • MUMBAI / TOKYO
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
