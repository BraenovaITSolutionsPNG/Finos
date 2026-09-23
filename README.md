# FinOS — Financial Operating System for Business

FinOS is a multi-tenant, double-entry accounting platform that lets a business
run its money operations in one place — invoicing, expenses, banking,
payroll, tax and reporting — on a correct, auditable foundation. It is built
to be operated as a SaaS: one deployment serves many isolated customer
organizations ("tenants"), with a platform admin above them all.

> Localized for Papua New Guinea: PGK currency, GST-style tax, `en_PG` locale.

---

## What it's for

- **Business owners / finance teams** use their own tenant workspace day to day.
- **The platform operator** (`admin@finos.app`) manages all tenants, users and
  subscriptions from a single admin console.

### Problems it solves
- **Get paid** — invoices, accounts receivable, payment tracking. Journal
  entries are posted automatically, so the ledger is always balanced.
- **Pay others** — bills/expenses (AP), vendors, payments.
- **Bank** — reconcile bank accounts against the books; cash always matches.
- **Pay people** — payroll runs compute gross, deductions and net pay.
- **Stay compliant** — tax-rate configuration (GST/VAT) and an immutable audit
  trail of every create/update/delete.
- **Plan & control** — budgets vs actuals, project finance (budget vs invoiced/billed).
- **See the picture** — dashboard KPIs, general ledger, audit logs, global search.
- **Grow** — plans/subscriptions so FinOS can be monetized per customer tier.

---

## Why it's different
- **Double-entry correctness:** every invoice, bill and payment auto-posts
  balanced entries to the general ledger via the `Ledger` service — no manual
  bookkeeping, no unbalanced books.
- **Tenant isolation:** one database, many logically separated businesses via
  `TenantContext` + a `TenantScoped` global scope on models.
- **Auditability:** an `Auditable` trait records activity for compliance and trust.
- **Policy-based access:** formal Laravel Policies enforce per-tenant
  view/create/update/delete; roles gate sensitive actions.

---

## Modules
| Area | What it does |
|------|--------------|
| Chart of Accounts / Journal | Double-entry GL, opening balances |
| Invoices / Bills / Payments | AR/AP with automatic GL posting |
| Tax Config | GST/VAT rates applied to transactions |
| Banking | Accounts, transactions, reconciliation, summaries |
| Budgets | Per-account/month plans vs actual GL spend |
| Projects | Budgets + invoiced/billed roll-up |
| Payroll | Employees + salary runs (gross/deductions/net) |
| Audit Trail | Immutable event history |
| Notifications / Search | In-app alerts, cross-entity search |
| Subscriptions | Plans, trials, tenant billing |
| Import / Export | CSV for customers & invoices |
| Business Settings | Company profile + fiscal calendar |
| Admin Platform | Cross-tenant stats, tenant suspend/activate |

---

## Architecture
- **Backend:** Laravel 12 (PHP 8.2), PostgreSQL, Sanctum auth, Laravel Policies.
  - `app/Services/Ledger.php` — auto-posting engine.
  - `app/Support/TenantContext.php` + `TenantScoped` — tenant isolation.
  - `app/Http/Resources/UserResource.php` carries `is_admin` for the UI.
- **Frontend:** Next.js 15 / React 19 (TypeScript), TanStack Query.
  - Pages under `frontend/app/(app)/`; API client in `frontend/lib/api.ts`.
  - Sidebar is role-aware (Admin link only for `is_admin` users).
  - List endpoints return plain arrays (use `.data`, not `.data.data`).

### Data flow (example)
`Create Invoice → Ledger.postInvoice() → JournalEntry (AR ↑, Sales ↑) →
Dashboard KPIs / Ledger / Audit Log`. Payments post the cash side and clear AR.

---

## Tech stack
- Backend: Laravel 12, PostgreSQL (Docker `finos-postgres`, postgres:16), Sanctum.
- Frontend: Next.js 15, React 19, Tailwind, shadcn-style UI, TanStack Query.
- API on `:8000`, UI on `:3000`.

---

## Getting started

### Prerequisites
- PHP 8.2+ with `pdo_pgsql` + `pgsql` extensions
- Node.js 18+ (tested on 24)
- Docker (for PostgreSQL)

### 1. Database
```bash
docker compose up -d        # starts finos-postgres on :5432 (db/user/pass: finos)
cd backend
cp .env.example .env        # ensure DB_CONNECTION=pgsql, DB_DATABASE=finos
composer install
php artisan key:generate
php artisan migrate:fresh --seed
```

### 2. API server
```bash
php artisan serve --port=8000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm install
npm run dev                 # http://localhost:3000
```

### Demo & admin credentials
| Role | Email | Password |
|------|-------|----------|
| Platform admin | `admin@finos.app` | `password` |
| Demo tenant owner | `demo@finos.pg` | `password` |

> Change the admin password before any real deployment.

### Tests
```bash
cd backend
php artisan test            # 16 tests, 75 assertions
```

---

## License
Proprietary — BraeNova.
