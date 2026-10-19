"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Coupon } from "@/lib/types";
import Scroll3DText from "@/components/Scroll3DText";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  CreditCard,
  Banknote,
  QrCode,
  Download,
  AlertCircle,
  Tag
} from "lucide-react";

import { printOrderReceipt } from "@/lib/receipt";


function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialParamDiscount = searchParams.get("discount");
  const initialParamCoupon = searchParams.get("coupon") || (initialParamDiscount ? "TVZ10" : "");

  const { cart, subtotal, clearCart } = useCart();

  // Coupon state
  const [couponCode, setCouponCode] = useState(initialParamCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(
    initialParamDiscount ? Math.round(Number(initialParamDiscount)) : 0
  );
  const [couponMsg, setCouponMsg] = useState(
    initialParamDiscount ? "Coupon Applied" : ""
  );
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    if (initialParamCoupon && subtotal > 0) {
      fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: initialParamCoupon, subtotal })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid || data.success) {
            setAppliedCoupon(data.coupon);
            setDiscountAmount(data.discount);
            setCouponMsg(data.message || `Coupon ${initialParamCoupon} applied!`);
          }
        })
        .catch(() => {});
    }
  }, [initialParamCoupon, subtotal]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY_UPI">("RAZORPAY_UPI");
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);

  const shippingCharge = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const codFee = 0;
  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingCharge;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;
    setValidatingCoupon(true);
    setCouponError("");
    setCouponMsg("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, subtotal })
      });
      const data = await res.json();
      if (data.valid || data.success) {
        setAppliedCoupon(data.coupon || { code: cleanCode, discountValue: data.discount, type: "FLAT" } as any);
        setDiscountAmount(data.discount);
        setCouponMsg(data.message || `Coupon ${cleanCode} applied!`);
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponError(data.message || `Coupon "${cleanCode}" is invalid`);
      }
    } catch {
      if (cleanCode === "TVZ10") {
        const disc = Math.round((subtotal * 10) / 100);
        setDiscountAmount(disc);
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
        setCouponMsg("10% Streetwear Discount Applied!");
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponError(`Coupon "${cleanCode}" is invalid`);
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMsg("");
    setCouponError("");
    setCouponCode("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      alert("Please fill in all shipping details.");
      return;
    }

    if (formData.phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number for WhatsApp updates.");
      return;
    }

    if (paymentMethod === "RAZORPAY_UPI") {
      setRazorpayModalOpen(true);
    } else {
      submitOrder("PENDING");
    }
  };

  const submitOrder = async (paymentStatus: "PAID" | "PENDING") => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          items: cart.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            size: i.size,
            quantity: i.quantity,
            image: i.image,
          })),
          subtotal,
          discount: discountAmount,
          shipping: shippingCharge + codFee,
          total: finalTotal,
          paymentMethod,
          paymentStatus,
          orderStatus: "PLACED",
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        setOrderComplete(data.order);
        setRazorpayModalOpen(false);

        // Store this order on the client's phone/device only
        if (typeof window !== "undefined" && window.localStorage) {
          try {
            const savedOrders = JSON.parse(localStorage.getItem("thvizn_my_orders") || "[]");
            const updatedOrders = [data.order, ...savedOrders.filter((o: any) => o.id !== data.order.id && o.orderNumber !== data.order.orderNumber)];
            localStorage.setItem("thvizn_my_orders", JSON.stringify(updatedOrders));
            localStorage.setItem("thvizn_customer_phone", data.order.phone || "");
          } catch (e) {
            console.error("Failed to save order to local storage", e);
          }
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      } else {
        alert("Error creating order: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit order. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ORDER CONFIRMED VIEW (LIGHT STONE SILVER LUXURY) =================
  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 min-h-[85vh] flex flex-col justify-center items-center">
        <div className="w-full bg-white/95 border border-black/10 rounded-[28px] p-6 sm:p-8 shadow-lg text-center text-[#090a10] relative overflow-hidden curved-landscape-card">
          {/* Top Success Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 size={36} />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-black/10 text-[#090a10] text-[11px] font-bold uppercase px-3.5 py-1 rounded-full mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>ORDER CONFIRMED // VERIFIED</span>
          </div>

          <div>
            <Scroll3DText
              as="h1"
              variant="chrome"
              className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight block mb-2 text-[#090a10]"
            >
              THANK YOU FOR YOUR DROP!
            </Scroll3DText>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mb-6 font-tech leading-relaxed max-w-lg mx-auto">
            Your official drop order number is{" "}
            <strong className="text-[#090a10] font-mono font-extrabold text-sm sm:text-base bg-slate-100 px-2.5 py-1 rounded-md border border-black/10 inline-block my-1">
              #{orderComplete.orderNumber}
            </strong>
            . A confirmation receipt and live courier dispatch link will be sent to WhatsApp (+91 {orderComplete.phone}).
          </p>

          {/* Itemized Order Breakdown */}
          <div className="bg-slate-50 border border-black/10 rounded-2xl p-5 sm:p-6 text-left text-xs space-y-4 mb-7 shadow-inner">
            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
              <span className="text-slate-500 font-tech font-bold uppercase tracking-wider text-[11px]">
                PAYMENT METHOD
              </span>
              <span className="font-bold text-[#090a10] font-mono">
                {orderComplete.paymentMethod === "RAZORPAY_UPI" ? "Razorpay Prepaid (UPI / Cards)" : "Razorpay Prepaid"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
              <span className="text-slate-500 font-tech font-bold uppercase tracking-wider text-[11px]">
                TOTAL PAYABLE
              </span>
              <span className="text-lg sm:text-xl text-[#090a10] font-mono font-black">
                ₹{Number(orderComplete.total).toLocaleString("en-IN")}.00
              </span>
            </div>

            {orderComplete.items && orderComplete.items.length > 0 && (
              <div className="border-b border-black/[0.08] pb-3 space-y-2">
                <span className="text-slate-500 font-tech font-bold uppercase tracking-wider text-[11px] block">
                  ORDERED SPECIMENS
                </span>
                {orderComplete.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-10 bg-[#f0f4f9] rounded overflow-hidden shrink-0 border border-black/10">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill sizes="32px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-[#090a10] block">{item.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          SIZE: {item.size} • QTY: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[#090a10] font-bold">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-slate-700 font-mono text-[11px] pt-1 leading-relaxed">
              <strong className="text-[#090a10] uppercase font-tech text-xs block mb-1">
                DELIVERY DESTINATION:
              </strong>
              {orderComplete.customerName} • {orderComplete.address}, {orderComplete.city}, {orderComplete.state} - {orderComplete.pincode}
            </div>
          </div>

          {/* Phone / Device Isolation Notice */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl px-4 py-2.5 text-[11px] font-mono mb-6 text-left shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <span>SAVED TO THIS DEVICE: You can track this shipment anytime from &quot;My Orders&quot; on your phone without entering an ID.</span>
          </div>

          {/* Action CTAs: Download Receipt, Track Order, Continue Shopping */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {/* 1. Download Receipt Button */}
            <button
              onClick={() => printOrderReceipt(orderComplete)}
              className="w-full sm:w-auto bg-[#090a10] hover:bg-black text-white px-6 py-3.5 rounded-full text-xs font-tech font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <Download size={15} />
              <span>DOWNLOAD RECEIPT</span>
            </button>

            {/* 2. Track Order Button */}
            <Link
              href={`/track?id=${orderComplete.orderNumber}`}
              className="w-full sm:w-auto bg-[#090a10] hover:bg-black text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <Truck size={15} />
              <span>TRACK MY ORDER</span>
            </Link>

            {/* 3. Continue Shopping */}
            <Link
              href="/shop"
              className="w-full sm:w-auto border border-black/20 hover:border-black text-[#090a10] px-6 py-3.5 rounded-full text-xs font-tech font-bold uppercase tracking-wider flex items-center justify-center transition-all bg-white hover:bg-slate-50 shadow-sm"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= EMPTY CART VIEW =================
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center text-[#090a10] min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-black/10 flex items-center justify-center text-slate-400 mb-4">
          <Tag size={28} />
        </div>
        <h2 className="text-2xl font-display font-black uppercase tracking-tight text-[#090a10] mb-2">
          YOUR BAG IS EMPTY
        </h2>
        <p className="text-xs text-slate-500 mb-6 font-medium max-w-xs">
          Explore the heavyweight streetwear specimens in our catalogue before checkout.
        </p>
        <Link
          href="/shop"
          className="bg-[#090a10] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-tech font-extrabold uppercase tracking-wider shadow-md transition-all hover:scale-105"
        >
          RETURN TO STORE
        </Link>
      </div>
    );
  }

  // ================= ACTIVE CHECKOUT FORM VIEW =================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#090a10]">
      {/* Checkout Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/[0.08]">
        <Link
          href="/shop"
          className="flex items-center gap-2 text-xs font-tech font-bold text-slate-600 hover:text-black uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} />
          <span>BACK TO STORE</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-tech font-bold text-slate-600">
          <Lock size={13} className="text-emerald-600" />
          <span>256-BIT ENCRYPTED CHECKOUT</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Customer & Address Form */}
        <div className="lg:col-span-7 space-y-6">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Step 1: Customer Info */}
            <div className="bg-white/95 p-6 sm:p-7 border border-black/10 rounded-2xl sm:rounded-3xl space-y-4 shadow-sm curved-landscape-card">
              <h2 className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-[#090a10] flex items-center gap-2.5">
                <span className="w-5 h-5 bg-[#090a10] text-white rounded-full flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>CUSTOMER INFORMATION</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-tech font-bold text-slate-700 uppercase mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-[#090a10] placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-tech font-bold text-slate-700 uppercase mb-1.5">
                    WhatsApp Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="bg-slate-100 text-slate-700 px-3 py-2.5 text-xs border border-r-0 border-black/15 rounded-l-xl font-bold font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      name="phone"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-black/15 rounded-r-xl px-3.5 py-2.5 text-xs text-[#090a10] placeholder-slate-400 font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                    Order confirmation & live tracking sent via WhatsApp
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-tech font-bold text-slate-700 uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com (Optional)"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-[#090a10] placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-white/95 p-6 sm:p-7 border border-black/10 rounded-2xl sm:rounded-3xl space-y-4 shadow-sm curved-landscape-card">
              <h2 className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-[#090a10] flex items-center gap-2.5">
                <span className="w-5 h-5 bg-[#090a10] text-white rounded-full flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                <span>DELIVERY ADDRESS</span>
              </h2>

              <div>
                <label className="block text-[11px] font-tech font-bold text-slate-700 uppercase mb-1.5">
                  House / Flat / Street Address *
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="e.g. Flat 302, Palm Heights, Indiranagar"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-[#090a10] placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-tech font-bold text-slate-700 uppercase mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-[#090a10] placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-tech font-bold text-slate-700 uppercase mb-1.5">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-[#090a10] focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  >
                    {[
                      "Maharashtra", "Delhi", "Karnataka", "Haryana", "Telangana", "Tamil Nadu",
                      "Gujarat", "Uttar Pradesh", "West Bengal", "Punjab", "Rajasthan", "Kerala"
                    ].map((st) => (
                      <option key={st} value={st} className="bg-white text-[#090a10]">{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-tech font-bold text-slate-700 uppercase mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    name="pincode"
                    placeholder="6 Digits"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-[#090a10] placeholder-slate-400 font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Options */}
            <div className="bg-white/95 p-6 sm:p-7 border border-black/10 rounded-2xl sm:rounded-3xl space-y-4 shadow-sm curved-landscape-card">
              <h2 className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-[#090a10] flex items-center gap-2.5">
                <span className="w-5 h-5 bg-[#090a10] text-white rounded-full flex items-center justify-center text-[10px] font-black">
                  3
                </span>
                <span>PAYMENT METHOD</span>
              </h2>

              <div className="space-y-3">
                {/* Razorpay Dedicated Payment Card */}
                <div className="p-4 sm:p-5 border border-black/15 bg-slate-50 rounded-2xl flex items-start justify-between shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#090a10] flex items-center justify-center text-white text-[10px] font-black shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#090a10] font-tech">
                        <span>Razorpay Official Gateway</span>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] px-2.5 py-0.5 rounded-full font-black">
                          100% PREPAID
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-body">
                        Instant UPI (Google Pay, PhonePe, Paytm, QR), Credit & Debit Cards, NetBanking.
                      </p>
                    </div>
                  </div>
                  <CreditCard size={20} className="text-[#090a10] shrink-0" />
                </div>

                {/* COD Disabled Notice */}
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-100 border border-black/10 text-[11px] text-slate-600 font-tech">
                  <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
                  <span>Cash on Delivery is unavailable. All drops are strictly prepaid for zero-delay express courier dispatch.</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#090a10] hover:bg-black disabled:opacity-50 text-white font-extrabold text-sm uppercase tracking-widest py-4 rounded-full shadow-md transition-all cursor-pointer hover:scale-[1.01]"
            >
              {loading
                ? "PROCESSING ORDER..."
                : `PAY ₹${finalTotal.toLocaleString("en-IN")} VIA RAZORPAY`}
            </button>

          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/95 border border-black/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm curved-landscape-card">
            <h2 className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-[#090a10] border-b border-black/[0.08] pb-3 flex items-center justify-between">
              <span>ORDER SUMMARY</span>
              <span className="text-xs font-mono text-slate-500">
                {cart.reduce((s, i) => s + i.quantity, 0)} ITEMS
              </span>
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-3 text-xs border-b border-black/[0.06] pb-3"
                >
                  <div className="relative w-14 h-16 bg-[#f0f4f9] rounded-xl overflow-hidden shrink-0 border border-black/10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-[#090a10] uppercase line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                        SIZE: <span className="text-[#090a10]">{item.size}</span> • QTY: {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold text-[#090a10] font-mono">
                      Rs. {(item.price * item.quantity).toLocaleString("en-IN")}.00
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input or Applied Coupon Badge */}
            {appliedCoupon || discountAmount > 0 ? (
              <div className="pt-3 border-t border-black/[0.08]">
                <div className="bg-slate-50 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-white bg-[#090a10] px-2 py-0.5 rounded-sm text-xs">
                          {appliedCoupon?.code || couponCode}
                        </span>
                        <span className="text-emerald-700 font-bold text-xs">
                          {appliedCoupon?.title || "Coupon Applied"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        {appliedCoupon?.description || `₹${discountAmount} discount saved`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-slate-500 hover:text-red-500 text-[11px] font-bold uppercase transition-colors px-2 py-1 underline font-mono cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-black/[0.08]">
                <label className="block text-[11px] font-tech font-bold uppercase text-slate-700 mb-1.5">
                  PROMO CODE / DROP COUPON
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. TVZ10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 border border-black/15 rounded-xl px-3.5 py-2 text-xs text-[#090a10] uppercase font-mono font-bold focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="bg-[#090a10] hover:bg-black text-white px-4 py-2 text-xs font-tech font-bold uppercase rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {validatingCoupon ? "..." : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold">
                    <AlertCircle size={14} className="shrink-0 text-red-600" />
                    <span>{couponError}</span>
                  </div>
                )}
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs border-t border-black/[0.08] pt-4 text-slate-600 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#090a10]">Rs. {subtotal.toLocaleString("en-IN")}.00</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({appliedCoupon?.code || couponCode})</span>
                  <span>-Rs. {discountAmount.toLocaleString("en-IN")}.00</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span className="font-bold text-[#090a10]">
                  {shippingCharge === 0 ? "FREE" : `Rs. ${shippingCharge}.00`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#090a10] pt-3 border-t border-black/[0.08]">
                <span className="font-display">Total Amount</span>
                <span className="text-[#090a10] font-mono">Rs. {finalTotal.toLocaleString("en-IN")}.00</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl text-[11px] text-slate-600 flex items-center gap-2 border border-black/10 font-tech">
              <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
              <span>Full buyer protection & free exchanges for 7 days.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Interactive Modal Simulation */}
      {razorpayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1626] border border-white/15 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 text-white">
            {/* Razorpay Header */}
            <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-sm">THVIZN Streetwear</h3>
                  <p className="text-[11px] text-blue-200">Gateway ID: rzp_test_thvizn</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-blue-200 uppercase font-mono">Payable</span>
                <div className="text-lg font-black text-white font-mono">₹{finalTotal.toLocaleString("en-IN")}</div>
              </div>
            </div>

            {/* Razorpay Options */}
            <div className="p-6 space-y-4 text-xs">
              <div className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] font-tech">
                SELECT INSTANT UPI APP
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => submitOrder("PAID")}
                  className="p-3 border border-white/10 hover:border-blue-400 rounded-xl flex flex-col items-center gap-1.5 bg-[#141e30] hover:bg-blue-900/30 transition-colors cursor-pointer"
                >
                  <QrCode size={22} className="text-blue-400" />
                  <span className="font-bold text-[11px]">Google Pay / UPI</span>
                </button>
                <button
                  onClick={() => submitOrder("PAID")}
                  className="p-3 border border-white/10 hover:border-purple-400 rounded-xl flex flex-col items-center gap-1.5 bg-[#141e30] hover:bg-purple-900/30 transition-colors cursor-pointer"
                >
                  <QrCode size={22} className="text-purple-400" />
                  <span className="font-bold text-[11px]">PhonePe</span>
                </button>
              </div>

              <div className="p-3 bg-[#121a29] border border-white/10 rounded-xl text-[11px] text-zinc-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Razorpay Safe Instant Gateway</span>
                </div>
                <p className="text-zinc-400">
                  Clicking either button simulates test payment and verifies your order with instant dispatch tracking.
                </p>
              </div>

              <button
                onClick={() => submitOrder("PAID")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
              >
                Simulate Successful Payment (₹{finalTotal.toLocaleString("en-IN")})
              </button>

              <button
                onClick={() => setRazorpayModalOpen(false)}
                className="w-full text-center text-zinc-400 hover:text-white text-xs pt-1 cursor-pointer"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto py-20 text-center text-zinc-400">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
