"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Account, Budget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BudgetsPage() {
  const qc = useQueryClient();
  const year = new Date().getFullYear();
  const [y, setY] = useState(year);

  // Load accounts for the dropdown
  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await api.get("/accounts");
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });

  const budgets = useQuery<Budget[]>({
    queryKey: ["budgets", y],
    queryFn: async () => {
      const res = await api.get(`/budgets?year=${y}`);
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });
  const comparison = useQuery<{ account_id: number; name: string; budget: number; actual: number }[]>({
    queryKey: ["budgets-comparison", y],
    queryFn: async () => {
      const res = await api.get(`/budgets/comparison?year=${y}`);
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });

  const [form, setForm] = useState({
    account_id: "",
    month: new Date().getMonth() + 1,
    amount: "",
    notes: "",
  });
  const create = useMutation({
    mutationFn: async () =>
      (await api.post("/budgets", {
        account_id: Number(form.account_id),
        month: Number(form.month),
        year: y,
        amount: Number(form.amount),
        notes: form.notes || undefined,
      })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets", y] });
      qc.invalidateQueries({ queryKey: ["budgets-comparison", y] });
      setForm({ ...form, account_id: "", amount: "", notes: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets & Forecasting</h1>
          <p className="text-sm text-muted-foreground">
            Plan by account/month and compare against actual spend.
          </p>
        </div>
        <Input
          type="number"
          className="w-28"
          value={y}
          onChange={(e) => setY(Number(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Set budget</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                create.mutate();
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <Label htmlFor="account_id">Account</Label>
                <select
                  id="account_id"
                  className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={form.account_id}
                  onChange={(e) => setForm({ ...form, account_id: e.target.value })}
                  required
                >
                  <option value="">Select account…</option>
                  {(accounts ?? []).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} — {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="number"
                  min={1}
                  max={12}
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Saving…" : "Save budget"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actual vs Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2">Account</th>
                  <th>Budget</th>
                  <th>Actual</th>
                  <th>Variance</th>
                </tr>
              </thead>
              <tbody>
                {(comparison.data ?? []).map((c) => (
                  <tr key={c.account_id} className="border-b">
                    <td className="py-2 font-medium">{c.name}</td>
                    <td>K{c.budget} PGK</td>
                    <td>K{c.actual} PGK</td>
                    <td className={c.actual > c.budget ? "text-destructive font-medium" : "text-green-600 font-medium"}>
                      {c.actual > c.budget ? "+" : ""}K{c.actual - c.budget} PGK
                    </td>
                  </tr>
                ))}
                {(comparison.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-muted-foreground">
                      No comparison data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
