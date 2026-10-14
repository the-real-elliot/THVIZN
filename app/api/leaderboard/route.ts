import { NextResponse } from "next/server";
import { TOP_CUSTOMERS } from "@/lib/products-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    leaderboard: TOP_CUSTOMERS,
    criteria: "Total drops and spend verified across India",
    updatedAt: new Date().toISOString(),
  });
}
