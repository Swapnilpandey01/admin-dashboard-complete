
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
