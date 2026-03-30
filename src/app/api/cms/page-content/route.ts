import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db";
import PageContent from "@/lib/models/PageContent";

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
    const contents = await PageContent.find({}).lean();
    return NextResponse.json(contents);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user || !["admin", "manager"].includes(user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { pageSlug?: string; title?: string; subtitle?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { pageSlug, title, subtitle, description } = body;
  if (!pageSlug) {
    return NextResponse.json({ error: "Missing pageSlug" }, { status: 400 });
  }
  try {
    await connectDB();
    const doc = await PageContent.findOneAndUpdate(
      { pageSlug },
      { $set: { title, subtitle, description } },
      { upsert: true, new: true }
    );
    return NextResponse.json(doc);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
