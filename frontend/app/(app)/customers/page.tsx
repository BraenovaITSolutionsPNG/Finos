"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Customer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CustomersPage() {
  const qc = useQueryClient();
  const { data } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => (await api.get("/customers")).data,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tax_id: "",
  });

  const create = useMutation({
    mutationFn: async () => (await api.post("/customers", form)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setForm({ name: "", email: "", phone: "", tax_id: "" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground">
          People and businesses you invoice.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input id="tax_id" value={form.tax_id} onChange={(e) => setForm({ ...form, tax_id: e.target.value })} />
            </div>
            <Button type="submit" className="col-span-2" disabled={create.isPending}>
              {create.isPending ? "Saving…" : "Add customer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Tax ID</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.name}</td>
                  <td>{c.email ?? "—"}</td>
                  <td>{c.phone ?? "—"}</td>
                  <td>{c.tax_id ?? "—"}</td>
                </tr>
              ))}
              {(data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-muted-foreground">
                    No customers yet.
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
