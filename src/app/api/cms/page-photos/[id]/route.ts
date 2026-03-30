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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAuth(request);
  if (!user || !["admin", "manager"].includes(user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await connectDB();
    const deleted = await PagePhoto.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[page-photos DELETE] DB error:", err);
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
