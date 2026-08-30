"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Customer, Invoice, InvoiceItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, FileText, Upload, Send, Download } from "lucide-react";

export default function InvoicesPage() {
  const qc = useQueryClient();
  const { data: invoices } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => (await api.get("/invoices")).data,
  });
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => (await api.get("/customers")).data,
  });

  const [selected, setSelected] = useState<number | null>(null);
  const detail = useQuery<Invoice>({
    queryKey: ["invoice", selected],
    enabled: !!selected,
    queryFn: async () => (await api.get(`/invoices/${selected}`)).data,
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    number: "",
    customer_id: "",
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: "",
    status: "draft",
    currency: "PGK",
    notes: "",
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unit_price: 0, tax_rate: 0 },
  ]);
  const [file, setFile] = useState<File | null>(null);

  const create = useMutation({
    mutationFn: async () => {
      let attachment_url: string | undefined;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "uploads");
        const up = await api.post("/upload", fd);
        attachment_url = up.data.url;
      }
      return (
        await api.post("/invoices", {
          ...form,
          customer_id: Number(form.customer_id),
          items: items.map((i) => ({
            description: i.description,
            quantity: Number(i.quantity),
            unit_price: Number(i.unit_price),
            tax_rate: Number(i.tax_rate ?? 0),
          })),
          attachment_url,
        })
      ).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      setShowForm(false);
      setForm({ ...form, number: "", due_date: "", notes: "" });
      setItems([{ description: "", quantity: 1, unit_price: 0, tax_rate: 0 }]);
      setFile(null);
    },
  });

  const send = useMutation({
    mutationFn: async (id: number) => (await api.post(`/invoices/${id}/send`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoice", selected] }),
  });

  const downloadPdf = async (id: number) => {
    const res = await api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Create, send and track customer invoices.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>New invoice</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>All invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2">Number</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(invoices ?? []).map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelected(inv.id)}
                    className={`cursor-pointer border-b ${
                      inv.id === selected ? "bg-secondary" : ""
                    }`}
                  >
                    <td className="py-2 font-medium">{inv.number}</td>
                    <td>{inv.customer?.name ?? "—"}</td>
                    <td>{inv.issue_date}</td>
                    <td>{inv.status}</td>
                    <td className="text-right">
                      {inv.currency} {inv.total}
                    </td>
                  </tr>
                ))}
                {(invoices ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-muted-foreground">
                      No invoices yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            {!selected && (
              <p className="text-sm text-muted-foreground">
                Select an invoice to view line items.
              </p>
            )}
            {detail.data && (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {detail.data.number}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                    {detail.data.status}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Customer: </span>
                  {detail.data.customer?.name ?? "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Total: </span>
                  <span className="font-semibold">
                    {detail.data.currency} {detail.data.total}
                  </span>{" "}
                  (due {detail.data.amount_due})
                </div>
                {detail.data.attachment_url && (
                  <a
                    href={detail.data.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <FileText className="h-4 w-4" /> Attachment
                  </a>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => send.mutate(detail.data.id)}
                    disabled={send.isPending}
                  >
                    <Send className="h-4 w-4" /> Send
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadPdf(detail.data.id)}
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                </div>
                <table className="w-full border-t pt-2">
                  <tbody>
                    {(detail.data.items ?? []).map((it, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-1">{it.description || "—"}</td>
                        <td className="text-right">
                          {it.quantity} × {it.unit_price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl animate-pop-in overflow-auto rounded-2xl border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New invoice</h2>
              <button onClick={() => setShowForm(false)} aria-label="close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                create.mutate();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Number</Label>
                  <Input
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Customer</Label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={form.customer_id}
                    onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                    required
                  >
                    <option value="">Select…</option>
                    {(customers ?? []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Issue date</Label>
                  <Input
                    type="date"
                    value={form.issue_date}
                    onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Due date</Label>
                  <Input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {["draft", "sent", "partially_paid", "paid", "void", "overdue"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Currency</Label>
                  <Input
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Line items</Label>
                {items.map((it, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) =>
                        setItems(
                          items.map((x, j) =>
                            j === i ? { ...x, description: e.target.value } : x
                          )
                        )
                      }
                    />
                    <Input
                      type="number"
                      className="w-20"
                      value={it.quantity}
                      onChange={(e) =>
                        setItems(
                          items.map((x, j) =>
                            j === i ? { ...x, quantity: Number(e.target.value) } : x
                          )
                        )
                      }
                    />
                    <Input
                      type="number"
                      className="w-28"
                      placeholder="Unit price"
                      value={it.unit_price}
                      onChange={(e) =>
                        setItems(
                          items.map((x, j) =>
                            j === i ? { ...x, unit_price: Number(e.target.value) } : x
                          )
                        )
                      }
                    />
                    <Input
                      type="number"
                      className="w-20"
                      placeholder="Tax %"
                      value={it.tax_rate}
                      onChange={(e) =>
                        setItems(
                          items.map((x, j) =>
                            j === i ? { ...x, tax_rate: Number(e.target.value) } : x
                          )
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setItems(items.filter((_, j) => j !== i))}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setItems([
                      ...items,
                      { description: "", quantity: 1, unit_price: 0, tax_rate: 0 },
                    ])
                  }
                >
                  + Add item
                </Button>
              </div>

              <div className="space-y-1">
                <Label>Attachment (PDF / image)</Label>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <Upload className="h-4 w-4" />
                  {file ? file.name : "Choose file"}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="space-y-1">
                <Label>Notes</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={create.isPending} className="w-full">
                {create.isPending ? "Saving…" : "Create invoice"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
