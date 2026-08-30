"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TaxRate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TaxRatesPage() {
  const qc = useQueryClient();
  const { data } = useQuery<TaxRate[]>({
    queryKey: ["tax-rates"],
    queryFn: async () => (await api.get("/tax-rates")).data,
  });

  const [form, setForm] = useState({
    name: "",
    rate: "",
    type: "GST",
    is_default: false,
  });

  const create = useMutation({
    mutationFn: async () =>
      (await api.post("/tax-rates", {
        name: form.name,
        rate: Number(form.rate),
        type: form.type,
        is_default: form.is_default,
      })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tax-rates"] });
      setForm({ name: "", rate: "", type: "GST", is_default: false });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tax Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Define GST, VAT and withholding rates applied to invoices and bills.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add tax rate</CardTitle>
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rate">Rate %</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) =>
                    setForm({ ...form, is_default: e.target.checked })
                  }
                />
                Default
              </label>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Saving…" : "Add rate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax rates</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2">Name</th>
                <th>Type</th>
                <th>Rate</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-2">{t.name}</td>
                  <td>{t.type}</td>
                  <td>{t.rate}%</td>
                  <td>{t.is_default ? "Yes" : "—"}</td>
                </tr>
              ))}
              {(data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-muted-foreground">
                    No tax rates yet.
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
