"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, Mail, ShoppingBag, MapPin, Building2, Clock, Phone, Award } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function Footer() {
  const { setIsCartOpen, totalItems } = useCart();

  return (
    <footer className="bg-[#d8dfea] text-[#090a10] pt-16 pb-12 border-t border-black/10 relative z-10 selection:bg-[#090a10] selection:text-white">
      {/* 1. Value Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-black/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center">
          <Truck size={24} className="text-slate-700 mb-2" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#090a10]">PAN-INDIA EXPRESS</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 font-body">Free shipping over ₹999 on all drops</p>
        </div>
        <div className="flex flex-col items-center">
          <RefreshCw size={24} className="text-slate-700 mb-2" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#090a10]">7-DAY EXCHANGES</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 font-body">Zero-friction size & fit replacement</p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck size={24} className="text-slate-700 mb-2" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#090a10]">100% SECURE PAYMENTS</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 font-body">Razorpay 100% Prepaid (UPI, Cards &amp; NetBanking)</p>
        </div>
        <div className="flex flex-col items-center">
          <Mail size={24} className="text-slate-700 mb-2" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#090a10]">VIP CONCIERGE</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 font-body">WhatsApp priority support &lt; 15 mins</p>
        </div>
      </div>

      {/* 2. Main Company Info & Direct Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Column 1: Brand Ethos & Specs (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-24 h-11 sm:w-28 sm:h-12 opacity-90 hover:opacity-100 transition-opacity filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
              <Image
                src="/images/star-logo.png"
                alt="THVIZN Brandmark"
                fill
                sizes="110px"
                className="object-contain"
              />
            </div>
            <span className="font-bold text-2xl tracking-[0.22em] uppercase text-[#090a10]">
              THVIZN
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-body">
            THVIZN is a progressive Indian streetwear label built on raw individuality, heavyweight fabric engineering, and drop-culture aesthetics. Every specimen is crafted from 280–420 GSM pure combed cotton with architectural boxy cuts designed for the unforgotten.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
            <span className="bg-white/80 border border-black/10 px-2.5 py-1 rounded-full shadow-sm">GST REGISTERED</span>
            <span className="bg-white/80 border border-black/10 px-2.5 py-1 rounded-full shadow-sm">100% COMBED COTTON</span>
            <span className="bg-white/80 border border-black/10 px-2.5 py-1 rounded-full shadow-sm">MUMBAI / TOKYO</span>
          </div>
        </div>

        {/* Column 2: Company Information & Corporate Registry (4 cols) */}
        <div className="md:col-span-4 space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#090a10] flex items-center gap-2 border-b border-black/[0.08] pb-2">
            <Building2 size={14} className="text-slate-700" />
            <span>COMPANY &amp; ATELIER INFO</span>
          </h4>

          <div className="space-y-2.5 text-xs text-slate-600 font-body leading-relaxed">
            <div>
              <span className="text-[#090a10] font-semibold block">Legal Entity Name:</span>
              <span className="text-[11px] font-mono text-[#090a10]">THVIZN APPAREL &amp; DESIGN PRIVATE LIMITED</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">CIN Registry:</span>
                <span className="text-[#090a10]">U18101MH2026PTC394821</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">GSTIN:</span>
                <span className="text-[#090a10]">27AABCT8492Q1ZV</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[#090a10] font-semibold block flex items-center gap-1.5">
                <MapPin size={12} className="text-slate-700" />
                <span>Registered Atelier &amp; Head Studio:</span>
              </span>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                Atelier Suite 04, Phoenix Mills Compound, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013, India.
              </span>
            </div>


            <div className="pt-1 flex items-center gap-2 text-[10px] font-tech text-emerald-700 font-bold">
              <Award size={13} className="shrink-0" />
              <span>ISO 9001:2015 Quality Certified • OEKO-TEX Standard 100 Non-toxic Dyes</span>
            </div>
          </div>
        </div>

        {/* Column 3: Direct Navigation Links - Exactly Customer Support, Track Order, Carts (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#090a10] border-b border-black/[0.08] pb-2">
            DIRECT SERVICES
          </h4>

          <ul className="space-y-2.5 text-xs font-bold uppercase tracking-[0.14em]">
            <li>
              <Link
                href="/contact"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 hover:bg-white border border-black/10 text-[#090a10] transition-all group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-700 group-hover:scale-110 transition-transform" />
                  <span>CUSTOMER SUPPORT</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-black">&rarr;</span>
              </Link>
            </li>

            <li>
              <Link
                href="/track"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 hover:bg-white border border-black/10 text-[#090a10] transition-all group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-slate-700 group-hover:scale-110 transition-transform" />
                  <span>TRACK ORDER</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-black">&rarr;</span>
              </Link>
            </li>


            <li>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/90 hover:bg-white border border-black/10 text-[#090a10] transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-slate-700 group-hover:scale-110 transition-transform" />
                  <span>CARTS &amp; BAG</span>
                </div>
                {totalItems > 0 ? (
                  <span className="bg-[#090a10] text-white text-[9px] font-mono font-black px-2 py-0.5 rounded-full shadow-sm">
                    {totalItems} ITEMS
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-black">OPEN BAG &rarr;</span>
                )}
              </button>
            </li>

            <li>
              <a
                href="https://wa.me/919876543210?text=Hi%20THVIZN,%20I%20need%20help%20with%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-500/30 text-emerald-900 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#25D366] group-hover:scale-110 transition-transform" />
                  <span>WHATSAPP VIP HELPDESK</span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">ONLINE</span>
              </a>
            </li>
          </ul>

          <div className="pt-1 text-[11px] text-slate-600 font-body space-y-1">
            <div className="flex items-center gap-1.5 text-[#090a10]">
              <Clock size={12} className="text-slate-700" />
              <span>Operations: 10:00 AM – 8:00 PM IST (Mon–Sat)</span>
            </div>
            <p className="text-[10px] text-slate-600">
              Direct Inquiries: <span className="font-mono text-[#090a10]">support@thvizn.in</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Very Down Side: Corporate Copyright & Compliance Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-4">
        <div className="font-tech text-center sm:text-left">
          &copy; {new Date().getFullYear()} THVIZN APPAREL &amp; DESIGN PVT LTD. ALL RIGHTS RESERVED.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-tech text-slate-600">
          <span>Razorpay Verified</span>
          <span>•</span>
          <span>UPI / Cards / NetBanking</span>
          <span>•</span>
          <span>100% Prepaid Drops</span>
          <span>•</span>
          <span>Made in India</span>
        </div>
      </div>
    </footer>
  );
}
