"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AuditLog } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuditPage() {
  const { data } = useQuery<AuditLog[]>({
    queryKey: ["audit-logs"],
    queryFn: async () => (await api.get("/audit-logs")).data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Trail</h1>
        <p className="text-sm text-muted-foreground">
          Immutable record of create / update / delete activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2">When</th>
                <th>Event</th>
                <th>Record</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="py-2">{new Date(l.created_at).toLocaleString()}</td>
                  <td>{l.event}</td>
                  <td>
                    {l.auditable_type}#{l.auditable_id}
                  </td>
                  <td>{l.ip_address ?? "—"}</td>
                </tr>
              ))}
              {(data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-muted-foreground">
                    No audit events.
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
