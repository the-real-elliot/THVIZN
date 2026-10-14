"use client";

import React from "react";

interface Scroll3DTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  variant?: "chrome" | "editorial" | "subtle" | "plain";
  className?: string;
  delayMs?: number;
}

/**
 * Clean & High-Contrast Typography Component
 * Restored to clean, instant, legible typography without invisible-text bugs or janky scroll lag.
 */
export default function Scroll3DText({
  children,
  as: Component = "h2",
  variant = "editorial",
  className = "",
}: Scroll3DTextProps) {
  const variantClass =
    variant === "chrome"
      ? "text-3d-chrome"
      : variant === "editorial"
      ? "text-3d-editorial"
      : variant === "subtle"
      ? "text-3d-subtle"
      : "";

  return (
    <Component className={`block opacity-100 ${variantClass} ${className}`}>
      {children}
    </Component>
  );
}
