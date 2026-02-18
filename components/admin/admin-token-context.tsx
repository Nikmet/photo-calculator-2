"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

const STORAGE_KEY = "photo-calculator-admin-token";

type AdminTokenContextValue = {
  token: string;
  setToken: (value: string) => void;
};

const AdminTokenContext = createContext<AdminTokenContextValue | null>(null);

export function AdminTokenProvider({ children }: PropsWithChildren) {
  const [token, setTokenState] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return sessionStorage.getItem(STORAGE_KEY) ?? "";
  });

  const value = useMemo<AdminTokenContextValue>(
    () => ({
      token,
      setToken: (nextToken) => {
        setTokenState(nextToken);
        sessionStorage.setItem(STORAGE_KEY, nextToken);
      },
    }),
    [token],
  );

  return <AdminTokenContext.Provider value={value}>{children}</AdminTokenContext.Provider>;
}

export function useAdminToken() {
  const context = useContext(AdminTokenContext);
  if (!context) {
    throw new Error("useAdminToken must be used within AdminTokenProvider");
  }
  return context;
}
