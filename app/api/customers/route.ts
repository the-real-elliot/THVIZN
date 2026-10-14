import { NextResponse } from "next/server";
import { getAllCustomers } from "@/lib/db";

export async function GET() {
  const customers = getAllCustomers();
  return NextResponse.json(customers);
}
