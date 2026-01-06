
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
      <button onClick={() => { login("admin"); router.push("/dashboard"); }}>
        Login as Admin
      </button>
      <br /><br />
      <button onClick={() => { login("viewer"); router.push("/dashboard"); }}>
        Login as Viewer
      </button>
    </div>
  );
}
