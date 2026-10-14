"use client";

import React, { useState } from "react";
import Scroll3DText from "@/components/Scroll3DText";
import { MessageCircle, Mail, MapPin, Truck, RefreshCw, ShieldCheck, Check, Sparkles, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", orderNumber: "" });
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || `${formData.phone || "guest"}@customer.thvizn.in`,
          phone: formData.phone,
          orderNumber: formData.orderNumber,
          message: formData.message,
          subject: formData.orderNumber ? `Order #${formData.orderNumber} Inquiry` : "Customer Support Inquiry"
        })
      });
      const data = await res.json();
      if (data.ticketNumber) {
        setTicketId(data.ticketNumber);
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 min-h-[80vh] space-y-14">
      {/* Page Header with High-End Display Typography */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-zinc-300 text-[11px] font-thinoo font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239] animate-pulse" />
          <span>CUSTOMER CONCIERGE // 24/7 HELPDESK</span>
        </div>
        <div>
          <Scroll3DText
            as="h1"
            variant="chrome"
            className="text-3xl sm:text-5xl md:text-6xl font-soria font-bold uppercase tracking-[0.08em] block drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            <span className="text-white">HOW CAN WE</span>{" "}
            <span className="text-[#e11d48]">HELP YOU?</span>
          </Scroll3DText>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 font-thinoo font-bold tracking-wider leading-relaxed max-w-lg mx-auto">
          Direct VIP assistance for order dispatch, custom sizing queries, and zero-hassle exchanges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Support Channels (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 space-y-5 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-xs font-display font-extrabold uppercase tracking-widest text-white">
                INSTANT DIRECT CHANNELS
              </h2>
              <span className="text-[10px] font-tech text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">
                AVG REPLY &lt; 15 MIN
              </span>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210?text=Hi%20THVIZN,%20I%20need%20help%20with%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-black/40 border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-950/60 transition-all duration-300 group shadow-lg"
            >
              <div className="w-11 h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <MessageCircle size={22} />
              </div>
              <div>
                <div className="text-xs font-display font-bold uppercase text-white group-hover:text-emerald-300 transition-colors">
                  WhatsApp VIP Support
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  +91 98765 43210 (10 AM - 9 PM IST)
                </div>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all">
              <div className="w-11 h-11 bg-zinc-900 border border-white/10 text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                <Mail size={18} className="text-red-400" />
              </div>
              <div>
                <div className="text-xs font-display font-bold uppercase text-white">
                  Email Help Desk
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  support@thvizn.in
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all">
              <div className="w-11 h-11 bg-zinc-900 border border-white/10 text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                <MapPin size={18} className="text-zinc-400" />
              </div>
              <div>
                <div className="text-xs font-display font-bold uppercase text-white">
                  Design Headquarters
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  THVIZN Studios, Hauz Khas Village, New Delhi - 110016
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (7 columns) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h2 className="text-xs font-display font-extrabold uppercase tracking-widest text-white">
                  LOG A PRIORITY TICKET
                </h2>
                <p className="text-[11px] text-zinc-400 font-tech mt-0.5">
                  Synced directly with the store management team
                </p>
              </div>
              <Sparkles size={16} className="text-zinc-300" />
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check size={24} />
                </div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">
                  Support Ticket Logged Successfully
                </h3>
                {ticketId && (
                  <div className="font-mono text-xs font-bold bg-black/60 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/30 inline-block">
                    Reference ID: #{ticketId}
                  </div>
                )}
                <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Our concierge team has received your inquiry. We will contact you directly via WhatsApp / Email with an update.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", message: "", orderNumber: "" });
                  }}
                  className="mt-2 text-xs font-tech font-bold uppercase text-zinc-400 hover:text-white underline"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-tech font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Mehra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.12] focus:border-white/50 focus:bg-white/[0.07] text-white placeholder-zinc-500 rounded-lg p-2.5 outline-none font-tech transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-tech font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.12] focus:border-white/50 focus:bg-white/[0.07] text-white placeholder-zinc-500 rounded-lg p-2.5 outline-none font-tech transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-tech font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.12] focus:border-white/50 focus:bg-white/[0.07] text-white placeholder-zinc-500 rounded-lg p-2.5 outline-none font-tech transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-tech font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Order ID (If Applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TVZ-1082"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.12] focus:border-white/50 focus:bg-white/[0.07] text-white placeholder-zinc-500 rounded-lg p-2.5 outline-none font-tech transition-all uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-tech font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Query Details / Exchange Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your issue, size swap request, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.12] focus:border-white/50 focus:bg-white/[0.07] text-white placeholder-zinc-500 rounded-lg p-2.5 outline-none font-tech transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-display font-extrabold py-3.5 rounded-lg uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(159,18,57,0.3)] flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                >
                  <Send size={15} />
                  <span>{loading ? "LOGGING TICKET..." : "TRANSMIT INQUIRY TO SUPPORT"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Brand Policies Section */}
      <div id="policies" className="pt-10 border-t border-white/[0.08] space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold uppercase tracking-tight text-white">
            STORE POLICIES & STREETWEAR GUARANTEE
          </h2>
          <p className="text-xs text-zinc-400 font-tech">
            100% genuine craftsmanship, secure checkout, and hassle-free exchanges across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300">
          <div className="p-6 glass-panel border border-white/10 rounded-2xl space-y-2.5 shadow-xl">
            <Truck size={22} className="text-zinc-300" />
            <h3 className="font-display font-bold uppercase text-white tracking-wide">Express Delivery</h3>
            <p className="leading-relaxed text-zinc-400">
              Orders dispatched within 24 hours of confirmation. Delivery takes 3-5 business days across Indian metros via Delhivery, BlueDart, or Shiprocket.
            </p>
          </div>

          <div className="p-6 glass-panel border border-white/10 rounded-2xl space-y-2.5 shadow-xl">
            <RefreshCw size={22} className="text-zinc-300" />
            <h3 className="font-display font-bold uppercase text-white tracking-wide">7-Day Sizing Exchange</h3>
            <p className="leading-relaxed text-zinc-400">
              Need a looser oversized silhouette or smaller fit? Message our WhatsApp desk with your Order ID for immediate return pickup and exchange.
            </p>
          </div>

          <div className="p-6 glass-panel border border-white/10 rounded-2xl space-y-2.5 shadow-xl">
            <ShieldCheck size={22} className="text-zinc-300" />
            <h3 className="font-display font-bold uppercase text-white tracking-wide">Encrypted Checkout</h3>
            <p className="leading-relaxed text-zinc-400">
              256-bit SSL encrypted payments via Razorpay UPI, Credit/Debit Cards, and Netbanking. All drops are strictly 100% prepaid for express priority dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
