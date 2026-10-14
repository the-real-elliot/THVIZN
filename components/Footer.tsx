"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, Mail, ShoppingBag, MapPin, Building2, Clock, Phone, Award } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function Footer() {
  const { setIsCartOpen, totalItems } = useCart();

  return (
    <footer className="bg-[#050507] text-white pt-16 pb-12 border-t border-[#181822] relative z-10 selection:bg-[#9f1239] selection:text-white">
      {/* 1. Value Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center">
          <Truck size={24} className="text-zinc-300 mb-2" />
          <h4 className="font-tech font-bold text-xs uppercase tracking-wider">PAN-INDIA EXPRESS</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-body">Free shipping over ₹999 on all drops</p>
        </div>
        <div className="flex flex-col items-center">
          <RefreshCw size={24} className="text-zinc-300 mb-2" />
          <h4 className="font-tech font-bold text-xs uppercase tracking-wider">7-DAY EXCHANGES</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-body">Zero-friction size & fit replacement</p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck size={24} className="text-zinc-300 mb-2" />
          <h4 className="font-tech font-bold text-xs uppercase tracking-wider">100% SECURE PAYMENTS</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-body">Razorpay 100% Prepaid (UPI, Cards &amp; NetBanking)</p>
        </div>
        <div className="flex flex-col items-center">
          <Mail size={24} className="text-zinc-300 mb-2" />
          <h4 className="font-tech font-bold text-xs uppercase tracking-wider">VIP CONCIERGE</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-body">WhatsApp priority support &lt; 15 mins</p>
        </div>
      </div>

      {/* 2. Main Company Info & Direct Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Column 1: Brand Ethos & Specs (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-24 h-11 sm:w-28 sm:h-12 opacity-85 hover:opacity-100 transition-opacity filter drop-shadow-[0_0_15px_rgba(255,26,42,0.4)]">
              <Image
                src="/images/star-logo.png"
                alt="THVIZN Brandmark"
                fill
                sizes="110px"
                className="object-contain"
              />
            </div>
            <span className="font-thinoo font-bold text-2xl tracking-[0.22em] uppercase text-white/95 text-contrast-crisp">
              THVIZN
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed font-body">
            THVIZN is a progressive Indian streetwear label built on raw individuality, heavyweight fabric engineering, and drop-culture aesthetics. Every specimen is crafted from 280–420 GSM pure combed cotton with architectural boxy cuts designed for the unforgotten.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-thinoo font-bold text-zinc-300 uppercase tracking-wider">
            <span className="bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-full">GST REGISTERED</span>
            <span className="bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-full">100% COMBED COTTON</span>
            <span className="bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-full">MUMBAI / TOKYO</span>
          </div>
        </div>

        {/* Column 2: Company Information & Corporate Registry (4 cols) */}
        <div className="md:col-span-4 space-y-3.5">
          <h4 className="text-xs font-thinoo font-bold uppercase tracking-[0.2em] text-zinc-200 flex items-center gap-2 border-b border-white/[0.08] pb-2">
            <Building2 size={14} className="text-[#9f1239]" />
            <span>COMPANY &amp; ATELIER INFO</span>
          </h4>

          <div className="space-y-2.5 text-xs text-zinc-400 font-body leading-relaxed">
            <div>
              <span className="text-zinc-200 font-semibold block">Legal Entity Name:</span>
              <span className="text-[11px] font-mono text-zinc-300">THVIZN APPAREL &amp; DESIGN PRIVATE LIMITED</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-tech">CIN Registry:</span>
                <span className="text-zinc-300">U18101MH2026PTC394821</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-tech">GSTIN:</span>
                <span className="text-zinc-300">27AABCT8492Q1ZV</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-zinc-200 font-semibold block flex items-center gap-1.5">
                <MapPin size={12} className="text-zinc-400" />
                <span>Registered Atelier &amp; Head Studio:</span>
              </span>
              <span className="text-[11px] text-zinc-400 block mt-0.5">
                Atelier Suite 04, Phoenix Mills Compound, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013, India.
              </span>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[10px] font-tech text-emerald-400">
              <Award size={13} className="shrink-0" />
              <span>ISO 9001:2015 Quality Certified • OEKO-TEX Standard 100 Non-toxic Dyes</span>
            </div>
          </div>
        </div>

        {/* Column 3: Direct Navigation Links - Exactly Customer Support, Track Order, Carts (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-thinoo font-bold uppercase tracking-[0.2em] text-zinc-200 border-b border-white/[0.08] pb-2">
            DIRECT SERVICES
          </h4>

          <ul className="space-y-2.5 text-xs font-thinoo font-bold uppercase tracking-[0.14em]">
            <li>
              <Link
                href="/contact"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#9f1239] group-hover:scale-110 transition-transform" />
                  <span>CUSTOMER SUPPORT</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">&rarr;</span>
              </Link>
            </li>

            <li>
              <Link
                href="/track"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-zinc-400 group-hover:text-white group-hover:scale-110 transition-transform" />
                  <span>TRACK ORDER</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">&rarr;</span>
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-zinc-400 group-hover:text-white group-hover:scale-110 transition-transform" />
                  <span>CARTS &amp; BAG</span>
                </div>
                {totalItems > 0 ? (
                  <span className="bg-white text-black text-[9px] font-mono font-black px-2 py-0.5 rounded-full shadow-sm">
                    {totalItems} ITEMS
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">OPEN BAG &rarr;</span>
                )}
              </button>
            </li>

            <li>
              <a
                href="https://wa.me/919876543210?text=Hi%20THVIZN,%20I%20need%20help%20with%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 hover:text-emerald-200 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>WHATSAPP VIP HELPDESK</span>
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">ONLINE</span>
              </a>
            </li>
          </ul>

          <div className="pt-1 text-[11px] text-zinc-400 font-body space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Clock size={12} className="text-zinc-400" />
              <span>Operations: 10:00 AM – 8:00 PM IST (Mon–Sat)</span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Direct Inquiries: <span className="font-mono text-zinc-300">support@thvizn.in</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Very Down Side: Corporate Copyright & Compliance Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-4">
        <div className="font-tech text-center sm:text-left">
          &copy; {new Date().getFullYear()} THVIZN APPAREL &amp; DESIGN PVT LTD. ALL RIGHTS RESERVED.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-tech text-zinc-400">
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
