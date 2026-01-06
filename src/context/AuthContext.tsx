
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Role = "admin" | "viewer" | null;

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const r = localStorage.getItem("role") as Role;
    if (r) setRole(r);
  }, []);

  const login = (r: Role) => {
    localStorage.setItem("role", r!);
    setRole(r);
  };

  const logout = () => {
    localStorage.removeItem("role");
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
