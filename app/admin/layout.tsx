// The admin route is protected by middleware.ts. Keep this layout lightweight so /admin/login remains reachable.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
