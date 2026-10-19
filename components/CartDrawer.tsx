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
        <div className="w-screen max-w-md bg-white/95 backdrop-blur-2xl border-l border-black/10 shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col text-[#090a10] animate-in slide-in-from-right duration-300 ease-out">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-black/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-black text-lg uppercase tracking-wider text-[#090a10]">
                YOUR BAG
              </span>
              <span className="text-xs font-tech font-bold bg-slate-100 text-slate-700 px-3 py-0.5 rounded-full border border-black/10">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-500 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#f1f5f9] border-b border-black/[0.06] px-5 py-3">
            <div className="text-[12px] font-semibold text-slate-700 mb-1.5 flex items-center justify-between font-mono">
              {amountNeeded > 0 ? (
                <span>
                  Add <strong className="text-[#090a10]">₹{amountNeeded}</strong> more for <strong className="text-emerald-700">FREE Shipping</strong>
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  ✓ FREE Express Shipping Unlocked!
                </span>
              )}
              <span className="text-[10px] text-slate-500">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                  <Tag size={28} />
                </div>
                <h3 className="font-bold text-base text-[#090a10] uppercase tracking-wider mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6 font-mono">
                  Check out the latest heavyweight drops and oversized collections.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#090a10] hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-colors shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-3.5 pb-4 border-b border-black/[0.06]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#f1f5f9] rounded-md overflow-hidden shrink-0 border border-black/10">
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
                        <h4 className="text-xs font-bold text-[#090a10] uppercase tracking-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                        SIZE: <span className="text-[#090a10] font-bold">{item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-[#090a10] font-mono">
                        Rs. {(item.price * item.quantity).toLocaleString("en-IN")}.00
                      </span>
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-black/15 rounded-full text-xs bg-slate-50 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-black transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 font-bold min-w-5 text-center font-mono text-[#090a10]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-black transition-colors"
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
            <div className="border-t border-black/[0.08] p-4 sm:p-5 bg-[#f8fafc] space-y-3">
              {/* Promo Code Form or Applied Coupon Badge */}
              {appliedCoupon ? (
                <div className="bg-white border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between text-xs shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-white bg-[#090a10] px-2 py-0.5 rounded-md text-xs">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-emerald-700 font-bold text-[11px]">
                          {appliedCoupon.title || (appliedCoupon.type === "PERCENT" ? `${appliedCoupon.discountValue}% OFF` : `₹${appliedCoupon.discountValue} FLAT`)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                        {appliedCoupon.description || `₹${appliedDiscount} saved on this order`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-slate-500 hover:text-red-500 text-[10px] font-bold uppercase transition-colors px-2 py-1 underline font-mono cursor-pointer"
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
                      className="flex-1 bg-white border border-black/15 rounded-full px-4 py-2 text-xs text-[#090a10] uppercase focus:outline-none focus:border-black font-mono shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={isValidating}
                      className="bg-[#090a10] hover:bg-black text-white px-5 py-2 text-xs font-bold uppercase rounded-full transition-all disabled:opacity-50 cursor-pointer active:scale-95 shadow-sm"
                    >
                      {isValidating ? "..." : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono font-bold">
                      <AlertCircle size={13} className="shrink-0 text-red-600" />
                      <span>{promoError}</span>
                    </div>
                  )}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#090a10]">Rs. {subtotal.toLocaleString("en-IN")}.00</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ""}</span>
                    <span>-Rs. {discountAmount.toLocaleString("en-IN")}.00</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-[#090a10]">
                    {shippingCharge === 0 ? "FREE" : `Rs. ${shippingCharge}.00`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#090a10] pt-2 border-t border-black/[0.08]">
                  <span>Total Amount</span>
                  <span className="text-[#090a10] font-mono">Rs. {finalTotal.toLocaleString("en-IN")}.00</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href={`/checkout${discountAmount > 0 && appliedCoupon ? `?coupon=${encodeURIComponent(appliedCoupon.code)}&discount=${discountAmount}` : ""}`}
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#090a10] hover:bg-black text-white py-3.5 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={15} />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider pt-1 font-mono">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Razorpay Secured // UPI & Cards Supported</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
