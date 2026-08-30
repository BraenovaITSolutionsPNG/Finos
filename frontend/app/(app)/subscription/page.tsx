"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Plan, Subscription } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  const plans = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => (await api.get("/plans")).data,
  });
  const sub = useQuery<Subscription>({
    queryKey: ["subscription"],
    queryFn: async () => (await api.get("/subscription")).data,
  });

  const subscribe = async (planId: number) => {
    await api.post("/subscription", { plan_id: planId });
    location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-sm text-muted-foreground">
          Current plan:{" "}
          <span className="font-medium">{sub.data?.plan?.name ?? "—"}</span>{" "}
          ({sub.data?.status})
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {(plans.data ?? []).map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold">
                {p.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{p.interval}
                </span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {p.features?.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={
                  sub.data?.plan?.slug === p.slug ? "secondary" : "default"
                }
                onClick={() => subscribe(p.id)}
                disabled={sub.data?.plan?.slug === p.slug}
              >
                {sub.data?.plan?.slug === p.slug ? "Current" : "Choose"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
