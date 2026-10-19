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

  // Smooth High-End Scroll Hide/Show Top Bar Transition
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (mobileMenuOpen) {
            setIsNavbarVisible(true);
            ticking = false;
            return;
          }

          if (currentScrollY < 30) {
            setIsNavbarVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
            // Scrolling DOWN -> smoothly hide top bar
            setIsNavbarVisible(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling UP -> smoothly show top bar
            setIsNavbarVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const [settings, setSettings] = useState({
    announcementText: "FREE EXPRESS SHIPPING > ₹999 // USE CODE: TVZ10 FOR 10% OFF",
    promoCode: "TVZ10",
    hoverText: "CLICK TO COPY CODE [TVZ10] FOR 10% OFF",
    showAnnouncement: true
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [deviceOrdersCount, setDeviceOrdersCount] = useState(0);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Error loading store settings:", err));

    // Check orders placed on this device
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = JSON.parse(localStorage.getItem("thvizn_my_orders") || "[]");
        if (Array.isArray(stored)) {
          setDeviceOrdersCount(stored.length);
        }
      } catch {
        // ignore
      }
    }
  }, [mobileMenuOpen]);

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
    <header className={`fixed top-0 inset-x-0 z-50 transition-transform duration-500 ease-in-out will-change-transform ${
      isNavbarVisible ? "translate-y-0" : "-translate-y-full"
    } ${
      mobileMenuOpen
        ? "bg-[#edf1f7] border-b border-black/[0.12]"
        : "bg-[#e2e8f2]/90 backdrop-blur-2xl border-b border-black/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.06)]"
    }`}>
      {/* Top Announcement Bar with Interactive Hover & Click-to-Copy (Curved Floating Landscape Pill) */}
      {settings.showAnnouncement && (
        <div className="px-4 pt-1 sm:pt-1.5 pb-0 flex justify-center">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCopyCode}
            className="relative bg-white/90 hover:bg-white cursor-pointer transition-all text-[#090a10] py-1 px-4 sm:px-5 text-center text-[9.5px] sm:text-[10px] font-bold tracking-[0.16em] uppercase flex items-center justify-center border border-black/10 rounded-full group overflow-hidden select-none shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:border-black/20 hover:scale-[1.01]"
            title="Click to copy promo code"
          >
            {/* Subtle bottom accent line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {copiedCode ? (
              <div className="flex items-center gap-2 text-emerald-600 font-mono">
                <Check size={13} className="text-emerald-600" />
                <span>COPIED CODE [{settings.promoCode}] TO CLIPBOARD! APPLY AT CHECKOUT</span>
              </div>
            ) : isHovered ? (
              <div className="flex items-center gap-2 text-[#090a10]">
                <Copy size={12} className="text-slate-600 group-hover:scale-110 transition-transform" />
                <span className="text-[#090a10] font-bold tracking-widest">
                  {settings.hoverText || `CLICK TO COPY CODE [${settings.promoCode}] FOR 10% OFF`}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-[#1e2330]">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
                <span className="font-semibold">{settings.announcementText}</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-slate-500 group-hover:text-black transition-colors ml-1 font-mono font-bold">
                  [CLICK TO COPY]
                </span>
              </div>
            )}
          </div>
        </div>
      )}


      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-13 sm:h-15 md:h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Animated 3-Lines Streetwear Hamburger Trigger & Desktop Links */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen((prev) => !prev);
            }}
            className="md:hidden w-10 h-10 -ml-1.5 flex flex-col items-center justify-center gap-1.5 p-2 text-[#090a10] focus:outline-none group relative rounded-xl hover:bg-black/[0.05] active:bg-black/[0.10] transition-colors cursor-pointer z-50 touch-manipulation select-none"
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`h-[2px] bg-[#090a10] rounded-full transition-all duration-300 ease-out origin-center ${
                mobileMenuOpen
                  ? "w-5 translate-y-1.5 rotate-45 !bg-[#090a10]"
                  : "w-5 group-hover:bg-slate-700"
              }`}
            />
            <span
              className={`h-[2px] rounded-full transition-all duration-300 ease-out ${
                mobileMenuOpen
                  ? "w-0 opacity-0 bg-transparent"
                  : "w-3.5 self-start ml-0.5 bg-[#090a10] group-hover:w-5"
              }`}
            />
            <span
              className={`h-[2px] bg-[#090a10] rounded-full transition-all duration-300 ease-out origin-center ${
                mobileMenuOpen
                  ? "w-5 -translate-y-1.5 -rotate-45 !bg-[#090a10]"
                  : "w-5 group-hover:bg-slate-700"
              }`}
            />
          </button>

          <div className="hidden md:flex items-center space-x-5 lg:space-x-7 text-[11px] lg:text-[11.5px] font-bold tracking-[0.18em] uppercase text-[#141724]">
            <Link href="/" className="hover:text-black transition-colors">
              HOME
            </Link>
            <Link href="/shop" className="hover:text-black transition-colors">
              CATALOGUE
            </Link>
            <Link href="/leaderboard" className="hover:text-black transition-colors flex items-center gap-1.5 text-[#141724]">
              <Trophy size={13} className="text-slate-700 group-hover:text-black" />
              <span>TOP 5</span>
            </Link>
            <Link href="/contact" className="hover:text-black transition-colors">
              SUPPORT
            </Link>
          </div>
        </div>

        {/* Center: Brand Logo (Crisp Red Star Eye Emblem) */}
        <Link href="/" className="flex items-center justify-center group py-0.5" aria-label="THVIZN Home">
          <div className="relative w-28 h-9 sm:w-36 sm:h-11 md:w-44 md:h-13 opacity-95 hover:opacity-100 transition-all duration-300 hover:scale-105 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
            <Image
              src="/images/star-logo.png"
              alt="THVIZN Official Brandmark"
              fill
              sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right: Search Bar, Tracking, Admin, Cart */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Desktop Sleek Search Input */}
          <div className="hidden lg:block">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search streetwear drops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/90 backdrop-blur-xl border border-black/15 hover:border-black/30 focus:border-black/60 focus:bg-white focus:ring-1 focus:ring-black/15 text-[#090a10] placeholder-slate-500 rounded-full pl-9 pr-8 py-1.5 text-xs w-48 xl:w-64 transition-all duration-300 outline-none font-tech shadow-sm"
              />
              <button
                type="submit"
                className="absolute left-2.5 text-slate-500 hover:text-black transition-colors cursor-pointer"
                aria-label="Submit search"
              >
                <Search size={14} />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-slate-500 hover:text-black text-xs"
                >
                  <X size={13} />
                </button>
              )}
            </form>
          </div>

          {/* Mobile / Tablet Search Toggle Button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 text-[#090a10] hover:text-slate-600 transition-colors"
            aria-label="Toggle search bar"
          >
            <Search size={18} />
          </button>

          {/* Track Order Link */}
          <Link
            href="/track"
            className="hidden sm:flex items-center gap-1.5 text-xs font-tech font-bold text-[#141724] hover:text-black uppercase tracking-wider relative"
          >
            <Truck size={14} />
            <span>{deviceOrdersCount > 0 ? "MY ORDERS" : "TRACK"}</span>
            {deviceOrdersCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#090a10] hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-0.5 bg-[#090a10] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Expandable Search Input for Mobile/Tablet */}
      {searchOpen && (
        <div className="border-t border-black/[0.08] bg-white/95 backdrop-blur-2xl px-4 py-3 sm:px-8 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search oversized tees, hoodies, acid wash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f1f5f9] border border-black/10 focus:border-black rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm text-[#090a10] placeholder-slate-500 focus:outline-none transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#090a10] hover:bg-black text-white px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors shrink-0 shadow-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-slate-500 hover:text-black"
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
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#edf2f8]/98 backdrop-blur-2xl border-r border-black/[0.12] shadow-[0_0_60px_rgba(0,0,0,0.18)] flex flex-col justify-between text-[#090a10] animate-in slide-in-from-left duration-300 ease-out h-full overflow-y-auto">
              {/* Top Bar inside Left Drawer */}
              <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-black/[0.08] shrink-0 bg-[#e5ecf4]/90">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center group cursor-pointer"
                  aria-label="THVIZN Home"
                >
                  <div className="relative w-24 h-10 opacity-90 hover:opacity-100 transition-opacity filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
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
                  className="w-9 h-9 flex items-center justify-center text-[#090a10] bg-black/[0.06] hover:bg-black/[0.12] active:scale-95 rounded-full transition-all cursor-pointer"
                  aria-label="Close Mobile Menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 px-5 py-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Mobile Search Bar */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search drops, hoodies, tees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/90 border border-black/15 focus:border-black/60 focus:bg-white rounded-xl pl-10 pr-9 py-2.5 text-xs text-[#090a10] placeholder-slate-500 outline-none transition-all shadow-sm"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </form>

                  {/* Quick Category Shortcuts */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => handleNav("/shop")}
                      className="bg-[#090a10] text-white px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shadow-sm"
                    >
                      All Drops
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/shop?cat=tees")}
                      className="bg-white/90 text-[#090a10] hover:bg-white border border-black/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shadow-sm"
                    >
                      Tees
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/shop?cat=hoodies")}
                      className="bg-white/90 text-[#090a10] hover:bg-white border border-black/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shadow-sm"
                    >
                      Hoodies
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/shop?cat=acid")}
                      className="bg-white/90 text-[#090a10] hover:bg-white border border-black/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shadow-sm"
                    >
                      Acid Wash
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/shop?cat=bottoms")}
                      className="bg-white/90 text-[#090a10] hover:bg-white border border-black/10 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shadow-sm"
                    >
                      Bottoms
                    </button>
                  </div>

                  {/* Menu Links with Staggered Typography & Index Badges */}
                  <nav className="flex flex-col space-y-1 text-sm font-bold uppercase tracking-wider divide-y divide-black/[0.06]">
                    <button
                      type="button"
                      onClick={() => handleNav("/")}
                      className="w-full flex items-center justify-between py-3.5 text-[#090a10] hover:text-slate-600 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-slate-500">01</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em]">HOME</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNav("/shop")}
                      className="w-full flex items-center justify-between py-3.5 text-[#090a10] hover:text-slate-600 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-slate-500">02</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em]">CATALOGUE</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNav("/leaderboard")}
                      className="w-full flex items-center justify-between py-3.5 text-[#090a10] hover:text-slate-600 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-slate-500">03</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em] flex items-center gap-2">
                          <span>TOP 5</span>
                          <span className="text-[8px] font-bold text-[#090a10] bg-black/[0.06] border border-black/10 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
                            LIVE
                          </span>
                        </span>
                      </div>
                      <Trophy size={16} className="text-slate-600 group-hover:text-black transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNav("/track")}
                      className="w-full flex items-center justify-between py-3.5 text-[#090a10] hover:text-slate-600 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-slate-500">04</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em] flex items-center gap-2">
                          <span>{deviceOrdersCount > 0 ? "MY ORDERS" : "TRACK ORDER"}</span>
                          {deviceOrdersCount > 0 && (
                            <span className="text-[9px] font-mono font-black text-white bg-[#090a10] px-2 py-0.5 rounded-full">
                              {deviceOrdersCount} ON PHONE
                            </span>
                          )}
                        </span>
                      </div>
                      <Truck size={16} className="text-slate-600 group-hover:text-black transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNav("/contact")}
                      className="w-full flex items-center justify-between py-3.5 text-[#090a10] hover:text-slate-600 group transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-slate-500">05</span>
                        <span className="text-lg sm:text-xl font-bold tracking-[0.14em]">CUSTOMER CARE</span>
                      </div>
                      <MessageCircle size={16} className="text-slate-600 group-hover:text-black transition-colors" />
                    </button>
                  </nav>
                </div>

                {/* Bottom Fast VIP Actions for Mobile */}
                <div className="pt-5 border-t border-black/[0.08] space-y-3">
                  <a
                    href="https://wa.me/919876543210?text=Hi%20THVIZN,%20I%20need%20help%20with%20an%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-100/80 border border-emerald-500/30 text-emerald-900 font-bold text-xs uppercase tracking-wider hover:bg-emerald-200/80 transition-colors shadow-sm"
                  >
                    <MessageCircle size={16} className="text-[#25D366]" />
                    <span>WHATSAPP VIP HELP</span>
                  </a>

                  <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-mono">
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
