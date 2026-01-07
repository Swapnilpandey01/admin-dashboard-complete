"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/context/UserContext";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const PAGE_SIZE = 10;

export default function UsersPage() {
  const { role, loading } = useAuth();
  const { users, saveUser } = useUsers();
  const router = useRouter();

  // SEARCH & FILTER STATE (CORRECT PLACE)
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Protect route
  useEffect(() => {
    if (!loading && !role) {
      router.replace("/login");
    }
  }, [loading, role, router]);

  if (loading || !role) return null;

  // SEARCH
  const searchedUsers = users.filter(
    (user: { name: string; email: string; }) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // ROLE FILTER
  const roleFilteredUsers =
    roleFilter === "all"
      ? searchedUsers
      : searchedUsers.filter((u: { role: string; }) => u.role === roleFilter);

  // STATUS FILTER
  const filteredUsers =
    statusFilter === "all"
      ? roleFilteredUsers
      : roleFilteredUsers.filter((u: { status: string; }) => u.status === statusFilter);

  // PAGINATION (AFTER FILTERING)
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div style={{ padding: 40 }}>
      <h1>User Management</h1>

      {/* SEARCH & FILTER UI */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={8} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((user: User) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                {role === "admin" ? (
                  <select
                    value={user.role}
                    onChange={(e) =>
                      saveUser({
                        ...user,
                        role: e.target.value as "admin" | "viewer",
                      })
                    }
                  >
                    <option value="admin">admin</option>
                    <option value="viewer">viewer</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>

              <td>
                {role === "admin" ? (
                  <button
                    onClick={() =>
                      saveUser({
                        ...user,
                        status:
                          user.status === "active"
                            ? "inactive"
                            : "active",
                      })
                    }
                  >
                    {user.status}
                  </button>
                ) : (
                  user.status
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div style={{ marginTop: 20 }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 12px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}