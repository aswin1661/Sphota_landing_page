import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("admin_auth");
    
    const isAuthenticated = authCookie?.value === "authenticated";
    
    return NextResponse.json({ 
      authenticated: isAuthenticated 
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ 
      authenticated: false 
    });
  }
}
