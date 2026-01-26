"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/context/UserContext";
import DataTable, { Column } from "@/components/DataTable";
import { getVisibleColumns, setVisibleColumns as saveVisibleColumns } from "@/utils/localStorage";



interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const PAGE_SIZE = 10;
const MIN_VISIBLE_COLUMNS = 2;



export default function UsersPage() {
  const { role, loading } = useAuth();
  const { users, saveUser, addUser } = useUsers();
  const router = useRouter();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer",
    status: "active",
  });


  // SEARCH & FILTER STATE FROM URL
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const roleFilter = searchParams.get("role") ?? "all";
  const statusFilter = searchParams.get("status") ?? "all";
  const currentPage = Number(searchParams.get("page") ?? 1);

  // FUNCTION TO UPDATE QUERY PARAMS IN URL
  const updateQuery = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.replace(`?${params.toString()}`);
  };



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

  const handleAddUser = () => {
    // Basic validation
    if (!newUser.name || !newUser.email) {
      alert("Name and Email are required");
      return;
    }

    const userToAdd = {
      id: Date.now(), // simple unique ID
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    };

    addUser(userToAdd);     // 🔥 save to context + localStorage
    setShowAddUser(false); // close form

    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "viewer",
      status: "active",
    });
  };

  // PAGINATION (AFTER FILTERING)
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return {
        name: true,
        email: true,
        role: true,
        status: true,
      };
    }

    const stored = getVisibleColumns();

    if (stored) {
      const count = Object.values(stored).filter(Boolean).length;
      if (count >= MIN_VISIBLE_COLUMNS) {
        return stored;
      }
    }

    return {
      name: true,
      email: true,
      role: true,
      status: true,
    };
  });


  const columns: Column<User>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: "role",
      render: (user) =>
        role === "admin" ? (
          <select
            name={`role-${user.id}`}
            className="select-input"
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
          <span className={`tag-pill ${user.role}`}>
            {user.role}
          </span>
        ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (user) =>
        role === "admin" ? (
          <button
            className={`status-toggle-btn ${user.status === "active"
              ? "status-toggle-btn-active"
              : "status-toggle-btn-inactive"
              }`}
            onClick={() =>
              saveUser({
                ...user,
                status: user.status === "active" ? "inactive" : "active",
              })
            }
          >
            {user.status}
          </button>
        ) : (
          <span
            className={`tag-pill ${user.status === "active"
              ? "status-active"
              : "status-inactive"
              }`}
          >
            {user.status}
          </span>

        ),
    },
  ];

  const filteredColumns = columns.filter(
    (col) => visibleColumns[col.accessor as string]
  );
  const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;




  return (
    <section>
      <h1 className="page-heading">Users</h1>
      <p className="page-subtitle">
        Search, filter, and manage roles and status across your user base.
      </p>

      <div className="card-surface">


        {/* COLUMN VISIBILITY TOGGLE */}
        <div style={{ marginBottom: 15 }}>
          <strong style={{ fontSize: 13 }}>Show / Hide Columns</strong>

          <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
            {columns.map((col) => (
              <label
                key={String(col.accessor)}
                style={{ fontSize: 12, cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  name="checkbox"
                  checked={visibleColumns[col.accessor as string]}
                  disabled={
                    visibleColumns[col.accessor as string] && visibleColumnCount <= 2
                  }
                  onChange={() => {
                    const key = col.accessor as string;
                    const isCurrentlyVisible = visibleColumns[key];
                    if (isCurrentlyVisible && visibleColumnCount <= 2) {
                      return;
                    }
                    const updated = {
                      ...visibleColumns,
                      [key]: !visibleColumns[key],
                    };

                    setVisibleColumns(updated);
                    saveVisibleColumns(updated);

                  }}

                />{" "}
                {col.header}
              </label>
            ))}
          </div>
        </div>


        {/* SEARCH & FILTER UI */}
        <div className="filters-row">
          <div>
            <label className="field-label" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              name="search"
              className="text-input"
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) =>
                updateQuery({ search: e.target.value, page: 1 })
              }

            />
          </div>

          <div>
            <label className="field-label" htmlFor="roleFilter">
              Role
            </label>
            <select
              id="roleFilter"
              name="roleFilter"
              className="select-input"
              value={roleFilter}
              onChange={(e) =>
                updateQuery({ role: e.target.value, page: 1 })
              }

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
              name="statusFilter"
              className="select-input"
              value={statusFilter}
              onChange={(e) =>
                updateQuery({ status: e.target.value, page: 1 })
              }

            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* ADMIN ACTIONS */}
          {role === "admin" && (
            <div style={{ alignSelf: "flex-end" }}>
              <label className="field-label" style={{ visibility: "hidden" }}>
                Action
              </label>
              <button
                className="primary-btn"
                style={{ width: "auto", padding: "8px 16px" }}
                onClick={() => setShowAddUser(true)}
              >
                + Add User
              </button>
            </div>
          )}
          {showAddUser && role === "admin" && (
            <div
              className="modal-overlay"
              onClick={() => setShowAddUser(false)} // click outside closes
            >
              <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()} // prevent close on inside click
              >
                {/* HEADER */}
                <div className="modal-header">
                  <h3>Add New User</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowAddUser(false)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* FORM */}
                <div className="filters-row">
                  <input
                    className="text-input"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />

                  <input
                    className="text-input"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />

                  <select
                    className="select-input"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>

                  <select
                    className="select-input"
                    value={newUser.status}
                    onChange={(e) =>
                      setNewUser({ ...newUser, status: e.target.value })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* ACTIONS */}
                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                  <button
                    type="button"              // 🔑 VERY IMPORTANT
                    className="primary-btn"
                    onClick={handleAddUser}
                  >
                    Create User
                  </button>

                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setShowAddUser(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TABLE */}
        <DataTable<User>
          columns={filteredColumns}
          data={currentUsers}
          emptyMessage="No users found"
        />


        {/* PAGINATION */}
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => updateQuery({ page: currentPage - 1 })}

          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => updateQuery({ page: currentPage + 1 })}

          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}