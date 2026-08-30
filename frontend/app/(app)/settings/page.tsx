"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BusinessSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<BusinessSettings>({
    queryKey: ["business-settings"],
    queryFn: async () => (await api.get("/business-settings")).data,
  });

  const [form, setForm] = useState<BusinessSettings | null>(null);
  const live = form ?? data ?? null;

  const save = useMutation({
    mutationFn: async () => (await api.put("/business-settings", live)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business-settings"] });
      setForm(null);
    },
  });

  const uploadLogo = async (f: File) => {
    const fd = new FormData();
    fd.append("file", f);
    fd.append("folder", "logos");
    const up = await api.post("/upload", fd);
    setForm({ ...(live as BusinessSettings), logo_url: up.data.url });
  };

  const exportFile = async (kind: "customers" | "invoices") => {
    const res = await api.get(`/export/${kind}`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data as Blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kind}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (kind: "customers" | "invoices", file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    await api.post(`/import/${kind}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    qc.invalidateQueries({ queryKey: ["customers"] });
    qc.invalidateQueries({ queryKey: ["invoices"] });
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Settings</h1>
        <p className="text-sm text-muted-foreground">
          Company profile, fiscal calendar and data tools.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="col-span-2 flex items-center gap-4">
              {live?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={live.logo_url}
                  alt="logo"
                  className="h-14 w-14 rounded-lg border object-contain"
                />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-lg border bg-muted text-muted-foreground">
                  Logo
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <Upload className="h-4 w-4" /> Upload logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                />
              </label>
            </div>

            <div className="space-y-1">
              <Label>Company name</Label>
              <Input value={live?.company_name ?? ""} onChange={(e) => setForm({ ...(live as BusinessSettings), company_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Tax ID</Label>
              <Input value={live?.tax_id ?? ""} onChange={(e) => setForm({ ...(live as BusinessSettings), tax_id: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={live?.email ?? ""} onChange={(e) => setForm({ ...(live as BusinessSettings), email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={live?.phone ?? ""} onChange={(e) => setForm({ ...(live as BusinessSettings), phone: e.target.value })} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Address</Label>
              <Input value={live?.address ?? ""} onChange={(e) => setForm({ ...(live as BusinessSettings), address: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Default currency</Label>
              <Input value={live?.default_currency ?? ""} onChange={(e) => setForm({ ...(live as BusinessSettings), default_currency: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Fiscal year start month</Label>
              <Input type="number" min={1} max={12} value={live?.fiscal_year_start_month ?? 1} onChange={(e) => setForm({ ...(live as BusinessSettings), fiscal_year_start_month: Number(e.target.value) })} />
            </div>
            <Button type="submit" className="col-span-2" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import / Export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => exportFile("customers")}>
            Export customers (CSV)
          </Button>
          <Button variant="outline" onClick={() => exportFile("invoices")}>
            Export invoices (CSV)
          </Button>
          <label className="cursor-pointer rounded-md border px-3 py-2 text-sm">
            Import customers
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && importFile("customers", e.target.files[0])}
            />
          </label>
          <label className="cursor-pointer rounded-md border px-3 py-2 text-sm">
            Import invoices
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && importFile("invoices", e.target.files[0])}
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
