"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !role) {
      router.replace("/login");
    }
  }, [role, loading, router]);

  // WAIT until auth hydration finishes
  if (loading) return null;
  if (!role) return null;

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}