import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import IntroLoader from "@/components/IntroLoader";
import VolumetricGodRaysCanvas from "@/components/VolumetricGodRaysCanvas";
import MonochromeBackground from "@/components/MonochromeBackground";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "THVIZN | India's Finest Streetwear Brand",
  description: "THVIZN — The Vision. Heavyweight oversized graphic tees, 420 GSM hoodies, and acid-washed streetwear. Made in India.",
  icons: {
    icon: "/images/star-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/star-logo.png" />
        <link rel="preload" href="/fonts/Outfit-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Syne-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Thinoo-Bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Soria-Bold.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#dbe2ed] text-[#090a10] selection:bg-[#090a10] selection:text-white relative">
        <CartProvider>
          {/* Global Animated Monochrome Gradient Background across all pages */}
          <MonochromeBackground />

          {/* Hardware-Accelerated Global Volumetric God Rays & Embers Canvas */}
          <VolumetricGodRaysCanvas />

          <IntroLoader />
          <Navbar />
          <CartDrawer />
          <main className="flex-1 relative z-10 pt-[96px]">
            <PageTransition>{children}</PageTransition>
          </main>
          <WhatsAppButton />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
