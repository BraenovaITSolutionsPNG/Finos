"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Receipt,
  Landmark,
  Wallet,
  LineChart,
  FolderKanban,
  ShieldCheck,
  Search,
  BadgeCheck,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import { useState } from "react";

const FEATURES = [
  {
    icon: Receipt,
    title: "Invoicing & Payments",
    desc: "Send custom invoices, track receivables and auto-post every payment directly to the double-entry ledger.",
  },
  {
    icon: Landmark,
    title: "Banking & Reconciliation",
    desc: "Reconcile real bank accounts against your books so cash records are always 100% accurate.",
  },
  {
    icon: Wallet,
    title: "Payroll & Compensation",
    desc: "Automate salary cycles with gross pay, tax deductions, and net payouts calculated per employee.",
  },
  {
    icon: LineChart,
    title: "Budgets & Forecasting",
    desc: "Set monthly target spend by ledger account and compare live actual variance in real-time.",
  },
  {
    icon: FolderKanban,
    title: "Project Financials",
    desc: "Track client project budgets, billed invoices, and expenses in one aggregated workspace.",
  },
  {
    icon: ShieldCheck,
    title: "Audit & Compliance",
    desc: "Immutable change logs for full auditability, plus flexible GST and sales tax configurations.",
  },
  {
    icon: Search,
    title: "Global Enterprise Search",
    desc: "Locate any customer, vendor, invoice, or journal entry across your workspace in milliseconds.",
  },
  {
    icon: BadgeCheck,
    title: "Multi-Tenant Isolation",
    desc: "Manage multiple business entities under one roof with strictly isolated tenant data and RBAC permissions.",
  },
];

const STATS = [
  { value: "100%", label: "Double-entry balanced" },
  { value: "13+", label: "Finance modules" },
  { value: "PGK", label: "Localized for PNG" },
  { value: "∞", label: "Tenants per install" },
];

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-3.5">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/landing-bg.svg"
                alt="FinOS"
                width={160}
                height={32}
                className="dark:invert"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#features" className="transition hover:text-foreground">
                Features
              </a>
              <a href="#plans" className="transition hover:text-foreground">
                Pricing
              </a>
              <a href="#how" className="transition hover:text-foreground">
                How it works
              </a>
            </nav>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 transition hover:text-foreground hover:bg-muted/50"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95 hover:shadow-indigo-500/35"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {open && (
          <div className="border-t border-border bg-background px-6 py-4 md:hidden animate-fade-up">
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <a
                href="#features"
                className="py-1 text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Features
              </a>
              <a
                href="#plans"
                className="py-1 text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#how"
                className="py-1 text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                How it works
              </a>
              <hr className="my-2 border-border" />
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-center font-medium text-foreground/80 hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-center font-semibold text-white shadow-md"
                onClick={() => setOpen(false)}
              >
                Get started
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="relative overflow-hidden">
        {/* Background Aurora / Glow Effects */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 animate-aurora bg-[radial-gradient(circle_at_20%_20%,#4f46e5_0%,transparent_45%),radial-gradient(circle_at_80%_30%,#06b6d4_0%,transparent_45%),radial-gradient(circle_at_50%_80%,#a855f7_0%,transparent_50%)] opacity-30" />
          <div className="absolute -left-32 top-24 h-96 w-96 animate-float rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute -right-24 top-1/3 h-96 w-96 animate-float-slow rounded-full bg-cyan-400/20 blur-3xl" />
        </div>

        {/* HERO SECTION */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 text-center md:pt-24 md:pb-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-8 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Double-Entry Core for Modern Business</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl mb-6 animate-fade-up">
            Financial Operating System built for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              enterprise scale
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-xl mb-10 animate-fade-up">
            Streamline invoicing, bank reconciliation, payroll, budgeting, and audit compliance — all connected seamlessly to an automated double-entry ledger.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-95 hover:scale-[1.02]"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-7 py-3.5 font-semibold text-foreground backdrop-blur-md transition hover:bg-muted/80"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </section>

        {/* STATS SECTION */}
        <section id="stats" className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-8 shadow-xl">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center p-4">
                <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight mb-4">
              Everything your finance team needs
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground text-base md:text-lg">
              One platform, every financial module wired directly to the same double-entry accounting engine.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group animate-pop-in rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card/80 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/20 mb-4 transition group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING / PLANS SECTION */}
        <section id="plans" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight mb-4">
              Transparent Pricing Plans
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground text-base md:text-lg">
              Select the plan tailored to your organization size and accounting requirements.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "0",
                desc: "Ideal for solo entrepreneurs and micro-businesses.",
                features: ["1 User Account", "Chart of Accounts", "Basic Invoicing", "Standard Ledger"],
              },
              {
                name: "Starter",
                price: "19",
                desc: "Designed for small growing teams and businesses.",
                features: ["Up to 5 Users", "Invoices & Expense Bills", "Banking Reconciliation", "Standard Reports", "Tax Configuration"],
              },
              {
                name: "Pro",
                price: "49",
                desc: "Full suite for enterprise businesses and multi-entity operations.",
                features: [
                  "Unlimited Users",
                  "Project Finance & Costing",
                  "Automated Payroll Runs",
                  "Multi-Currency Support",
                  "Budgets & Forecasting",
                  "Audit Trail & Compliance",
                ],
              },
            ].map((plan, i) => {
              const isPro = i === 2;
              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                    isPro
                      ? "border-2 border-indigo-500/80 bg-card/90 shadow-2xl shadow-indigo-500/20"
                      : "border border-border/70 bg-card/40 backdrop-blur-md shadow-lg hover:border-border"
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground h-8">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold">${plan.price}</span>
                    <span className="text-sm font-medium text-muted-foreground">/month</span>
                  </div>

                  <ul className="space-y-3.5 mb-8 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-sm">
                        <div className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-indigo-500/10 text-indigo-500">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                        <span className="text-foreground/90 font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition shadow-md ${
                      isPro
                        ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:opacity-95 shadow-indigo-500/20"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    Get started
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight mb-4">
              How FinOS Works
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground text-base md:text-lg">
              Get up and running in minutes with automatic double-entry journal balance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                n: "01",
                t: "Create your workspace",
                d: "Register your organization and FinOS instantly provisions your chart of accounts and tenant environment.",
              },
              {
                n: "02",
                t: "Run daily operations",
                d: "Create invoices, record bills, reconcile bank feeds, and process payroll — all auto-posted to the general ledger.",
              },
              {
                n: "03",
                t: "Gain insight & comply",
                d: "Monitor real-time revenue trends, aging reports, budget variances, and maintain complete audit trail compliance.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="flex flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md p-8 transition hover:border-indigo-500/30"
              >
                <span className="text-5xl font-black bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-4">
                  {step.n}
                </span>
                <h3 className="font-bold text-xl mb-2">{step.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-border/60 bg-card/40 backdrop-blur-md py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/landing-bg.svg"
                alt="FinOS"
                width={140}
                height={28}
                className="dark:invert opacity-90"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} FinOS Platform. Financial Operating System for Business. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
              <a href="#features" className="hover:text-foreground transition">
                Features
              </a>
              <a href="#plans" className="hover:text-foreground transition">
                Pricing
              </a>
              <a href="#how" className="hover:text-foreground transition">
                How it works
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}