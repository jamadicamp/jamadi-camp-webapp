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
  try {
    await connectDB();
    const photos = await PagePhoto.find({}).lean();
    return NextResponse.json(photos);
  } catch (err) {
    console.error("[page-photos GET] DB error:", err);
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user || !["admin", "manager"].includes(user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { pageSlug?: string; slot?: string; url?: string; publicId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { pageSlug, slot, url, publicId } = body;
  if (!pageSlug || !slot || !url || !publicId) {
    return NextResponse.json(
      { error: `Missing fields: ${[!pageSlug && "pageSlug", !slot && "slot", !url && "url", !publicId && "publicId"].filter(Boolean).join(", ")}` },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const photo = await PagePhoto.findOneAndUpdate(
      { pageSlug, slot },
      { $set: { url, publicId } },
      { upsert: true, new: true }
    );
    return NextResponse.json(photo);
  } catch (err) {
    console.error("[page-photos PUT] DB error:", err);
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
