"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Receipt,
  Landmark,
  Wallet,
  ShieldCheck,
  LineChart,
  FolderKanban,
  Search,
  BadgeCheck,
  Menu,
  X,
} from "lucide-react";
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
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.55), rgba(2,6,23,0.78)), url('/landing-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-aurora bg-[radial-gradient(circle_at_20%_20%,#4f46e5_0%,transparent_45%),radial-gradient(circle_at_80%_30%,#06b6d4_0%,transparent_45%),radial-gradient(circle_at_50%_80%,#a855f7_0%,transparent_50%)] opacity-40" />
        <div className="absolute -left-32 top-24 h-96 w-96 animate-float rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 animate-float-slow rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-80 w-80 animate-float rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </span>
            FinOS
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how" className="transition hover:text-white">How it works</a>
            <a href="#stats" className="transition hover:text-white">Why FinOS</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-105 hover:shadow-cyan-400/40"
            >
              Get started
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="mx-4 animate-pop-in rounded-2xl glass p-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm">
              <a href="#features" onClick={() => setOpen(false)} className="text-white/80">Features</a>
              <a href="#how" onClick={() => setOpen(false)} className="text-white/80">How it works</a>
              <a href="#stats" onClick={() => setOpen(false)} className="text-white/80">Why FinOS</a>
              <Link href="/login" className="text-white/80">Sign in</Link>
              <Link href="/register" className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-2 text-center font-semibold">
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 text-center md:pt-24">
        <div className="mx-auto inline-flex animate-fade-up items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-white/80">
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          Financial operating system for business
        </div>

        <h1 className="mx-auto mt-6 max-w-3xl animate-fade-up text-4xl font-bold leading-tight md:text-6xl [animation-delay:80ms]">
          Run your business finances on{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent">
            autopilot
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-base text-white/70 md:text-lg [animation-delay:160ms]">
          Invoicing, banking, payroll, tax and reporting, all on a correct,
          auditable double-entry ledger. Built for Papua New Guinea, ready to
          scale to every business you serve.
        </p>

        <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:240ms] sm:flex-row">
          <Link
            href="/register"
            className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-7 py-3.5 font-semibold text-white shadow-xl shadow-indigo-500/30 transition hover:scale-105 hover:shadow-cyan-400/40"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-2xl glass px-7 py-3.5 font-medium text-white transition hover:bg-white/20"
          >
            Sign in to demo
          </Link>
        </div>

        {/* Floating glass mock card */}
        <div className="mx-auto mt-16 max-w-3xl animate-pop-in [animation-delay:360ms]">
          <div className="glass-strong rounded-3xl p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm font-semibold">Cash position</p>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">Live</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {[
                { l: "Cash", v: "K 52,400" },
                { l: "Receivables", v: "K 12,900" },
                { l: "Payables", v: "K 8,200" },
              ].map((c) => (
                <div key={c.l} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs text-white/60">{c.l}</p>
                  <p className="mt-1 text-lg font-semibold">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Everything your finance team needs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-white/60">
          One platform, every module wired to the same double-entry core.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <p className="mt-1.5 text-sm text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-4 rounded-3xl glass-strong p-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="bg-gradient-to-r from-indigo-300 to-cyan-200 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold md:text-4xl text-center mb-12">
            Pricing Plans
          </h2>
          <p className="text-white/60 text-center mb-12">
            Choose the plan that fits your business needs
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '0',
                interval: '/month',
                features: ['1 user', 'Basic accounting'],
                isPro: false,
                bg: 'from-indigo-500/10 to-cyan-400/10',
                border: 'from-indigo-500 to-cyan-400',
                textColor: 'indigo-400',
                borderColor: 'indigo-300',
              },
              {
                name: 'Starter',
                price: '19',
                interval: '/month',
                features: ['5 users', 'Invoicing', 'Reports', 'Banking'],
                isPro: false,
                bg: 'from-indigo-500/10 to-cyan-400/10',
                border: 'from-indigo-500 to-cyan-400',
                textColor: 'indigo-400',
                borderColor: 'indigo-300',
              },
              {
                name: 'Pro',
                price: '49',
                interval: '/month',
                features: ['Unlimited users', 'Projects', 'Payroll', 'Multi-currency', 'Budgets', 'Audit'],
                isPro: true,
                bg: 'from-indigo-500/15 to-cyan-400/15',
                border: 'from-indigo-500/80 to-cyan-400/80',
                textColor: 'indigo-300',
                borderColor: 'indigo-200',
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`
                  rounded-2xl glass p-6 transition-colors hover:border-indigo-300 hover:bg-indigo-100/20 ${plan.isPro ? 'shadow-xl' : ''}
                  ${plan.bg}
                `}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-lg font-semibold text-${plan.textColor}">{plan.name}</h3>
                  <span className="text-white/60">
                    {plan.price}{plan.interval}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-white/60">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="mt-1 flex-shrink-0 h-4 w-4 text-${plan.isPro ? 'indigo-300' : 'indigo-400'}"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13h13M5 13l7 7-7 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold md:text-4xl">How it works</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Create your workspace", d: "Sign up and FinOS provisions your chart of accounts and tenant instantly." },
            { n: "02", t: "Run the day-to-day", d: "Invoice, pay bills, reconcile banks and run payroll, the ledger stays balanced automatically." },
            { n: "03", t: "See & comply", d: "Dashboards, audit logs and tax config keep you in control and ready for any review." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl glass p-6">
              <p className="text-sm font-semibold text-cyan-300">{s.n}</p>
              <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-white/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 text-center shadow-2xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <h2 className="text-3xl font-bold md:text-4xl">Ready to take control of your finances?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Spin up your workspace in seconds. No credit card, no spreadsheets.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href="/register"
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-8 py-4 font-semibold text-white shadow-xl shadow-indigo-500/30 transition hover:scale-105 hover:shadow-cyan-400/40"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
        FinOS, Financial Operating System for Business · Built for Papua New Guinea
      </footer>
    </div>
  );
}
