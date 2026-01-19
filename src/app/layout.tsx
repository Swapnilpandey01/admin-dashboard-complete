
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <UserProvider>
            <div className="app-shell">
              <main className="app-main">{children}</main>
            </div>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
