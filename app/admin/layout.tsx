import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("admin_auth");
  
  // Check if we're on the login page to allow access without auth
  // Since we can't access pathname in server components, we'll handle this differently
  
  if (!isAuthed?.value) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
