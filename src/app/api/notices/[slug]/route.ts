import { NextResponse } from "next/server";
import { getNoticeBySlug } from "@/data/notices";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  const notice = getNoticeBySlug(slug);
  if (!notice) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: notice });
}


