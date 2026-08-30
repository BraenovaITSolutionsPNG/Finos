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

interface Line {
  account_id: string;
  debit: number;
  credit: number;
  description: string;
}

export default function JournalPage() {
  const qc = useQueryClient();
  const { data: entries } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => (await api.get("/journals")).data,
  });
  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => (await api.get("/accounts")).data,
  });

  const [date, setDate] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { account_id: "", debit: 0, credit: 0, description: "" },
    { account_id: "", debit: 0, credit: 0, description: "" },
  ]);

  const create = useMutation({
    mutationFn: async () =>
      (
        await api.post("/journals", {
          date,
          lines: lines.map((l) => ({
            account_id: Number(l.account_id),
            debit: Number(l.debit) || 0,
            credit: Number(l.credit) || 0,
            description: l.description,
          })),
        })
      ).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["journals"] });
      setLines([
        { account_id: "", debit: 0, credit: 0, description: "" },
        { account_id: "", debit: 0, credit: 0, description: "" },
      ]);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Journal</h1>
        <p className="text-sm text-muted-foreground">Double-entry posting.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New journal entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
            className="space-y-3"
          >
            <div className="space-y-1 max-w-xs">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              {lines.map((l, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <select
                    className="col-span-4 h-10 rounded-md border border-input bg-background px-2 text-sm"
                    value={l.account_id}
                    onChange={(e) =>
                      setLines((p) =>
                        p.map((x, j) =>
                          j === i ? { ...x, account_id: e.target.value } : x
                        )
                      )
                    }
                    required
                  >
                    <option value="">Account…</option>
                    {(accounts ?? []).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.code} — {a.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    className="col-span-3"
                    type="number"
                    placeholder="Debit"
                    value={l.debit}
                    onChange={(e) =>
                      setLines((p) =>
                        p.map((x, j) =>
                          j === i ? { ...x, debit: Number(e.target.value) } : x
                        )
                      )
                    }
                  />
                  <Input
                    className="col-span-3"
                    type="number"
                    placeholder="Credit"
                    value={l.credit}
                    onChange={(e) =>
                      setLines((p) =>
                        p.map((x, j) =>
                          j === i ? { ...x, credit: Number(e.target.value) } : x
                        )
                      )
                    }
                  />
                  <Input
                    className="col-span-2"
                    placeholder="Note"
                    value={l.description}
                    onChange={(e) =>
                      setLines((p) =>
                        p.map((x, j) =>
                          j === i ? { ...x, description: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setLines((p) => [
                    ...p,
                    { account_id: "", debit: 0, credit: 0, description: "" },
                  ])
                }
              >
                Add line
              </Button>
            </div>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Posting…" : "Post entry"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2">Date</th>
                <th>Description</th>
                <th className="text-right">Lines</th>
              </tr>
            </thead>
            <tbody>
              {(entries ?? []).map((e: any) => (
                <tr key={e.id} className="border-b">
                  <td className="py-2">{e.date}</td>
                  <td>{e.description ?? "—"}</td>
                  <td className="text-right">{e.lines?.length ?? 0}</td>
                </tr>
              ))}
              {(entries ?? []).length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-muted-foreground">
                    No entries yet.
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
