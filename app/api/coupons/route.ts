import { NextResponse } from "next/server";
import { getAllCoupons, saveCoupon } from "@/lib/db";

export async function GET() {
  const coupons = getAllCoupons();
  return NextResponse.json(coupons);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.code || !data.discountValue) {
      return NextResponse.json({ error: "Code and discount value are required" }, { status: 400 });
    }
    const coupon = saveCoupon(data);
    return NextResponse.json(coupon, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
