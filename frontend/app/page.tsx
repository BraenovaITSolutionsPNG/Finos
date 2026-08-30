"use client";

import Image from "next/image";
import Link from "next/link";
import { Receipt, Landmark, Wallet, LineChart, FolderKanban, ShieldCheck, Search, BadgeCheck, Menu, X } from "lucide-react";
import { useState } from "react";

const FEATURES = [
  { icon: Receipt, title: "Invoicing & Payments", desc: "Send invoices, track receivables and auto-post every payment to the ledger." },
  { icon: Landmark, title: "Banking & Reconciliation", desc: "Reconcile accounts against the books so cash always matches." },
  { icon: Wallet, title: "Payroll", desc: "Run salary cycles with gross, deductions and net pay computed for you." },
  { icon: LineChart, title: "Budgets & Forecasting", desc: "Plan by account and compare actual spend against your budget." },
  { icon: FolderKanban, title: "Project Finance", desc: "Track project budgets, invoiced and billed amounts in one view." },
  { icon: ShieldCheck, title: "Audit & Compliance", desc: "Immutable trail of every change, plus built-in GST/tax config." },
  { icon: Search, title: "Global Search", desc: "Find any customer, invoice or account across your workspace instantly." },
  { icon: BadgeCheck, title: "Multi-tenant", desc: "One platform, many isolated businesses, safe and scalable by design." },
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
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/landing-bg.svg"
              alt="FinOS"
              width={180}
              height={36}
              className="dark:invert"
            />
          </div>
          {/* Desktop nav */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 transition hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-center font-semibold text-white"
            >
              Get started
            </Link>
          </div>
          {/* Mobile hamburger */}
          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {/* Mobile dropdown */}
        {open && (
          <div className="border-t border-border bg-background px-6 py-4 md:hidden animate-fade-up">
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-center font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative pt-20">
        {/* Aurora background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 animate-aurora bg-[radial-gradient(circle_at_20%_20%,#4f46e5_0%,transparent_45%),radial-gradient(circle_at_80%_30%,#06b6d4_0%,transparent_45%),radial-gradient(circle_at_50%_80%,#a855f7_0%,transparent_50%)] opacity-40" />
          <div className="absolute -left-32 top-24 h-96 w-96 animate-float rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -right-24 top-1/3 h-96 w-96 animate-float-slow rounded-full bg-cyan-400/25 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          {/* Stats Section */}
          <section id="stats" className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:py-16">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Features Section */}
          <section id="features" className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-center text-3xl font-bold md:text-4xl mb-6">
              Everything your finance team needs
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
              One platform, every module wired to the same double-entry core.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="group animate-pop-in rounded-2xl glass p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl hover:shadow-indigo-500/20"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/80 to-cyan-400/80 shadow-lg shadow-indigo-500/20">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Plans Section */}
          <section id="plans" className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold md:text-5xl tracking-tight text-center mb-8">
                Pricing Plans
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
                Choose the plan that fits your business needs
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[{
                  name: "Free",
                  price: "0",
                  features: ["1 user", "Basic accounting"],
                }, {
                  name: "Starter",
                  price: "19",
                  features: ["5 users", "Invoicing", "Reports", "Banking"],
                }, {
                  name: "Pro",
                  price: "49",
                  features: ["Unlimited users", "Projects", "Payroll", "Multi-currency", "Budgets", "Audit"],
                }].map((plan, i) => {
                  const isPro = i === 2;
                  return (
                    <div
                      key={plan.name}
                      className={`rounded-3xl glass p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                        isPro
                          ? "border-2 border-indigo-400/60 bg-gradient-to-br from-indigo-600/15 to-purple-500/15 hover:shadow-indigo-500/20"
                          : "border border-white/15 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:shadow-indigo-50/10"
                      }`}
                    >
                      <div className="flex items-baseline justify-between mb-6">
                        <h3 className={`text-2xl font-bold ${isPro ? "text-indigo-200" : "text-gray-300"}`}>
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-white font-bold text-xl">${plan.price}</span>
                          <span className="text-white/60 text-xs font-medium">/month</span>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-center gap-3">
                            <svg
                              className="h-4 w-4 text-indigo-400 flex-shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-white/80 text-sm">{feat}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/register"
                        className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition hover:opacity-90 ${
                          isPro
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        Get started
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-center text-3xl font-bold md:text-4xl">How it works</h2>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[{
                n: "01", t: "Create your workspace", d: "Sign up and FinOS provisions your chart of accounts and tenant instantly.",
              }, {
                n: "02", t: "Run the day-to-day", d: "Invoice, pay bills, reconcile banks and run payroll, the ledger stays balanced automatically.",
              }, {
                n: "03", t: "See & comply", d: "Dashboards, audit logs and tax config keep you in control and ready for any review.",
              }].map((step) => (
                <div key={step.n} className="flex items-start">
                  <span className="text-5xl font-bold text-indigo-600 mr-4">{step.n}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{step.t}</h3>
                    <p className="text-gray-400 text-sm">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}