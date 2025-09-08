// app/layout.tsx
import "../../(hmsdashboard)/globals.css";
import ProtectedLayoutClient from "./ProtectedLayoutClient";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
      </body>
    </html>
  );
}
