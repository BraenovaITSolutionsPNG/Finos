"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Plan, Subscription } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function SubscriptionPage() {
  const qc = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [paymentForm, setPaymentForm] = useState({
    payment_method: "bank_transfer",
    payment_reference: "",
    payment_notes: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const plans = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => (await api.get("/plans")).data,
  });

  const sub = useQuery<Subscription>({
    queryKey: ["subscription"],
    queryFn: async () => (await api.get("/subscription")).data,
  });

  const submitSubscription = useMutation({
    mutationFn: async () => {
      if (!selectedPlan) return;

      let payment_receipt_url: string | undefined;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "payment_receipts");
        const up = await api.post("/upload", fd);
        payment_receipt_url = up.data.url;
      }

      return (
        await api.post("/subscription", {
          plan_id: selectedPlan.id,
          payment_method: paymentForm.payment_method,
          payment_reference: paymentForm.payment_reference,
          payment_receipt_url,
          payment_notes: paymentForm.payment_notes,
        })
      ).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription"] });
      setSelectedPlan(null);
      setFile(null);
      setPaymentForm({
        payment_method: "bank_transfer",
        payment_reference: "",
        payment_notes: "",
      });
    },
  });

  const currentSub = sub.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription &amp; Plan Management</h1>
        <p className="text-sm text-muted-foreground">
          View current plan status or submit subscription payment proofs for approval.
        </p>
      </div>

      {/* Current Subscription Status Card */}
      {currentSub && (
        <Card className="border-indigo-500/30 bg-card/60">
          <CardContent className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Active Plan:</span>
                <span className="text-base font-bold text-foreground">{currentSub.plan?.name}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    currentSub.status === "active"
                      ? "bg-green-500/10 text-green-600"
                      : currentSub.status === "pending"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {currentSub.status === "pending"
                    ? "AWAITING ADMIN APPROVAL"
                    : (currentSub.status || "active").toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Billing Cycle: {currentSub.current_period_start ? new Date(currentSub.current_period_start).toLocaleDateString() : "—"} →{" "}
                {currentSub.current_period_end ? new Date(currentSub.current_period_end).toLocaleDateString() : "—"}
              </p>
            </div>

            {currentSub.status === "pending" && (
              <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Your payment proof has been submitted and is currently being reviewed by the platform administrator.</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {(plans.data ?? []).map((p) => {
          const isCurrent = currentSub?.plan?.slug === p.slug;
          return (
            <Card key={p.id} className={isCurrent ? "border-2 border-indigo-600 shadow-lg" : ""}>
              <CardHeader>
                <CardTitle className="text-xl">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-extrabold">
                  K{p.price}{" "}
                  <span className="text-xs font-bold text-indigo-600">PGK</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    /{p.interval}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {p.features?.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4"
                  variant={isCurrent ? "secondary" : "default"}
                  onClick={() => setSelectedPlan(p)}
                  disabled={isCurrent && currentSub?.status === "active"}
                >
                  {isCurrent
                    ? currentSub?.status === "pending"
                      ? "Pending Review"
                      : "Current Plan"
                    : `Subscribe (${p.price === 0 ? "Free" : `K${p.price} PGK`})`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Submission Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg animate-pop-in overflow-auto rounded-2xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-bold">Subscribe to {selectedPlan.name} Plan</h2>
                <p className="text-xs text-muted-foreground">
                  Amount: <span className="font-bold text-foreground">K{selectedPlan.price} PGK / {selectedPlan.interval}</span>
                </p>
              </div>
              <button onClick={() => setSelectedPlan(null)} aria-label="close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSubscription.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label>Payment Method</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium"
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  required
                >
                  <option value="bank_transfer">Bank Transfer (BSP / Kina Bank / ANZ)</option>
                  <option value="cellmoni">Digicel CellMoni Mobile Money</option>
                  <option value="credit_card">Credit / Debit Card</option>
                  <option value="cash_deposit">Direct Cash Deposit</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Payment Reference Number / Transaction ID</Label>
                <Input
                  placeholder="e.g. BSP Ref #12345678 or CellMoni ID"
                  value={paymentForm.payment_reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_reference: e.target.value })}
                  required={selectedPlan.price > 0}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Upload Payment Screenshot / Receipt Proof</Label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50 transition">
                  <Upload className="h-4 w-4" />
                  {file ? <span className="font-semibold text-foreground">{file.name}</span> : "Choose screenshot or PDF receipt"}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <Label>Payment Notes / Depositor Name</Label>
                <Input
                  placeholder="Optional notes or depositor name"
                  value={paymentForm.payment_notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_notes: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={submitSubscription.isPending}
              >
                {submitSubscription.isPending ? "Submitting Payment Proof…" : "Submit Subscription Request"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
