"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Receipt,
  LogOut,
  Landmark,
  LineChart,
  FolderKanban,
  Wallet,
  ShieldCheck,
  Search,
  CreditCard,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Chart of Accounts", icon: BookOpen },
  { href: "/journal", label: "Journal", icon: FileText },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/expenses", label: "Bills & Expenses", icon: Receipt },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/tax-rates", label: "Tax Config", icon: Settings },
  { href: "/banking", label: "Banking", icon: Landmark },
  { href: "/budgets", label: "Budgets", icon: LineChart },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/payroll", label: "Payroll", icon: Wallet },
  { href: "/audit", label: "Audit Trail", icon: ShieldCheck },
  { href: "/search", label: "Search", icon: Search },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { tenant, user, logout } = useAuth();

  const NAV_ITEMS = user?.is_admin
    ? [...NAV, { href: "/admin", label: "Admin", icon: ShieldCheck }]
    : NAV;

  return (
    <aside className="flex w-60 flex-col border-r bg-background">
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <Building2 className="h-5 w-5 text-primary" />
        <div className="leading-tight">
          <p className="text-sm font-semibold">FinOS</p>
          <p className="text-xs text-muted-foreground">{tenant?.name ?? "—"}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-secondary font-medium text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <div className="mb-2 px-1 text-xs text-muted-foreground">
          {user?.name}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => logout().then(() => router.push("/login"))}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
}
