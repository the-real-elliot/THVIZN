import { NextResponse } from "next/server";
import { getAllSupportTickets, createSupportTicket } from "@/lib/db";

export async function GET() {
  const tickets = getAllSupportTickets();
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }
    const ticket = createSupportTicket({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      orderNumber: data.orderNumber || "",
      subject: data.subject || "General Inquiry",
      message: data.message
    });
    return NextResponse.json(ticket, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit support ticket" }, { status: 500 });
  }
}
