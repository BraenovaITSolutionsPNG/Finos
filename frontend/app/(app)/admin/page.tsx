"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminStats {
  tenants_total: number;
  tenants_active: number;
  users_total: number;
  subscriptions_total: number;
}

interface TenantItem {
  id: number;
  name: string;
  slug: string;
  status: string;
  members: number;
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export default function AdminPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const stats = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get("/admin/stats")).data,
  });

  const tenants = useQuery<TenantItem[]>({
    queryKey: ["admin-tenants"],
    queryFn: async () => {
      const res = await api.get("/admin/tenants");
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });

  const users = useQuery<UserItem[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });

  const toggleTenant = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: "suspend" | "activate" }) =>
      (await api.post(`/admin/tenants/${id}/${action}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tenants"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
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
        <h1 className="text-2xl font-bold">Platform Administration</h1>
        <p className="text-sm text-muted-foreground">
          Cross-tenant system oversight and account management.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total Organizations" value={stats.data?.tenants_total} />
        <Stat label="Active Organizations" value={stats.data?.tenants_active} />
        <Stat label="Total Users" value={stats.data?.users_total} />
        <Stat label="Active Subscriptions" value={stats.data?.subscriptions_total} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organizations ({tenants.data?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {(tenants.data ?? []).map((t) => (
                <li key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.slug} · {t.members} members</p>
                  </div>
                  <Button
                    size="sm"
                    variant={t.status === "suspended" ? "default" : "outline"}
                    onClick={() =>
                      toggleTenant.mutate({
                        id: t.id,
                        action: t.status === "suspended" ? "activate" : "suspend",
                      })
                    }
                  >
                    {t.status === "suspended" ? "Activate" : "Suspend"}
                  </Button>
                </li>
              ))}
              {(tenants.data ?? []).length === 0 && (
                <li className="py-4 text-muted-foreground text-center">No organizations.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users ({users.data?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {(users.data ?? []).map((u) => (
                <li key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  {u.is_admin && (
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600">
                      Platform Admin
                    </span>
                  )}
                </li>
              ))}
              {(users.data ?? []).length === 0 && (
                <li className="py-4 text-muted-foreground text-center">No users found.</li>
              )}
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
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
      </CardContent>
    </Card>
  );
}
