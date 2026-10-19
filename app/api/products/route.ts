import { NextResponse } from "next/server";
import { getAllProducts, saveProduct } from "@/lib/db";

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct = saveProduct(body);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to save product";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
