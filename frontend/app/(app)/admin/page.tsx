"use client";

import { useState } from "react";
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
import { FileText, Image as ImageIcon, ExternalLink, X } from "lucide-react";

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

interface SubscriptionItem {
  id: number;
  tenant_id: number;
  tenant_name: string;
  plan_id: number;
  plan_name: string;
  plan_price: number;
  payment_method?: string;
  payment_reference?: string;
  payment_receipt_url?: string;
  payment_notes?: string;
  status: "pending" | "active" | "suspended" | "rejected" | string;
  created_at: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [viewScreenshot, setViewScreenshot] = useState<string | null>(null);

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

  const subscriptions = useQuery<SubscriptionItem[]>({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const res = await api.get("/admin/subscriptions");
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });

  const updateSubStatus = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: "approve" | "suspend" | "reject" }) =>
      (await api.post(`/admin/subscriptions/${id}/${action}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
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
          Cross-tenant system oversight, subscription payment verification, and account management.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total Organizations" value={stats.data?.tenants_total} />
        <Stat label="Active Organizations" value={stats.data?.tenants_active} />
        <Stat label="Total Users" value={stats.data?.users_total} />
        <Stat label="Subscriptions Total" value={stats.data?.subscriptions_total} />
      </div>

      {/* Subscription Requests & Payment Proof Verification Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Payment Submissions &amp; Approvals ({subscriptions.data?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2">Organization</th>
                  <th>Plan Requested</th>
                  <th>Payment Method &amp; Ref</th>
                  <th>Payment Proof Screenshot</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(subscriptions.data ?? []).map((sub) => (
                  <tr key={sub.id} className="border-b">
                    <td className="py-3 font-semibold">{sub.tenant_name}</td>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">{sub.plan_name}</p>
                        <p className="text-xs text-muted-foreground">K{sub.plan_price} PGK</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-foreground capitalize">
                          {(sub.payment_method ?? "bank_transfer").replace("_", " ")}
                        </p>
                        <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                          Ref: {sub.payment_reference || "—"}
                        </p>
                      </div>
                    </td>
                    <td>
                      {sub.payment_receipt_url ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewScreenshot(sub.payment_receipt_url!)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                          >
                            <ImageIcon className="h-3.5 w-3.5" /> View Screenshot
                          </button>
                          <a
                            href={sub.payment_receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                            title="Open in new tab"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No receipt attached</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          sub.status === "active"
                            ? "bg-green-500/10 text-green-600"
                            : sub.status === "pending"
                            ? "bg-amber-500/10 text-amber-600"
                            : sub.status === "suspended"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-gray-500/10 text-gray-600"
                        }`}
                      >
                        {(sub.status || "active").toUpperCase()}
                      </span>
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="text-right space-x-1 py-3">
                      {sub.status !== "active" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                          onClick={() => updateSubStatus.mutate({ id: sub.id, action: "approve" })}
                          disabled={updateSubStatus.isPending}
                        >
                          Approve
                        </Button>
                      )}
                      {sub.status !== "suspended" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-amber-600 border-amber-300 hover:bg-amber-50"
                          onClick={() => updateSubStatus.mutate({ id: sub.id, action: "suspend" })}
                          disabled={updateSubStatus.isPending}
                        >
                          Suspend
                        </Button>
                      )}
                      {sub.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs"
                          onClick={() => updateSubStatus.mutate({ id: sub.id, action: "reject" })}
                          disabled={updateSubStatus.isPending}
                        >
                          Reject
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {(subscriptions.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      No subscription submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Screenshot Modal Preview */}
      {viewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-2xl bg-card p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between border-b pb-2">
              <span className="text-sm font-semibold">Payment Receipt Proof Screenshot</span>
              <button
                onClick={() => setViewScreenshot(null)}
                aria-label="Close modal"
                className="rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {viewScreenshot.toLowerCase().endsWith(".pdf") ? (
              <iframe src={viewScreenshot} className="h-[60vh] w-full rounded-xl border" title="Receipt PDF" />
            ) : (
              <img
                src={viewScreenshot}
                alt="Payment Receipt Screenshot"
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain mx-auto border"
              />
            )}
          </div>
        </div>
      )}

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
