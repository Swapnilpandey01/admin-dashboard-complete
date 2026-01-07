"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { role, logout } = useAuth();

  return (
    <div style={{ padding: 16, borderBottom: "1px solid #ccc" }}>
      <Link href="/dashboard">Dashboard</Link> |{" "}
      <Link href="/dashboard/users">Users</Link>

      <span style={{ marginLeft: 940 }}>
        Role: <strong>{role}</strong>
      </span>

      <button
        style={{ marginLeft: 10 }}
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
