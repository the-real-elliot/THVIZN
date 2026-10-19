"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "919876543210"; // Store owner's WhatsApp number
  const message = encodeURIComponent("Hi THVIZN, I want to inquire about your streetwear drops & orders.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <aside aria-label="Customer Support" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2.5 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer select-none"
      >
        <MessageCircle size={18} className="fill-white text-[#25D366]" />
        <span className="hidden sm:inline">WhatsApp Help</span>
      </a>
    </aside>
  );
}
