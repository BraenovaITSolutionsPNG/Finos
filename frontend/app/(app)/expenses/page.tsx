"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Vendor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExpensesPage() {
  const qc = useQueryClient();
  const { data: bills } = useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const res = await api.get("/bills");
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });
  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["vendors"],
    queryFn: async () => (await api.get("/vendors")).data,
  });

  const [vendorId, setVendorId] = useState("");
  const [number, setNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [items, setItems] = useState([
    { description: "", quantity: 1, unit_price: 0, tax_rate: 0 },
  ]);

  const create = useMutation({
    mutationFn: async () =>
      (
        await api.post("/bills", {
          vendor_id: Number(vendorId),
          number: number || null,
          issue_date: issueDate,
          status: "received",
          items: items.map((i) => ({
            description: i.description,
            quantity: Number(i.quantity),
            unit_price: Number(i.unit_price),
            tax_rate: Number(i.tax_rate ?? 0),
          })),
        })
      ).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bills"] });
      setNumber("");
      setItems([{ description: "", quantity: 1, unit_price: 0, tax_rate: 0 }]);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bills &amp; Expenses</h1>
        <p className="text-sm text-muted-foreground">Accounts payable.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New bill</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Vendor</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  {(vendors ?? []).map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Reference</Label>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Issue date</Label>
                <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Line items</Label>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input
                    className="col-span-5"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((x, j) =>
                          j === i ? { ...x, description: e.target.value } : x
                        )
                      )
                    }
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((x, j) =>
                          j === i ? { ...x, quantity: Number(e.target.value) } : x
                        )
                      )
                    }
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    placeholder="Unit price"
                    value={item.unit_price}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((x, j) =>
                          j === i ? { ...x, unit_price: Number(e.target.value) } : x
                        )
                      )
                    }
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    placeholder="Tax %"
                    value={item.tax_rate}
                    onChange={(e) =>
                      setItems((p) =>
                        p.map((x, j) =>
                          j === i ? { ...x, tax_rate: Number(e.target.value) } : x
                        )
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="col-span-1"
                    onClick={() => setItems((p) => p.filter((_, j) => j !== i))}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setItems((p) => [
                    ...p,
                    { description: "", quantity: 1, unit_price: 0, tax_rate: 0 },
                  ])
                }
              >
                Add line
              </Button>
            </div>

            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Saving…" : "Create bill"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2">Reference</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Total</th>
                <th className="text-right">Due</th>
              </tr>
            </thead>
            <tbody>
              {(bills ?? []).map((b: any) => (
                <tr key={b.id} className="border-b">
                  <td className="py-2">{b.number ?? "—"}</td>
                  <td>{b.vendor?.name ?? b.vendor_id}</td>
                  <td>{b.issue_date}</td>
                  <td>{b.status}</td>
                  <td className="text-right">K{b.total} PGK</td>
                  <td className="text-right">K{b.amount_due} PGK</td>
                </tr>
              ))}
              {(bills ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-muted-foreground">
                    No bills yet.
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
