"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, clearToken, getToken, setToken } from "@/lib/api";

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  plan: string;
  status: string;
  country: string | null;
  currency: string;
  locale: string;
  role?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  current_tenant_id: number | null;
  is_admin: boolean;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  switchTenant: (tenantId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  tenant_name: string;
  country?: string;
  currency?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tenant: null,
    tenants: [],
    loading: true,
  });

  async function refresh() {
    if (!getToken()) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setState({
        user: data.user,
        tenant: data.tenant,
        tenants: data.tenants ?? [],
        loading: false,
      });
    } catch {
      clearToken();
      setState({ user: null, tenant: null, tenants: [], loading: false });
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setState({
      user: data.user,
      tenant: data.tenant,
      tenants: data.tenants ?? [],
      loading: false,
    });
  }

  async function register(payload: RegisterPayload) {
    const { data } = await api.post("/auth/register", payload);
    setToken(data.token);
    setState({
      user: data.user,
      tenant: data.tenant,
      tenants: [data.tenant],
      loading: false,
    });
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      clearToken();
      setState({ user: null, tenant: null, tenants: [], loading: false });
    }
  }

  async function switchTenant(tenantId: number) {
    const { data } = await api.post(`/tenants/${tenantId}/switch`);
    setState((s) => ({
      ...s,
      tenant: data.tenant,
      user: s.user ? { ...s.user, current_tenant_id: tenantId } : s.user,
    }));
  }

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, switchTenant, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
