import type { Metadata } from "next";
import { AdminDashboard } from "@/components/sections/admin-dashboard";

// No real authentication exists yet (see /login) - this route isn't
// access-controlled. It's a frontend preview of the admin UI, reading real
// catalog data, with no write/persistence wired up. See admin-dashboard.tsx
// for what's real vs. still needed.
export const metadata: Metadata = {
  title: "Paneli i Administrimit | NSH LIRIU",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
