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
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentUsers = users.slice(startIndex, startIndex + PAGE_SIZE);

  // Protect route
  useEffect(() => {
    if (loading || !role) {
      router.replace("/login");
    }
  }, [loading, role, router]);

  if (loading || !role) return null;

  return (
    <div style={{ padding: 40 }}>
      <h1>User Management</h1>

      <table
        border={1}
        cellPadding={8}
        cellSpacing={0}
        style={{ marginTop: 20 }}
      >
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

              {/* ROLE */}
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

              {/* STATUS */}
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

       {/* PAGINATION CONTROLS  */}

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
