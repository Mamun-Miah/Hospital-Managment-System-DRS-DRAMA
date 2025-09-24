// app/layout.tsx
import "../../(hmsdashboard)/globals.css";
import ProtectedLayoutClient from "./ProtectedLayoutClient";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DRS DERMA - User Dashboard",
  description: "DRS DERMA User Dashboard",
   icons: {
    icon: '/favicon.ico',            // default icon
    shortcut: '/favicon-32x32.png',  // used for pinned/tab shortcuts
    apple: '/apple-touch-icon.png',  // iOS
  },
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
