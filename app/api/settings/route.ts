import { NextResponse } from "next/server";
import { getStoreSettings, updateStoreSettings } from "@/lib/db";

export async function GET() {
  try {
    const settings = getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updated = updateStoreSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return PATCH(request);
}
