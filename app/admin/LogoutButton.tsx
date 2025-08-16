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
        startTransition(() => {
          router.replace("/admin/login");
          router.refresh();
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
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
