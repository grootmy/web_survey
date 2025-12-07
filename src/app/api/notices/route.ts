import { NextResponse } from "next/server";
import { getNotices } from "@/data/notices";

export async function GET() {
  const items = getNotices();
  return NextResponse.json({ success: true, data: items });
}


