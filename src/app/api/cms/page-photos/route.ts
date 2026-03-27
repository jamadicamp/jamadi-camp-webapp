import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db";
import PagePhoto from "@/lib/models/PagePhoto";

async function verifyAuth(request: Request) {
  const authHeader = request.headers.get("authorization");
  let token = authHeader?.replace("Bearer ", "");
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  }
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user || !["admin", "manager"].includes(user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const photos = await PagePhoto.find({}).lean();
  return NextResponse.json(photos);
}

export async function PUT(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user || !["admin", "manager"].includes(user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { pageSlug, slot, url, publicId } = await request.json();
  if (!pageSlug || !slot || !url || !publicId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await connectDB();
  const photo = await PagePhoto.findOneAndUpdate(
    { pageSlug, slot },
    { pageSlug, slot, url, publicId },
    { upsert: true, new: true }
  );
  return NextResponse.json(photo);
}
