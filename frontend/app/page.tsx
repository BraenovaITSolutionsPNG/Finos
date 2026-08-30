"use client";

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
  Building2,
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-3.5">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Fin<span className="text-indigo-600 dark:text-indigo-400">OS</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
              <a href="#features" className="transition hover:text-slate-900 dark:hover:text-white">
                Features
              </a>
              <a href="#plans" className="transition hover:text-slate-900 dark:hover:text-white">
                Pricing
              </a>
              <a href="#how" className="transition hover:text-slate-900 dark:hover:text-white">
                How it works
              </a>
            </nav>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02]"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {open && (
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 md:hidden animate-fade-up">
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <a
                href="#features"
                className="py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                Features
              </a>
              <a
                href="#plans"
                className="py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#how"
                className="py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                How it works
              </a>
              <hr className="my-2 border-slate-200 dark:border-slate-800" />
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-center font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-center font-semibold text-white shadow-md"
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
        {/* HERO SECTION */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-16 text-center md:pt-24 md:pb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-8 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Double-Entry Core for Modern Business</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl mb-6 leading-tight">
            Financial Operating System built for{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              enterprise scale
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400 md:text-xl mb-10 leading-relaxed">
            Streamline invoicing, bank reconciliation, payroll, budgeting, and audit compliance — all connected seamlessly to an automated double-entry ledger.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.02]"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-7 py-3.5 font-semibold text-slate-900 dark:text-white shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </section>

        {/* STATS SECTION */}
        <section id="stats" className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center p-4">
                <p className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-slate-900 dark:text-white mb-4">
              Everything your finance team needs
            </h2>
            <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-base md:text-lg">
              One platform, every financial module wired directly to the same double-entry accounting engine.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20 mb-4 transition group-hover:scale-105">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING / PLANS SECTION */}
        <section id="plans" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-slate-900 dark:text-white mb-4">
              Transparent Pricing Plans
            </h2>
            <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-base md:text-lg">
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
                      ? "border-2 border-indigo-600 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/20"
                      : "border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg"
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 h-8">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${plan.price}</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/month</span>
                  </div>

                  <ul className="space-y-3.5 mb-8 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-sm">
                        <div className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition shadow-md ${
                      isPro
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
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
            <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-slate-900 dark:text-white mb-4">
              How FinOS Works
            </h2>
            <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-base md:text-lg">
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
                className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition hover:border-indigo-500/50 shadow-md"
              >
                <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-4">
                  {step.n}
                </span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{step.t}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Fin<span className="text-indigo-600 dark:text-indigo-400">OS</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              © {new Date().getFullYear()} FinOS Platform. Financial Operating System for Business. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">
                Features
              </a>
              <a href="#plans" className="hover:text-slate-900 dark:hover:text-white transition">
                Pricing
              </a>
              <a href="#how" className="hover:text-slate-900 dark:hover:text-white transition">
                How it works
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}