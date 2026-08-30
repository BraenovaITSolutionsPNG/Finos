"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProjectsPage() {
  const qc = useQueryClient();
  const { data } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });
  const [selected, setSelected] = useState<number | null>(null);
  const projectId = selected ?? data?.[0]?.id ?? null;
  const financials = useQuery<{ invoiced: number; billed: number; budget: number }>({
    queryKey: ["project-financials", projectId],
    enabled: !!projectId,
    queryFn: async () => (await api.get(`/projects/${projectId}/financials`)).data,
  });

  const [form, setForm] = useState({
    name: "",
    code: "",
    budget: "",
    status: "active",
  });
  const create = useMutation({
    mutationFn: async () =>
      (await api.post("/projects", {
        name: form.name,
        code: form.code || undefined,
        budget: Number(form.budget),
        status: form.status,
      })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setForm({ name: "", code: "", budget: "", status: "active" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Finance</h1>
        <p className="text-sm text-muted-foreground">
          Track project budgets, invoices and spend.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>New project</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                create.mutate();
              }}
              className="space-y-3"
            >
              <Input
                placeholder="Project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                placeholder="Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
              <Input
                placeholder="Budget"
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                required
              />
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On hold</option>
              </select>
              <Button type="submit" disabled={create.isPending}>
                Add project
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                {(data ?? []).map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    className={`cursor-pointer border-b ${
                      p.id === projectId ? "bg-secondary" : ""
                    }`}
                  >
                    <td className="py-2 font-medium">{p.name}</td>
                    <td>{p.code ?? "—"}</td>
                    <td>{p.status}</td>
                    <td className="text-right">K{p.budget} PGK</td>
                  </tr>
                ))}
                {(data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-muted-foreground">
                      No projects yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {financials.data && (
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div>Invoiced: K{financials.data.invoiced} PGK</div>
                <div>Billed: K{financials.data.billed} PGK</div>
                <div>Budget: K{financials.data.budget} PGK</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
