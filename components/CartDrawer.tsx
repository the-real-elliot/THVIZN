"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Coupon } from "@/lib/types";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, CheckCircle2, AlertCircle } from "lucide-react";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 999;
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    setIsValidating(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, subtotal })
      });
      const data = await res.json();
      if (data.valid || data.success) {
        setAppliedDiscount(data.discount);
        setAppliedCoupon(data.coupon || {
          id: `temp-${cleanCode}`,
          code: cleanCode,
          title: "Promo Discount",
          description: data.message,
          type: "FLAT",
          discountValue: data.discount,
          minOrderAmount: 0,
          isActive: true,
          usageCount: 0,
          createdAt: new Date().toISOString()
        });
        setPromoSuccess(data.message || `Coupon ${cleanCode} applied!`);
        setPromoError("");
      } else {
        setAppliedDiscount(0);
        setAppliedCoupon(null);
        setPromoError(data.message || `Coupon "${cleanCode}" is invalid`);
      }
    } catch {
      if (cleanCode === "TVZ10") {
        const disc = Math.round((subtotal * 10) / 100);
        setAppliedDiscount(disc);
        setAppliedCoupon({
          id: "coup-1",
          code: "TVZ10",
          title: "10% Streetwear Discount",
          description: "10% off on all streetwear orders above ₹999",
          type: "PERCENT",
          discountValue: 10,
          minOrderAmount: 999,
          isActive: true,
          usageCount: 0,
          createdAt: new Date().toISOString()
        });
        setPromoSuccess("10% Streetwear Discount Applied!");
      } else {
        setAppliedDiscount(0);
        setAppliedCoupon(null);
        setPromoError("Invalid code. Try TVZ10");
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setAppliedDiscount(0);
    setPromoSuccess("");
    setPromoError("");
    setPromoCode("");
  };

  const discountAmount = appliedDiscount;
  const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingCharge;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with smooth blur fade */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#08080d]/92 backdrop-blur-2xl border-l border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col text-[#f4f4f6] animate-in slide-in-from-right duration-300 ease-out">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-black text-lg uppercase tracking-wider text-white">
                YOUR BAG
              </span>
              <span className="text-xs font-tech font-bold bg-white/[0.05] text-zinc-300 px-3 py-0.5 rounded-full border border-white/10">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#0d0d14] border-b border-[#181824] px-5 py-3">
            <div className="text-[12px] font-semibold text-zinc-300 mb-1.5 flex items-center justify-between font-mono">
              {amountNeeded > 0 ? (
                <span>
                  Add <strong className="text-white">₹{amountNeeded}</strong> more for <strong className="text-emerald-400">FREE Shipping</strong>
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ✓ FREE Express Shipping Unlocked!
                </span>
              )}
              <span className="text-[10px] text-zinc-500">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full bg-[#181824] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-[#12121a] rounded-full flex items-center justify-center mb-3 text-zinc-500">
                  <Tag size={28} />
                </div>
                <h3 className="font-bold text-base text-white uppercase tracking-wider mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mb-6 font-mono">
                  Check out the latest heavyweight drops and oversized collections.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xs transition-colors shadow-lg"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-3.5 pb-4 border-b border-[#161622]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#12121a] rounded-md overflow-hidden shrink-0 border border-[#20202e]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                        SIZE: <span className="text-zinc-200 font-bold">{item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-white font-mono">
                        Rs. {(item.price * item.quantity).toLocaleString("en-IN")}.00
                      </span>
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#222234] rounded-full text-xs bg-[#101018] px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-1 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 font-bold min-w-5 text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-1 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="border-t border-[#181824] p-4 sm:p-5 bg-[#0b0b12] space-y-3">
              {/* Promo Code Form or Applied Coupon Badge */}
              {appliedCoupon ? (
                <div className="bg-[#101018] border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-white bg-black/80 px-2 py-0.5 rounded-md border border-white/10 text-xs">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-emerald-400 font-bold text-[11px]">
                          {appliedCoupon.title || (appliedCoupon.type === "PERCENT" ? `${appliedCoupon.discountValue}% OFF` : `₹${appliedCoupon.discountValue} FLAT`)}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                        {appliedCoupon.description || `₹${appliedDiscount} saved on this order`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-zinc-400 hover:text-red-400 text-[10px] font-bold uppercase transition-colors px-2 py-1 underline font-mono cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={applyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (Try TVZ10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#12121c] border border-[#222234] rounded-full px-4 py-2 text-xs text-white uppercase focus:outline-none focus:border-zinc-400 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={isValidating}
                      className="bg-white hover:bg-zinc-200 text-black px-5 py-2 text-xs font-bold uppercase rounded-full transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                    >
                      {isValidating ? "..." : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-[11px] font-mono font-bold">
                      <AlertCircle size={13} className="shrink-0 text-red-400" />
                      <span>{promoError}</span>
                    </div>
                  )}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-1 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">Rs. {subtotal.toLocaleString("en-IN")}.00</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ""}</span>
                    <span>-Rs. {discountAmount.toLocaleString("en-IN")}.00</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-white">
                    {shippingCharge === 0 ? "FREE" : `Rs. ${shippingCharge}.00`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#181824]">
                  <span>Total Amount</span>
                  <span className="text-white font-mono">Rs. {finalTotal.toLocaleString("en-IN")}.00</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href={`/checkout${discountAmount > 0 && appliedCoupon ? `?coupon=${encodeURIComponent(appliedCoupon.code)}&discount=${discountAmount}` : ""}`}
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#ff1a2a] hover:bg-red-600 text-white py-3.5 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,26,42,0.35)] transition-all hover:scale-[1.01] active:scale-95"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={15} />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider pt-1 font-mono">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Razorpay Secured // UPI & Cards Supported</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
