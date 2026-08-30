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
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  plan?: string;
  highlight?: boolean;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const BUSINESS_NAV: NavSection[] = [
  {
    section: "Core Operations",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/accounts", label: "Chart of Accounts", icon: BookOpen },
      { href: "/journal", label: "Journal Ledger", icon: FileText },
      { href: "/invoices", label: "Invoices", icon: FileText },
      { href: "/expenses", label: "Bills & Expenses", icon: Receipt },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/banking", label: "Banking & Feeds", icon: Landmark },
      { href: "/tax-rates", label: "Tax Config", icon: Settings },
    ],
  },
  {
    section: "Enterprise & Growth",
    items: [
      { href: "/budgets", label: "Budgets & Forecast", icon: LineChart, plan: "Pro" },
      { href: "/projects", label: "Project Financials", icon: FolderKanban, plan: "Pro" },
      { href: "/payroll", label: "Payroll Runs", icon: Wallet, plan: "Pro" },
      { href: "/audit", label: "Audit Trail", icon: ShieldCheck, plan: "Pro" },
    ],
  },
  {
    section: "Account",
    items: [
      { href: "/search", label: "Global Search", icon: Search },
      { href: "/subscription", label: "Subscription Plan", icon: CreditCard },
      { href: "/settings", label: "Business Settings", icon: Settings },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    section: "Platform Management",
    items: [
      { href: "/admin", label: "Platform Command Center", icon: ShieldAlert, highlight: true },
      { href: "/audit", label: "System Audit Trail", icon: ShieldCheck },
      { href: "/search", label: "Cross-Tenant Search", icon: Search },
      { href: "/settings", label: "Platform Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { tenant, user, logout } = useAuth();

  const NAV_SECTIONS = user?.is_admin ? ADMIN_NAV : BUSINESS_NAV;
  const currentPlan = tenant?.plan ? tenant.plan.toUpperCase() : "PRO";

  return (
    <aside className="flex w-64 flex-col border-r bg-background select-none">
      {/* Brand & Workspace Header */}
      <div className="flex flex-col border-b px-4 py-4 gap-1 bg-card/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white font-bold">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">FinOS</p>
              <p className="text-[11px] text-muted-foreground truncate max-w-[130px]">
                {tenant?.name ?? "—"}
              </p>
            </div>
          </div>

          {/* User Role Badge */}
          {user?.is_admin ? (
            <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-extrabold text-indigo-600 border border-indigo-500/30">
              SUPER ADMIN
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {currentPlan} PLAN
            </span>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto space-y-5 p-3">
        {NAV_SECTIONS.map((sec, idx) => (
          <div key={sec.section || idx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              {sec.section}
            </p>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-indigo-600 text-white font-semibold shadow-sm"
                        : item.highlight
                        ? "bg-indigo-500/10 text-indigo-600 font-semibold hover:bg-indigo-500/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    {/* Show Pro tag for enterprise features if not admin */}
                    {item.plan && !user?.is_admin && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {item.plan}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="border-t p-3 bg-card/40">
        <div className="mb-2 px-1 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 text-xs"
          onClick={() => logout().then(() => router.push("/login"))}
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </Button>
      </div>
    </aside>
  );
}
