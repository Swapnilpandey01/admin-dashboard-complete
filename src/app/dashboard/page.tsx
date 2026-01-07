"use client";

import { useUsers } from "@/context/UserContext";

export default function DashboardPage() {
  const { users } = useUsers();

  const totalUsers = users.length;
  const activeUsers = users.filter((u: { status: string; }) => u.status === "active").length;
  const inactiveUsers = totalUsers - activeUsers;

  const adminUsers = users.filter((u: { role: string; }) => u.role === "admin").length;
  const viewerUsers = users.filter((u: { role: string; }) => u.role === "viewer").length;

  const activePercentage =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const inactivePercentage = 100 - activePercentage;

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Overview</h1>
      <p style={{ color: "#727988ff", marginBottom: 28 }}>
        High-level snapshot of your user base and activity.
      </p>

      {/* TOP SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <DashboardCard
          title="Total users"
          value={totalUsers}
          subtitle="All accounts currently in the system"
          color="#2563eb"
        />

        <DashboardCard
          title="Active"
          value={activeUsers}
          subtitle="Users marked as active"
          color="#22c55e"
        />

        <DashboardCard
          title="Inactive"
          value={inactiveUsers}
          subtitle="Users currently inactive"
          color="#f97316"
        />
      </div>

      {/* SECOND ROW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 24,
        }}
      >
        {/* ROLE DISTRIBUTION */}
        <SectionCard title="Role distribution">
          <StatRow label="Admins" value={adminUsers} />
          <StatRow label="Viewers" value={viewerUsers} />
        </SectionCard>

        {/* ACTIVITY ANALYTICS */}
        <SectionCard title="User activity">
          <ProgressRow
            label="Active users"
            percentage={activePercentage}
            color="#22c55e"
          />
          <ProgressRow
            label="Inactive users"
            percentage={inactivePercentage}
            color="#f97316"
          />
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function DashboardCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ color: "#6b7280", marginBottom: 8 }}>{title}</p>
      <h2 style={{ fontSize: 32, color, marginBottom: 6 }}>{value}</h2>
      <p style={{ fontSize: 14, color }}>{subtitle}</p>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginBottom: 16 }}>{title}</h3>
      {children}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 12,
        fontSize: 15,
      }}
    >
      <span style={{ color: "#374151" }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProgressRow({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          marginBottom: 6,
        }}
      >
        <span>{label}</span>
        <strong>{percentage}%</strong>
      </div>

      <div
        style={{
          height: 10,
          background: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
          }}
        />
      </div>
    </div>
  );
}