"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function getSearchParam(name: string, urlParams: URLSearchParams): string {
  return urlParams.get(name) ?? "";
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQ(getSearchParam("q", params));
  }, []);

  const { data } = useQuery<Record<string, { id: number; label: string }[]>>({
    queryKey: ["search", q],
    enabled: q.length >= 2,
    queryFn: async () => (await api.get(`/search?q=${encodeURIComponent(q)}`)).data,
  });

  const types = ["customers", "vendors", "accounts", "invoices", "bills", "employees", "projects"];

  const navigateTo = (type: string, id: number) => {
    window.location.href = `/search?q=${encodeURIComponent(q)}&id=${id}&type=${type}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Global Search</h1>
        <p className="text-sm text-muted-foreground">
          Find customers, vendors, accounts, invoices and more.
        </p>
      </div>

      <Input
        placeholder="Search…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-md"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {types.map((t) => (
          <Card key={t}>
            <CardHeader>
              <CardTitle className="capitalize">{t.replace("_", " ")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm">
                {(data?.[t] ?? []).map((r) => (
                  <li
                    key={r.id}
                    className="border-b py-2 cursor-pointer hover:bg-muted"
                    onClick={() => navigateTo(t, r.id)}
                  >
                    {r.label}
                  </li>
                ))}
                {(data?.[t] ?? []).length === 0 && (
                  <li className="text-muted-foreground">—</li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}