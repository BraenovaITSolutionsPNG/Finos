"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Employee, PayrollRun } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PayrollPage() {
  const qc = useQueryClient();
  const employees = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => (await api.get("/employees")).data,
  });
  const runs = useQuery<PayrollRun[]>({
    queryKey: ["payroll-runs"],
    queryFn: async () => (await api.get("/payroll")).data,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    salary: "",
    pay_frequency: "monthly",
  });
  const addEmployee = useMutation({
    mutationFn: async () =>
      (await api.post("/employees", {
        name: form.name,
        email: form.email || undefined,
        position: form.position || undefined,
        salary: Number(form.salary),
        pay_frequency: form.pay_frequency,
      })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      setForm({ name: "", email: "", position: "", salary: "", pay_frequency: "monthly" });
    },
  });

  const [period, setPeriod] = useState({
    start: new Date().toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  });
  const process = useMutation({
    mutationFn: async () =>
      (await api.post("/payroll/process", { period_start: period.start, period_end: period.end })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payroll-runs"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payroll</h1>
        <p className="text-sm text-muted-foreground">
          Manage employees and run salary cycles.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addEmployee.mutate();
            }}
            className="mb-4 grid grid-cols-2 gap-2"
          >
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <Input placeholder="Salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
            <select
              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
              value={form.pay_frequency}
              onChange={(e) => setForm({ ...form, pay_frequency: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="weekly">Weekly</option>
            </select>
            <Button type="submit" disabled={addEmployee.isPending}>
              Add employee
            </Button>
          </form>
          <table className="w-full text-sm">
            <tbody>
              {(employees.data ?? []).map((e) => (
                <tr key={e.id} className="border-b">
                  <td className="py-2">{e.name}</td>
                  <td>{e.position ?? "—"}</td>
                  <td className="text-right">K{e.salary} PGK</td>
                </tr>
              ))}
              {(employees.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-muted-foreground">
                    No employees yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Payroll runs</CardTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              process.mutate();
            }}
            className="flex gap-2"
          >
            <Input type="date" value={period.start} onChange={(e) => setPeriod({ ...period, start: e.target.value })} />
            <Input type="date" value={period.end} onChange={(e) => setPeriod({ ...period, end: e.target.value })} />
            <Button type="submit" disabled={process.isPending}>
              Run payroll
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2">Period</th>
                <th>Status</th>
                <th>Staff</th>
                <th>Gross</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {(runs.data ?? []).map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2">{r.period_start} → {r.period_end}</td>
                  <td>{r.status}</td>
                  <td>{r.employee_count}</td>
                  <td>K{r.total_gross} PGK</td>
                  <td>K{r.total_net} PGK</td>
                </tr>
              ))}
              {(runs.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-muted-foreground">
                    No runs yet.
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
