// app/layout.tsx
import "../../(hmsdashboard)/globals.css";
import ProtectedLayoutClient from "./ProtectedLayoutClient";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DRS DERMA - User Dashboard",
  description: "DRS DERMA User Dashboard",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
      </body>
    </html>
  );
}
