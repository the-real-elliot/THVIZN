import { NextResponse } from "next/server";
import { getAllOrders, createOrder } from "@/lib/db";

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = createOrder(body);
    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
