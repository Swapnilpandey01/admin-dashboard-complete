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
    <section>
      <h1 className="page-heading">Users</h1>
      <p className="page-subtitle">
        Search, filter, and manage roles and status across your user base.
      </p>

      <div className="card-surface">
        {/* SEARCH & FILTER UI */}
        <div className="filters-row">
          <div>
            <label className="field-label" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              className="text-input"
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="roleFilter">
              Role
            </label>
            <select
              id="roleFilter"
              className="select-input"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="statusFilter">
              Status
            </label>
            <select
              id="statusFilter"
              className="select-input"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="data-table-container">
          <table className="data-table">
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
                        className="select-input"
                        style={{ minWidth: 120, paddingTop: 6, paddingBottom: 6 }}
                        value={user.role}
                        onChange={(e) =>
                          saveUser({
                            ...user,
                            role: e.target.value as "admin" | "viewer",
                          })
                        }
                      >
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span
                        className={`tag-pill ${
                          user.role === "admin" ? "admin" : "viewer"
                        }`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>

                  <td>
                    {role === "admin" ? (
                      <button
                        className={`status-toggle-btn ${
                          user.status === "active"
                            ? "status-toggle-btn-active"
                            : "status-toggle-btn-inactive"
                        }`}
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
                      <span
                        className={`tag-pill ${
                          user.status === "active" ? "admin" : "viewer"
                        }`}
                      >
                        {user.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}