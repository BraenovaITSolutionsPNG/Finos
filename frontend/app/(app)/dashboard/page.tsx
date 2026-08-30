"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Kpis } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert, ArrowRight, Sparkles, Building2, Users } from "lucide-react";

function currency(n: number, code?: string) {
  const formatted = new Intl.NumberFormat("en-PG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n ?? 0);
  return `K${formatted} ${code || "PGK"}`;
}

export default function DashboardPage() {
  const { tenant, user } = useAuth();

  const { data, isLoading } = useQuery<Kpis>({
    queryKey: ["dashboard-kpis"],
    queryFn: async () => (await api.get("/dashboard/kpis")).data,
    enabled: !!tenant,
  });

  const adminStats = useQuery<{ tenants_total: number; tenants_active: number; users_total: number }>({
    queryKey: ["admin-stats-summary"],
    enabled: !!user?.is_admin,
    queryFn: async () => (await api.get("/admin/stats")).data,
  });

  if (isLoading || !data) {
    return <p className="text-muted-foreground p-6">Loading dashboard…</p>;
  }

  const kpis = [
    { label: "Cash Position", value: data.cash },
    { label: "Accounts Receivable", value: data.receivables },
    { label: "Accounts Payable", value: data.payables },
    { label: "Net Profit", value: data.net_profit },
  ];

  return (
    <div className="space-y-6">
      {/* Platform Super-Admin Command Banner (Visible for Super Admin) */}
      {user?.is_admin && (
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-extrabold text-indigo-300 border border-indigo-500/30">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>PLATFORM SUPER-ADMIN CONTROL CENTER</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">System Oversight Mode</h2>
              <p className="text-xs text-indigo-200/80">
                Managing {adminStats.data?.tenants_total ?? "—"} registered tenant organizations across {adminStats.data?.users_total ?? "—"} users.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition"
            >
              Open Platform Admin Center <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Tenant Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Financial Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            General ledger accounting &amp; metrics for <span className="font-semibold text-foreground">{tenant?.name}</span>.
          </p>
        </div>

        {/* Business Customer Plan Badge */}
        {!user?.is_admin && (
          <div className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold bg-card">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Plan: {tenant?.plan ? tenant.plan.toUpperCase() : "PRO"}</span>
            <Link href="/subscription" className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
              Manage
            </Link>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">{k.label}</CardDescription>
              <CardTitle className="text-xl font-bold">
                {currency(k.value, data.currency)}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
            <CardDescription>Last 6 months recorded revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.revenue_trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Cash Position</CardTitle>
            <CardDescription>Balances per bank account</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={
                  data.cash_position.length
                    ? data.cash_position
                    : [{ name: "Cash", balance: data.cash }]
                }
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => currency(v, data.currency)} />
                <Bar dataKey="balance" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Receivables Aging</CardTitle>
            <CardDescription>Outstanding customer invoices by age</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.ar_aging}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(v: number) => currency(v, data.currency)} />
                <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Payables Aging</CardTitle>
            <CardDescription>Outstanding vendor bills by age</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.ap_aging}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(v: number) => currency(v, data.currency)} />
                <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
