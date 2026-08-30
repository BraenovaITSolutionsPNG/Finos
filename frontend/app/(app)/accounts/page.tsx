"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Account } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccountsPage() {
  const qc = useQueryClient();
  const { data } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => (await api.get("/accounts")).data,
  });

  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "asset",
    subtype: "",
  });

  const create = useMutation({
    mutationFn: async () => (await api.post("/accounts", form)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      setForm({ code: "", name: "", type: "asset", subtype: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chart of Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Double-entry ledgers per organization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
            className="grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            <div className="space-y-1">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {["asset", "liability", "equity", "income", "expense"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="subtype">Subtype</Label>
              <Input
                id="subtype"
                placeholder="bank, cash…"
                value={form.subtype}
                onChange={(e) => setForm({ ...form, subtype: e.target.value })}
              />
            </div>
            <Button type="submit" className="col-span-2 md:col-span-4" disabled={create.isPending}>
              {create.isPending ? "Saving…" : "Add account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2">Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Subtype</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2">{a.code}</td>
                  <td>{a.name}</td>
                  <td>{a.type}</td>
                  <td>{a.subtype ?? "—"}</td>
                </tr>
              ))}
              {(data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-muted-foreground">
                    No accounts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
