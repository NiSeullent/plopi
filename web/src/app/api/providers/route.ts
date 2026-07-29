import { NextResponse } from "next/server";
import { providers } from "@/data/providers";

export async function GET() {
  return NextResponse.json({ providers });
}
