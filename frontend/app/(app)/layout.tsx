"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationsBell } from "@/components/layout/NotificationsBell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, tenants, tenant, switchTenant } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <div className="p-8 text-muted-foreground">Loading…</div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center gap-4 border-b bg-background px-6 py-3">
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {tenant?.currency} · {tenant?.country ?? "—"}
            </span>
            <NotificationsBell />
            {tenants.length > 0 && (
              <select
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                value={tenant?.id ?? ""}
                onChange={(e) => switchTenant(Number(e.target.value))}
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
