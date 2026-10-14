"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Order } from "@/lib/types";
import Scroll3DText from "@/components/Scroll3DText";
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Download
} from "lucide-react";

import { printOrderReceipt } from "@/lib/receipt";


function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchOrder = async (searchTarget: string) => {
    if (!searchTarget.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchTarget.trim())}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError("No streetwear order found matching this Order ID or Phone number. Please verify and retry.");
      }
    } catch {
      setError("Failed to fetch order details. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      searchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(query);
  };

  const getStepStatus = (step: string) => {
    if (!order) return "upcoming";
    const orderStatus = order.orderStatus;
    const stages = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"];
    const currentIndex = stages.indexOf(orderStatus);
    const stepIndex = stages.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[75vh] text-white">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[#ff2e63] bg-[#ff2e63]/10 border border-[#ff2e63]/30 px-3.5 py-1 rounded-full text-xs font-tech font-bold uppercase tracking-widest shadow-md">
          <Truck size={14} />
          <span>REAL-TIME DISPATCH LOGISTICS</span>
        </div>
        <div>
          <Scroll3DText
            as="h1"
            variant="chrome"
            className="text-3xl sm:text-5xl font-soria font-bold uppercase tracking-[0.08em] block drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            TRACK YOUR THVIZN DROP
          </Scroll3DText>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 font-tech">
          Enter your Order ID (e.g. TVZ-8429) or 10-digit WhatsApp phone number to inspect shipment milestones.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2.5 mt-6 max-w-lg mx-auto">
          <input
            type="text"
            required
            placeholder="Order ID (e.g. TVZ-8429) or Phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#14141e] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-white/50 font-mono shadow-inner"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white hover:bg-zinc-200 text-black px-7 py-3 text-xs font-tech font-extrabold uppercase tracking-wider rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? "SEARCHING..." : "TRACK"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-950/60 border border-red-500/40 text-red-300 p-4 rounded-xl text-xs flex items-center gap-2.5 mb-8 font-mono">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div className="bg-[#0c0c14] border border-white/12 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden space-y-6 curved-landscape-card">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#12121c] via-[#161624] to-[#12121c] text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                ORDER NUMBER
              </span>
              <h2 className="text-xl sm:text-2xl font-mono font-black text-white mt-0.5">
                #{order.orderNumber}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-tech">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span className="inline-block bg-[#ff1a2a] text-white text-[11px] font-tech font-extrabold uppercase px-3 py-1 rounded-full shadow-lg shadow-red-500/30">
                STATUS: {order.orderStatus}
              </span>
              {order.courierName && (
                <div className="text-xs text-zinc-300 font-tech font-bold flex items-center gap-1.5">
                  <span>Courier: {order.courierName}</span>
                </div>
              )}
              {order.trackingId && (
                <div className="text-xs text-zinc-400 font-mono">
                  AWB Tracking: <strong className="text-white">{order.trackingId}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Visual Milestone Stepper */}
          <div className="px-6 sm:px-8 py-4">
            <h3 className="text-xs font-display font-extrabold uppercase tracking-wider text-white mb-6">
              FULFILLMENT TIMELINE
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {[
                { title: "PLACED", label: "Order Received", desc: "Payment verified" },
                { title: "PACKED", label: "Quality Check", desc: "Sealed & tagged" },
                { title: "SHIPPED", label: "In Transit", desc: "Handed to courier" },
                { title: "DELIVERED", label: "Completed", desc: "Delivered to doorstep" },
              ].map((step, idx) => {
                const status = getStepStatus(step.title);
                return (
                  <div key={step.title} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2.5 transition-all ${
                        status === "completed"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                          : status === "active"
                          ? "bg-[#ff1a2a] text-white ring-4 ring-red-500/20 shadow-lg shadow-red-500/40"
                          : "bg-white/[0.06] text-zinc-500 border border-white/10"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 size={18} />
                      ) : status === "active" ? (
                        <Clock size={16} />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="text-xs font-display font-extrabold uppercase tracking-tight text-white">
                      {step.title}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-tech mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Shipping Address Details */}
          <div className="p-6 sm:p-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Items */}
            <div className="space-y-4">
              <h4 className="text-xs font-display font-extrabold uppercase tracking-wider text-white">
                ITEMS IN THIS SHIPMENT
              </h4>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 text-xs border-b border-white/[0.06] pb-3">
                    <div className="relative w-12 h-14 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white uppercase line-clamp-1">{item.name}</div>
                      <div className="text-zinc-400 text-[11px] font-mono mt-0.5">
                        Size: {item.size} • Qty: {item.quantity}
                      </div>
                      <div className="font-mono font-black text-white mt-1">
                        Rs. {(item.price * item.quantity).toLocaleString("en-IN")}.00
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="space-y-4 text-xs">
              <h4 className="text-xs font-display font-extrabold uppercase tracking-wider text-white">
                SHIPPING & BILLING SUMMARY
              </h4>
              <div className="bg-[#12121d] p-5 rounded-2xl space-y-2.5 border border-white/10 font-tech">
                <div>
                  <span className="text-zinc-400">Customer:</span>{" "}
                  <strong className="text-white font-bold">{order.customerName}</strong>
                </div>
                <div>
                  <span className="text-zinc-400">WhatsApp Phone:</span>{" "}
                  <strong className="text-white font-mono font-bold">+91 {order.phone}</strong>
                </div>
                <div>
                  <span className="text-zinc-400">Destination:</span>{" "}
                  <span className="text-zinc-200">{order.address}, {order.city}, {order.state} - {order.pincode}</span>
                </div>
                <div className="pt-2.5 border-t border-white/10 flex justify-between font-mono">
                  <span className="text-zinc-400">Total Paid ({order.paymentMethod}):</span>
                  <span className="text-white font-black text-sm">
                    Rs. {Number(order.total).toLocaleString("en-IN")}.00
                  </span>
                </div>
              </div>

              {/* Action Buttons: Download Receipt & WhatsApp Help */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => printOrderReceipt(order)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black py-3 rounded-xl font-tech font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/20 cursor-pointer"
                >
                  <Download size={15} />
                  <span>DOWNLOAD RECEIPT</span>
                </button>

                <a
                  href={`https://wa.me/919876543210?text=Hi%20THVIZN,%20inquiry%20regarding%20Order%20%23${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-xl font-tech font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle size={15} />
                  <span>WHATSAPP HELP</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto py-20 text-center text-zinc-400">Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
