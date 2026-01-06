"use client";
import { useEffect } from "react";
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

export default function UsersPage() {
  const { role } = useAuth();
  const { users, saveUser } = useUsers();
  const router = useRouter();

  // 🔒 Protect route
  useEffect(() => {
    if (!role) {
      router.push("/login");
    }
  }, [role, router]);

  if (!role) return null;

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
          {users.map((user: User) => (
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
    </div>
  );
}
