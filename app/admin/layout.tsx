export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is enforced via middleware; avoid redirects here to prevent loops on /admin/login
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
