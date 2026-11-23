import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import {
  isAdminAuthenticated,
  isAdminDevFallbackEnabled,
} from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Painel de Moderação",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  const devFallbackEnabled = isAdminDevFallbackEnabled();

  return (
    <div className="min-h-[70vh] bg-[#021729] py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {authenticated ? (
          <AdminDashboard />
        ) : (
          <AdminLoginForm devFallbackEnabled={devFallbackEnabled} />
        )}
      </div>
    </div>
  );
}
