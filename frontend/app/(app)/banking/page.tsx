"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BankAccount, BankTransaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BankingPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<number | null>(null);

  const accounts = useQuery<BankAccount[]>({
    queryKey: ["bank-accounts"],
    queryFn: async () => (await api.get("/bank-accounts")).data,
  });

  const [form, setForm] = useState({
    name: "",
    bank_name: "",
    account_number: "",
    currency: "PGK",
    opening_balance: "0",
  });
  const createAccount = useMutation({
    mutationFn: async () =>
      (await api.post("/bank-accounts", {
        name: form.name,
        bank_name: form.bank_name || undefined,
        account_number: form.account_number || undefined,
        currency: form.currency,
        opening_balance: Number(form.opening_balance),
      })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-accounts"] });
      setForm({ name: "", bank_name: "", account_number: "", currency: "PGK", opening_balance: "0" });
    },
  });

  const accountId = selected ?? accounts.data?.[0]?.id ?? null;
  const transactions = useQuery<BankTransaction[]>({
    queryKey: ["bank-transactions", accountId],
    enabled: !!accountId,
    queryFn: async () =>
      (await api.get(`/bank-accounts/${accountId}/transactions`)).data,
  });
  const summary = useQuery<{ current_balance: number; reconciled: number; unreconciled: number }>({
    queryKey: ["bank-summary", accountId],
    enabled: !!accountId,
    queryFn: async () => (await api.get(`/bank-accounts/${accountId}/summary`)).data,
  });

  const [tx, setTx] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    reference: "",
    type: "credit",
    amount: "",
  });
  const addTx = useMutation({
    mutationFn: async () =>
      (await api.post(`/bank-accounts/${accountId}/transactions`, {
        date: tx.date,
        description: tx.description,
        reference: tx.reference || undefined,
        type: tx.type,
        amount: Number(tx.amount),
      })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-transactions", accountId] });
      qc.invalidateQueries({ queryKey: ["bank-summary", accountId] });
      setTx({ ...tx, description: "", reference: "", amount: "" });
    },
  });

  const reconcile = useMutation({
    mutationFn: async () => {
      const unreconciled = (transactions.data ?? []).filter((t) => !t.is_reconciled);
      await Promise.all(
        unreconciled.map((t) => api.post(`/bank-transactions/${t.id}/reconcile`, {}))
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-transactions", accountId] });
      qc.invalidateQueries({ queryKey: ["bank-summary", accountId] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Banking & Reconciliation</h1>
        <p className="text-sm text-muted-foreground">
          Track accounts, import statements and reconcile against the ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(accounts.data ?? []).map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={`block w-full rounded-md border px-3 py-2 text-left text-sm ${
                  a.id === accountId ? "border-primary bg-secondary" : ""
                }`}
              >
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">
                  bal K{a.current_balance} PGK
                </div>
              </button>
            ))}
            <div className="border-t pt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createAccount.mutate();
                }}
                className="space-y-2"
              >
                <Input
                  placeholder="Account name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Bank name"
                  value={form.bank_name}
                  onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                />
                <Input
                  placeholder="Opening balance (PGK)"
                  type="number"
                  value={form.opening_balance}
                  onChange={(e) =>
                    setForm({ ...form, opening_balance: e.target.value })
                  }
                />
                <Button type="submit" size="sm" disabled={createAccount.isPending}>
                  Add account
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <Button size="sm" variant="outline" onClick={() => reconcile.mutate()} disabled={!accountId}>
              Reconcile all
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.data && (
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium">
                <div>Balance: K{summary.data.current_balance} PGK</div>
                <div>Reconciled: K{summary.data.reconciled} PGK</div>
                <div>Unreconciled: K{summary.data.unreconciled} PGK</div>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTx.mutate();
              }}
              className="grid grid-cols-3 gap-2"
            >
              <Input type="date" value={tx.date} onChange={(e) => setTx({ ...tx, date: e.target.value })} required />
              <Input placeholder="Description" value={tx.description} onChange={(e) => setTx({ ...tx, description: e.target.value })} required />
              <Input type="number" placeholder="Amount (PGK)" value={tx.amount} onChange={(e) => setTx({ ...tx, amount: e.target.value })} required />
              <select
                className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                value={tx.type}
                onChange={(e) => setTx({ ...tx, type: e.target.value })}
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
              <Input placeholder="Reference" value={tx.reference} onChange={(e) => setTx({ ...tx, reference: e.target.value })} />
              <Button type="submit" disabled={addTx.isPending || !accountId}>
                Add
              </Button>
            </form>
            <table className="w-full text-sm">
              <tbody>
                {(transactions.data ?? []).map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="py-2">{t.date}</td>
                    <td>{t.description}</td>
                    <td className="text-right font-medium">{t.type === "debit" ? "-" : ""}K{t.amount} PGK</td>
                    <td className="text-right text-xs">
                      {t.is_reconciled ? "✓" : "pending"}
                    </td>
                  </tr>
                ))}
                {(transactions.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-muted-foreground">
                      No transactions.
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
