
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { setRole, getRole, clearRole } from "@/utils/localStorage";

type Role = "admin" | "viewer" | null;

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = getRole() as Role;
    if (storedRole) {
      setRoleState(storedRole);
    }
    setLoading(false); // 🔑 important
  }, []);

  const login = (r: Role) => {
    setRole(r!);
    setRoleState(r);
  };

  const logout = () => {
    clearRole();
    setRoleState(null);
  };

  return (
    <AuthContext.Provider value={{ role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);