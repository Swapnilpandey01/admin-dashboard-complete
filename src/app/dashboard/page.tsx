"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/context/UserContext";

export default function Dashboard() {
  const { role } = useAuth();
  const router = useRouter();
  const { users } = useUsers();

  useEffect(() => {
    if (!role) router.push("/login");
  }, [role]);

  if (!role) return null;

  const active = users.filter((u: { status: string; }) => u.status === "active").length;

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Total Users: {users.length}</p>
      <p>Active: {active}</p>
      <p>Inactive: {users.length - active}</p>
    </div>
  );
}

