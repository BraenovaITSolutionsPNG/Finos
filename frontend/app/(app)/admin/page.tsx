"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminStats {
  tenants: number;
  users: number;
  invoices: number;
  bills: number;
  journal_entries: number;
}

export default function AdminPage() {
  const { user } = useAuth();
  const stats = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get("/admin/stats")).data,
  });
  const tenants = useQuery<{ id: number; name: string }[]>({
    queryKey: ["admin-tenants"],
    queryFn: async () => (await api.get("/admin/tenants")).data,
  });
  const users = useQuery<{ id: number; name: string; email: string; is_admin: boolean }[]>({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/admin/users")).data,
  });

  if (!user?.is_admin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Platform</h1>
        <p className="text-sm text-muted-foreground">
          You do not have access to the platform admin area.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Platform</h1>
        <p className="text-sm text-muted-foreground">
          Cross-tenant platform oversight.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Stat label="Tenants" value={stats.data?.tenants} />
        <Stat label="Users" value={stats.data?.users} />
        <Stat label="Invoices" value={stats.data?.invoices} />
        <Stat label="Bills" value={stats.data?.bills} />
        <Stat label="Journal" value={stats.data?.journal_entries} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm">
              {(tenants.data ?? []).map((t) => (
                <li key={t.id} className="border-b py-2">
                  {t.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm">
              {(users.data ?? []).map((u) => (
                <li key={u.id} className="border-b py-2">
                  {u.name} {u.is_admin ? "(admin)" : ""} — {u.email}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-2xl font-bold">{value ?? "—"}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
