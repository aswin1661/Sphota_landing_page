import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({ name: "admin_auth", value: "", path: "/", maxAge: 0 });
  return res;
}
