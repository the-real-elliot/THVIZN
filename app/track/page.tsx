"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Order } from "@/lib/types";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowRight, Download, MessageCircle } from "lucide-react";
import { printOrderReceipt } from "@/lib/receipt";
import Scroll3DText from "@/components/Scroll3DText";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceOrders, setDeviceOrders] = useState<Order[]>([]);

  // Load orders stored on this client's phone/device only
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = JSON.parse(localStorage.getItem("thvizn_my_orders") || "[]");
        if (Array.isArray(stored) && stored.length > 0) {
          setDeviceOrders(stored);
          if (!initialId) {
            setOrder(stored[0]);
            setQuery(stored[0].orderNumber);
          }
        }
      } catch (e) {
        console.error("Failed to read orders from device", e);
      }
    }
  }, [initialId]);

  const searchOrder = async (searchId: string) => {
    if (!searchId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchId.trim())}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        // Sync latest status to device storage if it exists there
        if (typeof window !== "undefined" && window.localStorage) {
          try {
            const stored: Order[] = JSON.parse(localStorage.getItem("thvizn_my_orders") || "[]");
            const index = stored.findIndex((o) => o.orderNumber === data.order.orderNumber || o.id === data.order.id);
            if (index >= 0) {
              stored[index] = data.order;
              localStorage.setItem("thvizn_my_orders", JSON.stringify(stored));
              setDeviceOrders(stored);
            }
          } catch (e) {
            console.error(e);
          }
        }
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

  const selectDeviceOrder = (selectedOrder: Order) => {
    setOrder(selectedOrder);
    setQuery(selectedOrder.orderNumber);
    setError(null);
    // Refresh with latest backend status
    searchOrder(selectedOrder.orderNumber);
  };

  const removeDeviceOrder = (orderNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const updated = deviceOrders.filter((o) => o.orderNumber !== orderNumber);
        localStorage.setItem("thvizn_my_orders", JSON.stringify(updated));
        setDeviceOrders(updated);
        if (order?.orderNumber === orderNumber) {
          setOrder(updated.length > 0 ? updated[0] : null);
          setQuery(updated.length > 0 ? updated[0].orderNumber : "");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[75vh] text-[#090a10]">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[#090a10] bg-white/90 border border-black/10 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
          <Truck size={14} className="text-slate-700" />
          <span>REAL-TIME DISPATCH LOGISTICS</span>
        </div>
        <div>
          <Scroll3DText
            as="h1"
            variant="chrome"
            className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight block text-[#090a10]"
          >
            TRACK YOUR THVIZN DROP
          </Scroll3DText>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-bold">
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
            className="flex-1 bg-white border border-black/15 rounded-xl px-4 py-3 text-xs text-[#090a10] placeholder-slate-400 uppercase focus:outline-none focus:border-black font-mono shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#090a10] hover:bg-black text-white px-7 py-3 text-xs font-tech font-extrabold uppercase tracking-wider rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "SEARCHING..." : "TRACK"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2.5 mb-8 font-mono">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Device Orders Section (Only orders placed on this phone/device) */}
      {deviceOrders.length > 0 && (
        <div className="mb-10 bg-white/95 border border-black/10 rounded-[24px] p-5 sm:p-6 shadow-md curved-landscape-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-black/[0.08] gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-[#090a10]">
                YOUR ORDERS ON THIS DEVICE ({deviceOrders.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              STORED PRIVATELY ON THIS PHONE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deviceOrders.map((dOrder) => {
              const isSelected = order?.orderNumber === dOrder.orderNumber;
              return (
                <div
                  key={dOrder.id || dOrder.orderNumber}
                  onClick={() => selectDeviceOrder(dOrder)}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-50 border-black shadow-md ring-2 ring-black/5"
                      : "bg-white border-black/10 hover:border-black/30 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono font-black text-xs text-[#090a10]">
                        #{dOrder.orderNumber}
                      </span>
                      <span className="text-[9px] font-tech font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                        {dOrder.orderStatus || "PLACED"}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 font-tech mb-2">
                      {new Date(dOrder.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>

                    {/* Thumbnails preview */}
                    <div className="flex items-center gap-1.5 mb-3 overflow-hidden">
                      {dOrder.items?.slice(0, 3).map((it, idx) => (
                        <div key={idx} className="relative w-9 h-11 bg-slate-100 rounded-md overflow-hidden border border-black/10 shrink-0">
                          {it.image && (
                            <Image src={it.image} alt={it.name} fill sizes="36px" className="object-cover" />
                          )}
                        </div>
                      ))}
                      {(dOrder.items?.length || 0) > 3 && (
                        <div className="w-9 h-11 bg-slate-100 rounded-md flex items-center justify-center text-[10px] font-mono font-bold text-slate-600 border border-black/10">
                          +{(dOrder.items?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#090a10]">
                      Rs. {Number(dOrder.total).toLocaleString("en-IN")}
                    </span>
                    <span className={`text-[10px] font-tech font-bold uppercase ${isSelected ? "text-black underline font-black" : "text-slate-500"}`}>
                      {isSelected ? "VIEWING" : "TRACK DROP →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order && (
        <div className="bg-white/95 border border-black/10 rounded-[28px] shadow-lg overflow-hidden space-y-6 curved-landscape-card">
          {/* Header Banner */}
          <div className="bg-[#f1f5f9] text-[#090a10] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08]">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                ORDER NUMBER
              </span>
              <h2 className="text-xl sm:text-2xl font-mono font-black text-[#090a10] mt-0.5">
                #{order.orderNumber}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-tech">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span className="inline-block bg-[#090a10] text-white text-[11px] font-tech font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                STATUS: {order.orderStatus}
              </span>
              {order.courierName && (
                <div className="text-xs text-slate-700 font-tech font-bold flex items-center gap-1.5">
                  <span>Courier: {order.courierName}</span>
                </div>
              )}
              {order.trackingId && (
                <div className="text-xs text-slate-600 font-mono">
                  AWB Tracking: <strong className="text-[#090a10]">{order.trackingId}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Visual Milestone Stepper */}
          <div className="px-6 sm:px-8 py-4">
            <h3 className="text-xs font-display font-extrabold uppercase tracking-wider text-[#090a10] mb-6">
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
                          ? "bg-emerald-600 text-white shadow-md"
                          : status === "active"
                          ? "bg-[#090a10] text-white ring-4 ring-black/10 shadow-md"
                          : "bg-slate-100 text-slate-400 border border-black/10"
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
                    <span className="text-xs font-display font-extrabold uppercase tracking-tight text-[#090a10]">
                      {step.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-tech mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Shipping Address Details */}
          <div className="p-6 sm:p-8 border-t border-black/[0.08] grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Items */}
            <div className="space-y-4">
              <h4 className="text-xs font-display font-extrabold uppercase tracking-wider text-[#090a10]">
                ITEMS IN THIS SHIPMENT
              </h4>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 text-xs border-b border-black/[0.06] pb-3">
                    <div className="relative w-12 h-14 bg-[#f0f4f9] rounded-lg overflow-hidden shrink-0 border border-black/10">
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-[#090a10] uppercase line-clamp-1">{item.name}</div>
                      <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                        Size: {item.size} • Qty: {item.quantity}
                      </div>
                      <div className="font-mono font-black text-[#090a10] mt-1">
                        Rs. {(item.price * item.quantity).toLocaleString("en-IN")}.00
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="space-y-4 text-xs">
              <h4 className="text-xs font-display font-extrabold uppercase tracking-wider text-[#090a10]">
                SHIPPING & BILLING SUMMARY
              </h4>
              <div className="bg-slate-50 p-5 rounded-2xl space-y-2.5 border border-black/10 font-tech">
                <div>
                  <span className="text-slate-500">Customer:</span>{" "}
                  <strong className="text-[#090a10] font-bold">{order.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">WhatsApp Phone:</span>{" "}
                  <strong className="text-[#090a10] font-mono font-bold">+91 {order.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Destination:</span>{" "}
                  <span className="text-slate-700">{order.address}, {order.city}, {order.state} - {order.pincode}</span>
                </div>
                <div className="pt-2.5 border-t border-black/[0.08] flex justify-between font-mono">
                  <span className="text-slate-500">Total Paid ({order.paymentMethod}):</span>
                  <span className="text-[#090a10] font-black text-sm">
                    Rs. {Number(order.total).toLocaleString("en-IN")}.00
                  </span>
                </div>
              </div>

              {/* Action Buttons: Download Receipt & WhatsApp Help */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => printOrderReceipt(order)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#090a10] hover:bg-black text-white py-3 rounded-xl font-tech font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                >
                  <Download size={15} />
                  <span>DOWNLOAD RECEIPT</span>
                </button>

                <a
                  href={`https://wa.me/919876543210?text=Hi%20THVIZN,%20inquiry%20regarding%20Order%20%23${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-xl font-tech font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md"
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
    <Suspense fallback={<div className="max-w-xl mx-auto py-20 text-center text-slate-500">Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
