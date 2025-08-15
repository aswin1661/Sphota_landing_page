"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function doLogout() {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        // Clear any client-side state before redirect
        startTransition(() => {
          router.replace("/admin/login");
          router.refresh(); // Force a fresh load
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect on error to prevent stuck state
      startTransition(() => router.replace("/admin/login"));
    }
  }

  return (
    <Button 
      className="text-black hover:bg-red-600 transition-colors" 
      variant="outline" 
      onClick={doLogout} 
      disabled={isPending}
      size="sm"
    >
      {isPending ? "Logging out…" : "Logout"}
    </Button>
  );
}
