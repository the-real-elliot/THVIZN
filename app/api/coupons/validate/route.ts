import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) {
      return NextResponse.json({ success: false, valid: false, discount: 0, message: "Coupon code is required" }, { status: 400 });
    }
    const result = validateCoupon(code, Number(subtotal) || 0);
    return NextResponse.json({
      success: result.valid,
      valid: result.valid,
      ...result
    });
  } catch {
    return NextResponse.json({ success: false, valid: false, discount: 0, message: "Validation error" }, { status: 500 });
  }
}
