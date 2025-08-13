"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function doLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    startTransition(() => router.replace("/admin/login"));
  }

  return (
    <Button className="text-black hover:bg-red-600" variant="outline" onClick={doLogout} disabled={isPending}>
      {isPending ? "Logging out…" : "Logout"}
    </Button>
  );
}
