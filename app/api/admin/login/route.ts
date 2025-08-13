import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
  const body = await req.json();
  const password = body?.password as string | undefined;

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Create auth cookie
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: "admin_auth",
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return res;
  } catch {
    return NextResponse.json({ success: false, message: "Bad request" }, { status: 400 });
  }
}
