"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { role, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <div className="navbar-logo-badge">AD</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.04em" }}>
              Admin Dashboard
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>
              Role-based user management
            </span>
          </div>
        </div>
        <nav className="navbar-links">
          <Link href="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <Link href="/dashboard/users" className="navbar-link">
            Users
          </Link>
        </nav>
      </div>
      <div className="navbar-right">
        <div className="navbar-role-pill">
          <span style={{ opacity: 1 }}>Role:</span>
          <strong>{role}</strong>
        </div>
        <button className="navbar-logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
