export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page should not have any server-side auth checks
  // to prevent redirect loops. Let the page handle authentication.
  return <>{children}</>;
}
