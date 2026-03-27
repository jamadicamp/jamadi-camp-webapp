import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PagePhoto from "@/lib/models/PagePhoto";

export async function GET() {
  await connectDB();
  const photos = await PagePhoto.find({}).lean();
  return NextResponse.json(photos);
}
