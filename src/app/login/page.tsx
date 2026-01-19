"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    // MOCK ROLE CHECK
    const role =
      email.endsWith("@admin.com") ? "admin" : "viewer";

    login(role);
    router.push("/dashboard");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 30% 20%, #6366f1, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            AD
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                color: "#0f172a",
              }}
            >
              Admin Dashboard
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Role-based user management
            </span>
          </div>
        </div>

        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}>
          <div className="field-group">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="text-input"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" onClick={handleLogin}>
            Sign in
          </button>
        </form>

        <p className="login-demo">
          <strong>Quick demo</strong>
          <br />
          <span>admin@admin.com</span> → Admin
          <br />
          <span>user@gmail.com</span> → Viewer
        </p>
      </div>
    </div>
  );
}