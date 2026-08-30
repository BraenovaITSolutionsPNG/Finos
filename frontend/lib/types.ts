export interface Kpis {
  cash: number;
  receivables: number;
  payables: number;
  net_profit: number;
  currency: string;
  revenue_trend: { month: string; revenue: number }[];
  cash_position: { id: number; name: string; balance: number }[];
  ar_aging: { label: string; amount: number }[];
  ap_aging: { label: string; amount: number }[];
}

export interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  subtype: string | null;
  parent_id: number | null;
  description: string | null;
  is_active: boolean;
  opening_balance: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  tax_id: string | null;
  currency: string | null;
  is_active: boolean;
}

export interface Vendor {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  tax_id: string | null;
  currency: string | null;
  is_active: boolean;
}

export interface InvoiceItem {
  id?: number;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
}

export interface Invoice {
  id: number;
  number: string;
  customer_id: number;
  customer?: Customer;
  issue_date: string;
  due_date: string | null;
  status: string;
  currency: string | null;
  subtotal: number;
  tax: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  notes: string | null;
  attachment_url?: string | null;
  items?: InvoiceItem[];
}

export interface Bill {
  id: number;
  number: string | null;
  vendor_id: number;
  vendor?: Vendor;
  issue_date: string;
  due_date: string | null;
  status: string;
  total: number;
  amount_due: number;
}

export interface TaxRate {
  id: number;
  name: string;
  rate: number;
  type: string;
  is_default: boolean;
  is_active: boolean;
}

export interface BankAccount {
  id: number;
  name: string;
  bank_name: string | null;
  account_number: string | null;
  currency: string;
  opening_balance: number;
  current_balance: number;
  is_active: boolean;
}

export interface BankTransaction {
  id: number;
  bank_account_id: number;
  date: string;
  description: string;
  reference: string | null;
  type: string;
  amount: number;
  is_reconciled: boolean;
}

export interface Budget {
  id: number;
  account_id: number;
  year: number;
  month: number;
  amount: number;
  notes: string | null;
  account?: Account;
}

export interface Project {
  id: number;
  name: string;
  code: string | null;
  status: string;
  customer_id: number | null;
  customer?: Customer;
  start_date: string | null;
  end_date: string | null;
  budget: number;
  description: string | null;
  invoiced?: number;
  billed?: number;
}

export interface Employee {
  id: number;
  name: string;
  email: string | null;
  position: string | null;
  salary: number;
  currency: string;
  pay_frequency: string;
  hired_at: string | null;
  is_active: boolean;
}

export interface Payslip {
  id: number;
  employee_id: number;
  employee?: Employee;
  gross: number;
  deductions: number;
  net: number;
}

export interface PayrollRun {
  id: number;
  period_start: string;
  period_end: string;
  status: string;
  employee_count: number;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  payslips?: Payslip[];
}

export interface AuditLog {
  id: number;
  event: string;
  auditable_type: string | null;
  auditable_id: number | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  price: number;
  interval: string;
  trial_days: number;
  features: string[];
  is_active: boolean;
}

export interface Subscription {
  id: number;
  status: string;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  plan?: Plan;
}

export interface BusinessSettings {
  company_name: string | null;
  tax_id: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  fiscal_year_start_month: number;
  default_currency: string | null;
  logo_url: string | null;
}
