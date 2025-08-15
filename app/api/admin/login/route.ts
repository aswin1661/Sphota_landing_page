import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body?.password as string | undefined;

    // Check if password is provided
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: "Password is required" }, 
        { status: 400 }
      );
    }

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    // Trim and validate password
    if (password.trim() !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" }, 
        { status: 401 }
      );
    }

    // Create successful response with auth cookie
    const res = NextResponse.json({ 
      success: true, 
      message: "Login successful" 
    });
    
    res.cookies.set({
      name: "admin_auth",
      value: "authenticated",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return res;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." }, 
      { status: 500 }
    );
  }
}
