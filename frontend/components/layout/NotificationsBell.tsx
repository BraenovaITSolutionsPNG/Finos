"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Notification } from "@/lib/types";
import { Bell, CheckCheck } from "lucide-react";

export function NotificationsBell() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const list = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      // Backend returns paginated data: { data: [...], meta: {...} }
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
  });
  const count = useQuery<{ count: number }>({
    queryKey: ["notifications-unread"],
    queryFn: async () => (await api.get("/notifications/unread-count")).data,
  });

  const markAll = useMutation({
    mutationFn: async () => (await api.post("/notifications/read-all", {})).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
  const markOne = useMutation({
    mutationFn: async (id: number) => (await api.post(`/notifications/${id}/read`, {})).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });

  const unread = count.data?.count ?? 0;
  const items = (list.data ?? []).slice(0, 8);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-9 w-9 place-items-center rounded-md border border-input bg-background text-muted-foreground transition hover:bg-muted"
        aria-label="notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 animate-pop-in rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-semibold">Notifications</span>
            <button
              onClick={() => markAll.mutate()}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          </div>
          <ul className="max-h-80 overflow-auto">
            {items.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                You're all caught up.
              </li>
            )}
            {items.map((n) => (
              <li
                key={n.id}
                onClick={() => !n.read_at && markOne.mutate(n.id)}
                className={`cursor-pointer border-b px-3 py-2 text-sm last:border-0 ${
                  n.read_at ? "opacity-60" : ""
                }`}
              >
                <p className="font-medium">{n.title}</p>
                {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
