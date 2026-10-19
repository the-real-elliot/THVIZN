# THVIZN — Streetwear E-Commerce Store

**THVIZN** is an aesthetic, high-conversion Gen-Z clothing brand web application built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Razorpay Payments**.

Inspired by India's premier streetwear labels: **The Sagacity**, **Bluorng**, and **Genrage**.

---

## ⚡ Quickstart (1-Click Run)

Just double-click `start.bat` in this folder, or run:

```bash
npm run dev
```

Open your browser at: **[http://localhost:3000](http://localhost:3000)**

---

## 🚀 Key Features Built

### 1. Storefront & Aesthetics
- **Branding**: Featuring THVIZN's signature Red 8-Point Star and Eye Logo.
- **Intro Loader**: Smooth, aesthetic loading sequence with the pulsing Star logo that respects shopping speed.
- **Announcement Ticker**: Free shipping threshold (`Above ₹999`) with promo code `TVZ10` (10% off).
- **Mobile-First Product Grid**: High-density 2-column mobile and 4-column desktop display.
- **Product Cards**: Instant size selector (`S, M, L, XL, XXL`), hover photo swap, and 1-click **Quick Add**.

### 2. Shopping & Cart Flow
- **Slide-out Cart Drawer**: Dynamic free-shipping meter, quantity controls, and instant discount coupon engine.
- **Pincode Delivery Estimator**: Real-time Indian pincode lookup for delivery estimation.
- **Size Chart Guide**: Built-in modal with chest, length, and shoulder specifications.

### 3. Payments & Checkout
- **Razorpay Integration**: Standard UPI (Google Pay, PhonePe, Paytm, QR), Cards, NetBanking with HMAC signature verification.
- **100% Prepaid Protocol**: Exclusively prepaid for zero-delay express courier dispatch (Cash on Delivery disabled for limited drops).
- **Order Confirmation**: Generates unique Order IDs (e.g. `#TVZ-8429`) with printable drop receipt and instant WhatsApp notification links.

### 4. Admin Dashboard (`/admin`)
- **Protected Access**: Default password: `thvizn2026` or `admin`.
- **Live Business Metrics**: Total Revenue, Total Orders count, Average Order Value (AOV), and Active Products.
- **Order Fulfillment Engine**: Update statuses (*Placed → Packed → Shipped → Delivered*) and attach AWB Courier tracking numbers (Shiprocket / Delhivery).
- **Catalogue & Inventory**: Add new streetwear drops, set GSM fabric weight, adjust prices, and toggle in-stock status.

### 5. Order Tracking & Customer Support
- **Live Order Tracker (`/track`)**: Customers can enter their Order ID or WhatsApp Phone number to view live shipment stages.
- **Floating WhatsApp Support**: Direct 1-tap customer service widget on every page.

---

## 🌐 Free Hosting & Domain Guide

1. **Free Hosting**:
   - Push this repo to GitHub and import it on **[Vercel](https://vercel.com)**.
   - Hosting is 100% free with Mumbai edge CDN (`bom1`).
2. **Cheapest Domain (< ₹900 budget cap)**:
   - Buy a `.in` domain on **Spaceship.com** (~₹420/yr) or **Hostinger** (~₹470/yr).
   - In Vercel, go to Settings → Domains → Add your custom domain.
